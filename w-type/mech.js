var GAME = GAME || {};

/**
 * @class Mech
 * @construcor
 **/
GAME.Mech = function(params) {
  this.position = new PIXI.Point();
  this.type = "mech";

  this.game = params.game;
  this.lives = 3;
  this.score = 0;
  this.speed = 6; 
  this.frames = {};
  this.loadDefaultFrames();
  this.frames.character = [
    PIXI.Texture.fromFrame("mech01.png"),
    PIXI.Texture.fromFrame("mech02.png"),
    PIXI.Texture.fromFrame("mech03.png")
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


GAME.Mech.prototype.moveUp = function(distance) {
  if(checkBounds(this.x(), this.y() - distance, this.h(), this.w(), this.game.width, this.game.height, 'inside')){
    this.view.position.y -= distance;
  }
  this.view.rotation = this.pitch * -1;
}

GAME.Mech.prototype.moveDown = function(distance) {
  if(checkBounds(this.x(), this.y() + distance, this.h(), this.w(), this.game.width, this.game.height, 'inside')){
    this.view.position.y += distance;
  }
  this.view.rotation = this.pitch;
}


GAME.Mech.prototype.moveRight = function(distance) {
  if(checkBounds(this.x() + distance, this.y(), this.h(), this.w(), this.game.width, this.game.height, 'inside')){
    this.view.position.x += distance;
  }
  this.view.rotation = 0;
}

GAME.Mech.prototype.moveLeft = function(distance) {
  if(checkBounds(this.x() - distance, this.y(), this.h(), this.w(), this.game.width, this.game.height, 'inside')){
    this.view.position.x -= distance;
  }
  this.view.rotation = 0;
};


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
  
  var adj_altitude = false;
  if(k_up) {
    this.moveUp(this.speed);
    adj_altitude = true;
  }
  
  if(k_down) {
    this.moveDown(this.speed);
    adj_altitude = true;
  }
  
  if(k_left) {
    this.moveLeft(this.speed/2);
  }

  if(k_right) {
    this.moveRight(this.speed);
  }

  if(adj_altitude == false) {
    this.view.rotation = 0;
  }
};

GAME.Mech.prototype.respawn = function() {
  this.view.textures = this.frames.character;
  this.view.gotoAndPlay(0);
  this.view.loop = true;
  console.log("respawn");
  
};

GAME.Mech.prototype.bullet = function(screen_width, screen_height) {
  //createjs.Sound.play("peow");
  var x, y, a, A, b, distance;
  var p = {};

  //find target...
  var A = this.r();
  var a = (A < 0) ? this.y() : this.game.renderer.height - this.y();
  if(A != 0) {
    //console.log(A,a);
    p = getTargetPoint(A,a);
    b = p.x; //stash x as we use it to calculate the side c, and use that to calc speed 
    p.y = (A > 0) ? this.game.renderer.height + 30 : 0-30;
    p.x += this.x();
    distance = Math.sqrt(a*a + b*b);
  } else {
    //shoot strait
    p = {};
    p.x = this.game.renderer.width + 30; //TODO remove hardcode 30

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
    'distance':distance,
    'game': this.game
  });
  //this.bullets.push(bullet);
  //this.stage.addChild(bullet.view);
  //var instance = createjs.Sound.play("fire");
  return bullet;
};
//end mech
