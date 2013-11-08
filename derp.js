(function (window) {
  function Mech() {
    this.initialize();
  }
  var m = Mech.prototype = new createjs.Container();

  m.body;
  m.Container_initialize = m.initialize;
  m.initialize = function() {
    this.Container_initialize();
    console.log(load_queue);
    this.body = new createjs.Bitmap(load_queue.getResult("mech"));
    this.addChild(this.body)
  }

  m.tick = function(){
    this.x = 100;
    this.y = 100;
  }

  window.Mech = Mech;
}(window)); //end mech

(function (window) {
  function Bullet() {
    this.initialize();
  }
  var b = Bullet.prototype = new createjs.Container();

  b.body;
  b.x;
  b.y;
  b.size = 10;
  b.Container_initialize = b.initialize;
  b.initialize = function() {
    this.Container_initialize();
    console.log("bullet", load_queue);
    this.body = new createjs.Bitmap(load_queue.getResult("bunny"));
    this.addChild(this.body);
  }

  b.tick = function(){
    this.x += 1;
    this.y;
    //console.log("bullet tick", this);
  }

  window.Bullet = Bullet;
}(window)); //end bullet

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
  load_queue = new createjs.LoadQueue(false);
  load_queue.installPlugin(createjs.Sound);
  load_queue.addEventListener("complete", fuckShit);
  load_queue.loadManifest([{id: 'sound', src: 'burp.mp3'}, {id: 'peow', src: 'peow.mp3'}, {id: 'bunny', src: 'bunny.png'}, {id: 'mech', src: 'mech.png'}, {id: 'baddy', src: 'baddy.png'}]);
  //load_queue.load();

}

function fuckShit(e) {
  baddie_next = 0;

  stage = new createjs.Stage("demoCanvas");
  var circle = new createjs.Shape();
  circle.graphics.beginFill("pink").drawCircle(0, 0, 50);
  circle.x = 100;
  circle.y = 100;
  circle.addEventListener("click", function(event){
    var bunny = new createjs.Bitmap(load_queue.getResult('bunny'));
    bunny.x = Math.random()*500;
    bunny.y = Math.random()*300;
    //bunny.x = bunny.y = 20;
    stage.addChild(bunny);
    console.log(event, stage, bunny);
    stage.update();
    createjs.Sound.play("sound");
  });
  createjs.Tween.get(circle, {loop: true}).to({x:200}, 300).to({x:100}, 3000);
  createjs.Ticker.addEventListener("tick", stage);
  stage.addChild(circle);

  mech = new Mech();
  mech.x = 100;
  mech.y = 100;
  stage.addChild(mech);
  createjs.Ticker.addEventListener("tick", tick);
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
    for(bullet in bullets) {
      if(baddies[baddy].hitTest(bullets[bullet].x, bullets[bullet].y)) {
        console.log("hit!!");
        stage.removeChild(baddies[baddy]);
      }
      if(hitTest(bullets[bullet], baddies[baddy])) {
        console.log("hit!!");
        stage.removeChild(baddies[baddy]);
        stage.removeChild(bullets[bullet]);
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

function fireBullet() {
  //createjs.Sound.play("peow");
  console.log("peow!");
  i = bullets.length+1;
  bullets[i] = new Bullet();
  bullets[i].x = mech.x;
  bullets[i].y = mech.y;
  stage.addChild(bullets[i]);
}

function addBaddy() {
  i = baddies.length+1;
  baddies[i] = new Baddy();
  baddies[i].x = 500;
  baddies[i].y = 100;
  stage.addChild(baddies[i]);
}
