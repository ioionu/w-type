var GAME = GAME || {};

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

GAME.Mech.prototype.derp = function() {
  console.log("derp");
};

GAME.Mech.prototype.update = function() {
  this.view.animationSpeed = this.realAnimationSpeed;
  if(k_right) {
    this.view.position.x += MECHSPEED;
  }
  
  if(k_left) {
    this.view.position.x -= MECHSPEED/2;
  }
  
  if(k_up) {
    this.view.position.y -= MECHSPEED;
  }
  
  if(k_down) {
    this.view.position.y += MECHSPEED;
  }
};

GAME.Mech.prototype.x = function() {
  return this.view.position.x;
}

GAME.Mech.prototype.y = function() {
  return this.view.position.y;
}
//end mech

GAME.Bullet = function(param) {

  this.BULLET_SPEED = 10;
  this.frames = [
    PIXI.Texture.fromFrame("bullet01.png")
   ,PIXI.Texture.fromFrame("bullet02.png")
   ,PIXI.Texture.fromFrame("bullet03.png")
  ];
  this.view = new PIXI.MovieClip(this.frames);
  this.view.animationSpeed = 0.20;
  this.view.play();
  this.view.anchor.x = this.view.anchor.y = 0.5;
  this.view.position.x = param.x;
  this.view.position.y = param.y;
  
}

GAME.Bullet.prototype.update = function() {
  this.view.position.x += this.BULLET_SPEED;
}

function fireBullet() {
  //createjs.Sound.play("peow");
  console.log("peow!");
  i = bullets.push( new GAME.Bullet({'x': mech.x(), 'y': mech.y()}) );
  stage.addChild(bullets[i-1].view);
}
//end bullet

(function (window) {
  function Baddy() {
    this.initialize();
  }
  var b = Baddy.prototype = new createjs.Container();

  b.body;
  b.x;
  b.y;
  b.size = 10;
  b.Container_initialize = b.initialize;
  b.initialize = function() {
    this.Container_initialize();
    console.log("baddy", load_queue);
    this.body = new createjs.Bitmap(load_queue.getResult("baddy"));
    this.addChild(this.body);
  }

  b.tick = function(){
    this.x -= 1;
    this.y = 200 + (Math.sin(this.x)*10);
  }

  window.Baddy = Baddy;
}(window)); //end bullet

function hitTest(a, b) {
  hx = a.x - b.x;
  hy = a.y - b.y;
  dist = Math.sqrt(hx*hx+hy*hy);
  return dist <= a.size/2 + b.size/2;
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
var baddie_rate = 200;
var baddie_next;
  
var MECHSPEED = 5;

function init() {
  // code here.
  /*
  load_queue = new createjs.LoadQueue(false);
  load_queue.installPlugin(createjs.Sound);
  load_queue.addEventListener("complete", fuckShit);
  load_queue.loadManifest([{id: 'sound', src: 'burp.mp3'}, {id: 'peow', src: 'peow.mp3'}, {id: 'bunny', src: 'bunny.png'}, {id: 'mech', src: 'mech.png'}, {id: 'baddy', src: 'baddy.png'}]);
  //load_queue.load();
  */
  loader = new PIXI.AssetLoader(['SpriteSheet.json']);
  loader.load();
  //loader.onComplete = function(){console.log("loaded", loader)};
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
  baddie_next = 0;

  mech = new GAME.Mech();
  stage.addChild(mech.view);
  requestAnimFrame( animate );
  //createjs.Ticker.addEventListener("tick", tick);
}

function animate() {
  mech.update();
  requestAnimFrame( animate );
  if(k_shoot) {
    fireBullet(); 
  }
  for(bullet in bullets) {
    bullets[bullet].update();
  }
  renderer.render(stage);
}

function tick(event) {
  if(k_right) {
    mech.x = mech.x+MECHSPEED;
  }
  
  if(k_left) {
    mech.x = mech.x-MECHSPEED;
  }
  
  if(k_up) {
    mech.y = mech.y-MECHSPEED;
  }
  
  if(k_down) {
    mech.y = mech.y+MECHSPEED;
  }
  
  if(k_shoot) {
    fireBullet(); 
  }

  for(bullet in bullets) {
    bullets[bullet].tick();
  }

  for(baddy in baddies) {
    baddies[baddy].tick();
  }

  for(baddy in baddies) {
    if(hitTest(mech, baddies[baddy])) {
      console.log("dead");
      baddies.splice(baddy, 1);
      stage.removeChild(mech);
    }
    for(bullet in bullets) {
      if(hitTest(bullets[bullet], baddies[baddy])) {
        console.log("hit!!");
        stage.removeChild(baddies[baddy]);
        stage.removeChild(bullets[bullet]);
        baddies.splice(baddy, 1);
        bullets.splice(bullet, 1);
      } 
    }
  }


  if(baddie_next > baddie_rate) {
    addBaddy();
    baddie_next = 0;
  } else {
    baddie_next++;
  }
  stage.update();
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

function getBullet() {
  var i = 0;
  var len = bulletStream.length;

  //pooling approach
  while(i <= len){
    if(!bulletStream[i]) {
      bulletStream[i] = new createjs.Shape();
      break;
    } else if(!bulletStream[i].active) {
      bulletStream[i].active = true;
      break;
    } else {
      i++;
    }
  }

  if(len == 0) {
    bulletStream[0] = new createjs.Shape();
  }

  stage.addChild(bulletStream[i]);
  return i;
}


function addBaddy() {
  i = baddies.length+1;
  baddies[i] = new Baddy();
  baddies[i].x = 500;
  baddies[i].y = 100;
  stage.addChild(baddies[i]);
}
