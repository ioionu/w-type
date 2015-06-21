
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
var stars = [];
var nebula = [];
var baddies_bullets = [];
var baddie_rate = 250;
var baddie_rate_accel = 10;
var baddie_rate_min = 50;
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

/* A = the angle of the ship in radians
 * a = the distance from the top of the renderer
 */
function getTargetPoint(A,a) {
  if(A === 0) {
    return false;
  }
  //if A is negative make it possitive
  A = A < 0 ? A * -1 : A;
  A = A*2;
  var C = 90; //TODO use radians not degrees
  A = A / (Math.PI/180); //convert radians to degree... because im dumb
  var B = 180 - A - C;

  var b = Math.sin( B * (Math.PI/180) ) * a / Math.sin( A * (Math.PI/180) );

  return {x:b,y:a};
}


function handleComplete(e) {
  console.log("doof");
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



function game(){
 g = new GAME.game({
   width: 800,
   height: 600,
   firerate: FIRERATE,
   baddie_rate: baddie_rate,
   baddie_rate_accel: baddie_rate_accel,
   baddie_rate_min: baddie_rate_min
 });
}
