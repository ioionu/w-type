var GAME = GAME || {};

GAME.GameElement = function() {
  this.active = true;
  this.size = function(){
    return {
      'w': this.view.texture.width
     ,'h': this.view.texture.height
    }
  }
};

GAME.GameElement.prototype.x = function(x){
  if(typeof x !== 'undefined'){
    this.view.position.x = x;
  }
  return this.view.position.x;
};

GAME.GameElement.prototype.y = function(y){
  if(typeof y !== 'undefined') {
    this.view.position.y = y;
  }
  return this.view.position.y;
};

GAME.GameElement.prototype.right = function(){
  return this.view.position.x - this.view.width/2;
}
GAME.GameElement.prototype.die = function(){
  stage.removeChild(this.view);
  this.active = false;
}
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

/*
 * {'x': this.x()-50, 'y': this.y()};
 * */
GAME.Bullet = function(param) {

  this.BULLET_SPEED = 5;
  this.frames = [
    PIXI.Texture.fromFrame("bullet01.png")
   ,PIXI.Texture.fromFrame("bullet02.png")
   ,PIXI.Texture.fromFrame("bullet03.png")
  ];
  this.view = new PIXI.MovieClip(this.frames);
  this.view.animationSpeed = 0.05;
  this.view.play();
  this.view.anchor.x = this.view.anchor.y = 0.5;
  this.view.position.x = param.x1;
  this.view.position.y = param.y1;
  this.tween = {};

  // bullet will continue to the closeset left or right edge after hitting target x,y  
  this.finish_point = 0 - 30; //TODO: dont hardcode 30 (get it from width of bullet or make a standard out of bounds distance)
  
  if(param.x2 > renderer.width/2) {
    this.finish_point = renderer.width + 30;
  }

  // first point on bullets bezier path will be this far out in front of the origin
  this.first_point_distance = 100;
  if(param.x2 < param.x1) {
    this.first_point_distance *= -1;
  }

  this.tween.x = new TWEEN.Tween({
    x:this.x()
   ,target_x:this.x2
   ,bullet:this
  })
    .to({x: [this.x()+this.first_point_distance, param.x2, this.finish_point]}, 1500)
    .delay(0)
    .easing(TWEEN.Easing.Linear.None)
    .interpolation(TWEEN.Interpolation.Bezier)
    .onUpdate( function(){
      this.bullet.x(this.x);
    })
    .start();

  this.tween.y = new TWEEN.Tween({
    y:this.y()
   ,target_y:this.y2
   ,bullet:this
  })
    .to({y: [this.y(), param.y2, param.y2]}, 1500)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .interpolation(TWEEN.Interpolation.Bezier)
    .onUpdate( function(){
      this.bullet.y(this.y);
    })
    .start();
};

GAME.Bullet.constructor = GAME.Bullet;

GAME.Bullet.prototype = new GAME.GameElement();

GAME.Bullet.prototype.update = function() {
  this.view.position.x += this.BULLET_SPEED;
};

GAME.Bullet.prototype.update2 = function() {
  this.x( this.x() + Math.sin(this.angle * (Math.PI/-180)) * this.BULLET_SPEED );
  this.y( this.y() + Math.cos(this.angle * (Math.PI/-180)) * this.BULLET_SPEED );
}

function fireBullet() {
  //createjs.Sound.play("peow");
  if(fire_next > FIRERATE){
    console.log("peow!");
    i = bullets.push( new GAME.Bullet({
      'x1': mech.x()
     ,'y1': mech.y()
     ,'x2': renderer.width + 30 //TODO dont hard code in 30
     ,'y2': mech.y()
    }));
    stage.addChild(bullets[i-1].view);
    fire_next = 0;
  }
};

function baddieFireBullet() {

}
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
  if( this.x() == 600 ){
    params = {'x1': this.x()-50, 'y1': this.y(), 'x2': mech.x(), 'y2': mech.y()};
    i = bullets.push( new GAME.Bullet(params) );
    stage.addChild(bullets[i-1].view);
  }
};

GAME.Baddy.prototype.inBounds = function() {
  return checkBounds(
    this.view.position.x
   ,this.view.position.y
   ,this.view.width
   ,this.view.height
   ,renderer.width
   ,renderer.height
   ,'outside'
  );
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

function getAngle(x1,y1,x2,y2) {
  return Math.atan2(  (y1-y2) ,(x1-x2)) ;//* 180 / Math.PI;
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
var baddies_bullets = [];
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
  var screen_width = $(window).width();//800;
  var screen_height = $(window).height();//600;
  if(screen_width > screen_height) {
    factor = screen_height / HEIGHT;
  } else {
    factor = screen_width / WIDTH;
  }
  calc_height = HEIGHT * factor;
  calc_width = WIDTH * factor;
  console.log(factor, calc_height, screen_height, calc_width, screen_width);

  renderer.view.style.display = "block";
  renderer.view.style.width = calc_width + "px"; //"100%";
  renderer.view.style.height = calc_height + "px"; //"100%";

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
  TWEEN.update();
  // shooth bullet
  fire_next++;
  if(k_shoot) {
    fireBullet(); 
  }

  // move bullets
  for(bullet in bullets) {
    //bullets[bullet].update2();
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
  for(var baddy = 0; baddy < baddies.length; baddy++) {
    if(baddies[baddy].active) {
      if(hitTest(mech, baddies[baddy])) {
        console.log("dead");
        //baddies.splice(baddy, 1);
        mech.die();
        baddies[baddy].die();
      }

      if(baddies[baddy].right() < 0) {
        baddies[baddy].die();
        console.log("baddie removed");
        //break;
      }
      for(var bullet = 0; bullet < bullets.length; bullet++) {
        if(hitTest(bullets[bullet], baddies[baddy])) {
          console.log("hit!!");
          baddies[baddy].die();
          bullets[bullet].die();
        } 
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

