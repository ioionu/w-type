
var load_queue;
var stage;
var renderer;
var mech;


var k_left, k_right, k_up, k_down, k_shoot;
var bullets = [];
var baddies = [];
var stars = [];
var nebula = [];
var baddies_bullets = [];
var baddie_rate = 0;
var baddie_rate_accel = 10;
var baddie_rate_min = 50;
var baddie_next;

var MECHSPEED = 7;
var FIRERATE = 10;
var fire_next;


function hitTest(a, b) {
  if(a.active && b.active) {
    if(a.source != b && b.source != a){
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

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}
