var GAME = GAME || {};

/**
 * @class Mech
 * @construcor
 **/
GAME.Mech = function(params) {
  this.position = new PIXI.Point();

  this.frames = {};
  this.loadDefaultFrames();
  this.frames.character = [
    PIXI.Texture.fromFrame("mech01.png")
   ,PIXI.Texture.fromFrame("mech02.png")
   ,PIXI.Texture.fromFrame("mech03.png")
  ];
  this.view = new PIXI.MovieClip(this.frames.character);
  this.view.animationSpeed = 0.20;
  this.view.play();
  this.view.anchor.x = 0.5;
  this.view.anchor.y = 0.5;
  this.view.position.y = 240;
  this.view.position.x = 100;
  this.realAnimationSpeed = 0.20;
  this.pitch = 0.2; // when mech is moving up or down
  
  for(p in params) {
    this[p] = params[p];
  }

  this.addLifeBar();
};

GAME.Mech.constructor = GAME.Mech;

GAME.Mech.prototype = new GAME.GameElement();

GAME.Mech.prototype.derp = function() {
  console.log("derp");
};


GAME.Mech.prototype.up = function() {
  if(checkBounds(p.x, this.view.position.y - MECHSPEED, p.w, p.h, p.rw, p.rh, p.m)){
    this.view.position.y -= MECHSPEED;
  }
  this.view.rotation = this.pitch * -1;
}

GAME.Mech.prototype.down = function() {
  if(checkBounds(p.x, this.view.position.y + MECHSPEED, p.w, p.h, p.rw, p.rh, p.m)){
    this.view.position.y += MECHSPEED;
  }
  this.view.rotation = this.pitch;
}
GAME.Mech.prototype.update = function(game) {
  this.view.animationSpeed = this.realAnimationSpeed;
  p = {
    'x': this.view.position.x,
    'y': this.view.position.y,
    'w': this.view.width,
    'h': this.view.height,
    'rw': game.w(),
    'rh': game.h(),
    'm':'inside'
  };
  if(k_right) {
    p.x = this.view.position
    if(checkBounds(this.view.position.x + MECHSPEED, p.y, p.w, p.h, p.rw, p.rh, p.m)){
      this.view.position.x += MECHSPEED;
    }
    this.view.rotation = 0;
  }
  
  if(k_left) {
    if(checkBounds(this.view.position.x - MECHSPEED, p.y, p.w, p.h, p.rw, p.rh, p.m)){
      this.view.position.x -= MECHSPEED/2;
    }
    this.view.rotation = 0;
  }
  
  var adj_altitude = false;
  if(k_up) {
    this.up();
    adj_altitude = true;
  }
  
  if(k_down) {
    this.down();
    adj_altitude = true;
  }

  if(adj_altitude == false) {
    this.view.rotation = 0;
  }
};

GAME.Mech.prototype.bullet = function(screen_width, screen_height) {
  //createjs.Sound.play("peow");
  var x, y, a, A, b, distance;
  var p = {};

  //find target...
  var A = this.r();
  var a = (A < 0) ? this.y() : screen_height - this.y();
  if(A != 0) {
    //console.log(A,a);
    p = getTargetPoint(A,a);
    b = p.x; //stash x as we use it to calculate the side c, and use that to calc speed 
    p.y = (A > 0) ? screen_height+30 : 0-30;
    p.x += this.x();
    distance = Math.sqrt(a*a + b*b);
  } else {
    //shoot strait
    p = {};
    p.x = screen_width + 30; //TODO remove hardcode 30

    p.y = this.y();
    distance = p.x - this.x(); 
  }


  bullet = new GAME.GoodyBullet({
    'x1': this.x(),
    'y1': this.y(),
    'x2': p.x,
    'y2': p.y,
    'source': this,
    'damage': 25,
    'distance':distance
  });
  //this.bullets.push(bullet);
  //this.stage.addChild(bullet.view);
  //var instance = createjs.Sound.play("fire");
  return bullet;
};
//end mech
