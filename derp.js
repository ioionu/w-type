
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
  
var MECHSPEED = 7;
var FIRERATE = 10;
var fire_next;


function hitTest(a, b) {
  if(typeof a != 'undefined' && typeof b != 'undefined') {
    if(a.active && b.active && a.source != b && b.source != a) {
      hx = a.x() - b.x();
      hy = a.y() - b.y();
      dist = Math.sqrt(hx*hx+hy*hy);
      width_a = ((a.size()).h)/2;
      width_b = ((b.size()).h)/2;
      return dist <= width_a + width_b;
    }
  }
  return false;
}

function getAngle(x1,y1,x2,y2) {
  return Math.atan2(  (y1-y2) ,(x1-x2)) ;//* 180 / Math.PI;
}

function init() {
  loader = new PIXI.AssetLoader(['SpriteSheet.json']);
  loader.load();
  loader.onComplete = fuckShit;
  
  var queue = new createjs.LoadQueue();
  queue.installPlugin(createjs.Sound);
  queue.addEventListener("complete", handleComplete);
  queue.loadManifest([ {id: "hit", src:"audio/fx_kick.mp3"}, {id: "fire", src: "audio/yFX3.mp3"}, {id: 'die', src: 'audio/tom_01.mp3'} ]);
  createjs.Sound.setMute(true);

}

function handleComplete(e) {
  var instance = createjs.Sound.play("hit");
  var instance = createjs.Sound.play("fire");
  console.log("doof");
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
  renderer.view.id = "fuckhead";

  // attach render to page
  document.body.appendChild(renderer.view);
  baddie_next = fire_next = 0;

  mech = new GAME.Mech();
  stage.addChild(mech.view);
  requestAnimFrame( animate );

  Hammer(document.getElementById(renderer.view.id)).on("swipeleft", function() {
      k_left = true;
      k_right = k_up = k_down = false;
      //alert('you swiped left!');
  });
  Hammer(document.getElementById(renderer.view.id)).on("swiperight", function() {
      k_right = true;
      k_left = k_up = k_down = false;
      //alert('you swiped left!');
  });
  Hammer(document.getElementById(renderer.view.id)).on("swipeup", function() {
      k_up = true;
      k_right = k_left = k_down = false;
      //alert('you swiped left!');
  });
  Hammer(document.getElementById(renderer.view.id)).on("swipedown", function() {
      k_down = true;
      k_right = k_left = k_up = false;
      //alert('you swiped left!');
  });
  Hammer(document.getElementById(renderer.view.id)).on("swipedown", function() {
      k_down = true;
      k_right = k_left = k_up = false;
      //alert('you swiped left!');
  });
  Hammer(document.getElementById(renderer.view.id)).on("tap", function() {
      fireBullet();
      //k_shoot = true;
      //k_right = k_left = k_up = false;
      //alert('you swiped left!');
  });
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


  // add bad guy
  //console.log(baddie_next, baddie_rate);
  if(baddie_next > baddie_rate) {
    addBaddy();
    baddie_next = 0;
  } else {
    baddie_next++;
  }
  

  // test for hits and move baddies
  for(var baddy = 0; baddy < baddies.length; baddy++) {
    if(baddies[baddy].active) {
      baddies[baddy].update();
      if(hitTest(mech, baddies[baddy])) {
        //console.log("dead");
        //baddies.splice(baddy, 1);
        //かみかぜ
        mech.hit(100);
        baddies[baddy].hit(100);
      }

      if(baddies[baddy].right() < 0) {
        baddies[baddy].die();
      }
      for(var bullet = 0; bullet < bullets.length; bullet++) {
        damage = bullets[bullet].damage;
        if(hitTest(bullets[bullet], baddies[baddy])) {
          console.log("hit!!");
          baddies[baddy].hit(damage);
          baddies[baddy].recoil(bullets[bullet]);
          bullets[bullet].die();
        } 
        if(bullets[bullet].source != mech && hitTest(bullets[bullet], mech)) {
          bullets[bullet].die();
          mech.hit(damage);
          mech.recoil(bullets[bullet]);
        }
      }

    }
  }


  //draw
  renderer.render(stage);
}

