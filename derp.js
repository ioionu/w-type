var GAME = GAME || {};

GAME.GameElement = function() {
  this.size = function(){
    return {
      'w': this.view.texture.width
     ,'h': this.view.texture.height
    }
  }
};

GAME.GameElement.prototype.x = function(){
  return this.view.position.x;
};

GAME.GameElement.prototype.y = function(){
  return this.view.position.y;
};

// end game element

GAME.Mech = function() {
  this.position = new PIXI.Point();
  this.frames = [
    PIXI.Texture.fromFrame("mech01.png")
   ,PIXI.Texture.fromFrame("mech02.png")
   ,PIXI.Texture.fromFrame("mech03.png")
  ];
  this.view = new PIXI.MovieClip(this.frames);
  this.view.animationSpeed = 0.20;
  this.view.play();
  this.view.anchor.x = 0.5;
  this.view.anchor.y = 0.5;
  this.view.position.y = 240;
  this.view.position.x = 100;
  this.realAnimationSpeed = 0.20;
};

GAME.Mech.constructor = GAME.Mech;

GAME.Mech.prototype = new GAME.GameElement();

GAME.Mech.prototype.derp = function() {
  console.log("derp");
};

GAME.Mech.prototype.update = function() {
  this.view.animationSpeed = this.realAnimationSpeed;
  p = {
    'x': this.view.position.x
   ,'y': this.view.position.y
   ,'w': this.view.width
   ,'h': this.view.height
   ,'rw': renderer.width
   ,'rh': renderer.height
   ,'m':'inside'
  };
  if(k_right) {
    p.x = this.view.position
    if(checkBounds(this.view.position.x + MECHSPEED, p.y, p.w, p.h, p.rw, p.rh, p.m)){
      this.view.position.x += MECHSPEED;
    }
  }
  
  if(k_left) {
    if(checkBounds(this.view.position.x - MECHSPEED, p.y, p.w, p.h, p.rw, p.rh, p.m)){
      this.view.position.x -= MECHSPEED/2;
    }
  }
  
  if(k_up) {
    if(checkBounds(p.x, this.view.position.y - MECHSPEED, p.w, p.h, p.rw, p.rh, p.m)){
      this.view.position.y -= MECHSPEED;
    }
  }
  
  if(k_down) {
    if(checkBounds(p.x, this.view.position.y + MECHSPEED, p.w, p.h, p.rw, p.rh, p.m)){
      this.view.position.y += MECHSPEED;
    }
  }
};

//end mech

GAME.Bullet = function(param) {

  this.BULLET_SPEED = 10;
  this.frames = [
    PIXI.Texture.fromFrame("bullet01.png")
   ,PIXI.Texture.fromFrame("bullet02.png")
   ,PIXI.Texture.fromFrame("bullet03.png")
  ];
  this.view = new PIXI.MovieClip(this.frames);
  this.view.animationSpeed = 0.05;
  this.view.play();
  this.view.anchor.x = this.view.anchor.y = 0.5;
  this.view.position.x = param.x;
  this.view.position.y = param.y;
  
};

GAME.Bullet.constructor = GAME.Bullet;

GAME.Bullet.prototype = new GAME.GameElement();

GAME.Bullet.prototype.update = function() {
  this.view.position.x += this.BULLET_SPEED;
};

function fireBullet() {
  //createjs.Sound.play("peow");
  if(fire_next > FIRERATE){
    console.log("peow!");
    i = bullets.push( new GAME.Bullet({'x': mech.x(), 'y': mech.y()}) );
    stage.addChild(bullets[i-1].view);
    fire_next = 0;
  }
};
//end bullet

GAME.Baddy = function() {

  this.SPEED = 1;
  this.YMOD = 0.1;
  this.YBASE = Math.random()*600; // TODO get this from stage height
  this.YPOWER = Math.random()*100;

  this.frames = [
    PIXI.Texture.fromFrame("baddy01.png")
   ,PIXI.Texture.fromFrame("baddy02.png")
   ,PIXI.Texture.fromFrame("baddy03.png")
  ];

  this.view = new PIXI.MovieClip(this.frames);
  this.view.animationSpeed = 0.20;
  this.view.play();
  this.view.anchor.x = this.view.anchor.y = 0.5;
  this.view.position.x = 800; //TODO get this from stage width
  this.view.position.y = this.YBASE;
};

GAME.Baddy.constructor = GAME.Baddy;
GAME.Baddy.prototype = new GAME.GameElement();

GAME.Baddy.prototype.update = function(){
  this.view.position.x -= this.SPEED;
  this.view.position.y = (Math.sin( (this.x() * this.YMOD) ) * this.YPOWER) + this.YBASE;
  this.YPOWER -= this.YPOWER * (this.YMOD/100);
};

function addBaddy() {
  i = baddies.push( new GAME.Baddy() );
  stage.addChild(baddies[i-1].view);
};
//end baddy

function hitTest(a, b) {
  hx = a.x() - b.x();
  hy = a.y() - b.y();
  dist = Math.sqrt(hx*hx+hy*hy);
  width_a = ((a.size()).h)/2;
  width_b = ((b.size()).h)/2;
  return dist <= width_a + width_b;
}

var load_queue;
var stage;
var renderer;
var mech;

var KEYCODE_ENTER = 13;   //usefull keycode
var KEYCODE_SPACE = 32;   //usefull keycode
var KEYCODE_UP = 38;    //usefull keycode
var KEYCODE_LEFT = 37;    //usefull keycode
var KEYCODE_RIGHT = 39;   //usefull keycode
var KEYCODE_W = 87;     //usefull keycode
var KEYCODE_A = 65;     //usefull keycode
var KEYCODE_D = 68;     //usefull keycode
var KEYCODE_S = 83;     //usefull keycode
//register key functions
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

var k_left, k_right, k_up, k_down, k_shoot;
var bullets = [];
var baddies = [];
var baddie_rate = 100;
var baddie_next;
  
var MECHSPEED = 5;
var FIRERATE = 20;
var fire_next;

function init() {
  loader = new PIXI.AssetLoader(['SpriteSheet.json']);
  loader.load();
  loader.onComplete = fuckShit;
}

function fuckShit() {
  var WIDTH = 800;
  var HEIGHT = 600;
  stage = new PIXI.Stage(0x000000);

  // let pixi choose WebGL or canvas
  renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);
  // set the canvas width and height to fill the screen
  renderer.view.style.display = "block";
  renderer.view.style.width = "100%"
  renderer.view.style.height = "100%"

  // attach render to page
  document.body.appendChild(renderer.view);
  baddie_next = fire_next = 0;

  mech = new GAME.Mech();
  stage.addChild(mech.view);
  requestAnimFrame( animate );
}

function checkBounds(x,y,h,w,sw,sh, mode) {

  if(mode == 'inside'){

    if(x - w/2 > 0 && x + w/2 < sw && y - h/2 > 0 && y + h/2 < sh){return true;}
    else {return false;}
  }
  else if(mode == 'outside'){

    if(x + w/2 > 0 && x - w/2 < sw && y + h/2 > 0 && y - h/2 < sh){return true;}
    else {return false;}
  }
  console.log("derp... checkbounds spacked out");
  return false;
}

function animate() {
  mech.update();
  requestAnimFrame( animate );
  
  // shooth bullet
  fire_next++;
  if(k_shoot) {
    fireBullet(); 
  }

  // move bullets
  for(bullet in bullets) {
    bullets[bullet].update();
  }

  // move bad guys
  for(baddy in baddies) {
    baddies[baddy].update();
  }

  // add bad guy
  //console.log(baddie_next, baddie_rate);
  if(baddie_next > baddie_rate) {
    addBaddy();
    baddie_next = 0;
  } else {
    baddie_next++;
  }

  // test for hits
  for(baddy in baddies) {
    if(hitTest(mech, baddies[baddy])) {
      console.log("dead");
      //baddies.splice(baddy, 1);
      stage.removeChild(mech.view);
    }
    for(bullet in bullets) {
      if(hitTest(bullets[bullet], baddies[baddy])) {
        console.log("hit!!");
        stage.removeChild(baddies[baddy].view);
        stage.removeChild(bullets[bullet].view);
        baddies.splice(baddy, 1);
        bullets.splice(bullet, 1);
      } 
    }
  }

  //draw
  renderer.render(stage);
}

//allow for WASD and arrow control scheme
function handleKeyDown(e) {
  //console.log(e.keyCode);
  //cross browser issues exist
  if(!e){ var e = window.event; }

  switch(e.keyCode) {
    case KEYCODE_SPACE: k_shoot = true; return false;
    case KEYCODE_A: k_left = true; return false;
    case KEYCODE_D: k_right = true; return false;
    case KEYCODE_W: k_up = true; return false;
    case KEYCODE_S: k_down = true; return false;
    case KEYCODE_ENTER:  if(canvas.onclick == handleClick){ handleClick(); }return false;
  }
}

function handleKeyUp(e) {
  //cross browser issues exist
  if(!e){ var e = window.event; }
  switch(e.keyCode) {
    case KEYCODE_SPACE: k_shoot = false; return false; break;
    case KEYCODE_A: k_left = false; return false; break;
    case KEYCODE_D: k_right = false; return false; break;
    case KEYCODE_W: k_up = false; return false; break;
    case KEYCODE_S: k_down = false; return false; break;
  }
}


