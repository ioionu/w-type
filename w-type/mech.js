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
  this.speed = 7;
  this.frames = {};
  this.loadDefaultFrames();
  this.frames.character = [
    PIXI.Texture.fromFrame("mech01"),
    PIXI.Texture.fromFrame("mech02"),
    PIXI.Texture.fromFrame("mech03")
  ];
  this.view = new PIXI.extras.MovieClip(this.frames.character);
  this.view.animationSpeed = 0.20;
  this.view.play();
  this.view.anchor.x = 0.5;
  this.view.anchor.y = 0.5;
  this.view.position.y = 240;
  this.view.position.x = 100;
  this.realAnimationSpeed = 0.20;
  this.pitch = 0.2; // when mech is moving up or down
  this.fire_next = 0;
  this.charge = 0;
  this.charged = 100;
  this.adj_altitude = false;
  this.state = {
    up: false,
    down: false,
    left: false,
    right: false,
    shoot: false,
  };


  this.filter = new PIXI.filters.SepiaFilter();

  for(var p in params) {
    this[p] = params[p];
  }

  this.addLifeBar();
};

GAME.Mech.constructor = GAME.Mech;

GAME.Mech.prototype = new GAME.GameElement();

GAME.Mech.prototype.resetState = function(){
  this.state = {};
};

GAME.Mech.prototype.moveUp = function(distance) {
  if(GAME.game.checkBounds(this.x(), this.y() - distance, this.h(), this.w(), this.game.width, this.game.height, 'inside')){
    this.view.position.y -= distance;
  }
  this.view.rotation = this.pitch * -1;
};

GAME.Mech.prototype.moveDown = function(distance) {
  if(GAME.game.checkBounds(this.x(), this.y() + distance, this.h(), this.w(), this.game.width, this.game.height, 'inside')){
    this.view.position.y += distance;
  }
  this.view.rotation = this.pitch;
};

GAME.Mech.prototype.moveRight = function(distance) {
  if(GAME.game.checkBounds(this.x() + distance, this.y(), this.h(), this.w(), this.game.width, this.game.height, 'inside')){
    this.view.position.x += distance;
  }
  this.view.rotation = 0;
};

GAME.Mech.prototype.moveLeft = function(distance) {
  if(GAME.game.checkBounds(this.x() - distance, this.y(), this.h(), this.w(), this.game.width, this.game.height, 'inside')){
    this.view.position.x -= distance;
  }
  this.view.rotation = 0;
};

GAME.Mech.prototype.moveTowards = function(x, y, speed){
  var x1, y1;
  var x0 = this.view.position.x;// - this.view.width;
  var y0 = this.view.position.y;
  x += this.view.width;

  var diffx = x0 - x;
  diffx = diffx < 0 ? diffx * -1 : diffx;
  var speedx = diffx < speed ? diffx : speed;

  var diffy = y0 - y;
  var altitude_distance = diffy;
  diffy = diffy < 0 ? diffy * -1 : diffy;
  var speedy = diffy < speed ? diffy : speed;

  if(diffx > 0 || diffy > 0) {
    //distance from mech to touch
    var line = Math.sqrt(diffx * diffx + diffy * diffy);
    var propx = speedx / line;
    var propy = speedy / line;

    x1 = x0 + propx * (x - x0);
    y1 = y0 + propy * (y - y0);

    this.view.position.x = x1;
    this.view.position.y = y1;
  }

  var pitch_threshold = 5;
  this.adj_altitude = false;
  if(altitude_distance > pitch_threshold) {
    this.view.rotation = this.pitch * -1;
    this.adj_altitude = true;
  }
  if(altitude_distance < (pitch_threshold * -1)) {
    this.view.rotation = this.pitch;
    this.adj_altitude = true;
  }
  if(altitude_distance <= pitch_threshold && altitude_distance >= 0) {
    this.view.rotation = 0;
  }
};

GAME.Mech.prototype.update = function(game) {
  this.view.animationSpeed = this.realAnimationSpeed;
  this.fire_next++;
  this.charge++;


  var p = {
    'x': this.view.position.x,
    'y': this.view.position.y,
    'w': this.view.width,
    'h': this.view.height,
    'rw': game.w(),
    'rh': game.h(),
    'm':'inside'
  };

  if (this.active) {

    //get inputs from game
    var inputs = this.game.inputs;
    var active_input;
    for(var i = 0; i < inputs.length; i++){
      if(inputs[i].enabled){
        this.state = inputs[i].getState();
        active_input = inputs[i];
      }
    }
    active_input.update();
    if(this.charge > this.charged){
      this.view.filters = [this.filter];
    } else {
      this.view.filters = null;
    }


    //this.resetState();
  }
};

GAME.Mech.prototype.respawn = function() {
  // in the spirit of SMB 0 is a life
  if (this.lives >= 0) {
    this.view.textures = this.frames.character;
    this.view.gotoAndPlay(0);
    this.view.loop = true;
    this.active = true;
    this.life = 100;
    this.life_bar.update( this.life );
    console.log("respawn");
  } else {
    this.active = false;
    this.game.gameOver();
  }

};

GAME.Mech.prototype.bullet = function(screen_width, screen_height) {
  //createjs.Sound.play("peow");
  var x, y, b, distance;
  var p = {};

  //find target...
  var A = this.r();
  console.log("rotation", A);
  var a = (A < 0) ? this.y() : this.game.renderer.height - this.y();
  if(A !== 0) {
    //console.log(A,a);
    p = GAME.game.getTargetPoint(A,a);
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


  var bullet = new GAME.GoodyBullet({
    'x1': this.x(),
    'y1': this.y(),
    'x2': p.x,
    'y2': p.y,
    'source': this,
    'damage': 25,
    'distance':distance,
    'game': this.game,
    type: 'goodyBullet'
  });
  //this.bullets.push(bullet);
  //this.stage.addChild(bullet.view);
  //var instance = createjs.Sound.play("fire");
  return bullet;
};

GAME.Mech.prototype.superBullet = function(screen_width, screen_height) {
  //createjs.Sound.play("peow");
  var x, y, b, distance;
  var p = {};

  //find target...
  var A = this.r();
  var a = (A < 0) ? this.y() : this.game.renderer.height - this.y();
  if(A !== 0) {
    //console.log(A,a);
    p = GAME.game.getTargetPoint(A,a);
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
    'damage': 100,
    distance: distance,
    game: this.game,
    type: 'superBullet'
  });
  //this.bullets.push(bullet);
  //this.stage.addChild(bullet.view);
  //var instance = createjs.Sound.play("fire");
  return bullet;
};


/*
 * replace mech with tomb stone
 * @method tombStone
 */
GAME.Mech.prototype.tombStone = function() {
  this.frames.tomb = [
    PIXI.Texture.fromFrame("tomb04"),
    PIXI.Texture.fromFrame("tomb03"),
    PIXI.Texture.fromFrame("tomb02"),
    PIXI.Texture.fromFrame("tomb01")
  ];

  this.view.textures = this.frames.tomb;
  this.view.loop = false;
  this.view.interactive = true;
  var _this = this;
  this.view.on('mousedown', function(e){
    _this.game.newGame();
  });

  this.view.gotoAndPlay(0);
  this.view.onComplete = function(){
    console.log("i am function");
  };
};

//end mech
