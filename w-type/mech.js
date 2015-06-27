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

  this.filter = new PIXI.filters.SepiaFilter();

  for(var p in params) {
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
};

GAME.Mech.prototype.moveDown = function(distance) {
  if(checkBounds(this.x(), this.y() + distance, this.h(), this.w(), this.game.width, this.game.height, 'inside')){
    this.view.position.y += distance;
  }
  this.view.rotation = this.pitch;
};

GAME.Mech.prototype.moveRight = function(distance) {
  if(checkBounds(this.x() + distance, this.y(), this.h(), this.w(), this.game.width, this.game.height, 'inside')){
    this.view.position.x += distance;
  }
  this.view.rotation = 0;
};

GAME.Mech.prototype.moveLeft = function(distance) {
  if(checkBounds(this.x() - distance, this.y(), this.h(), this.w(), this.game.width, this.game.height, 'inside')){
    this.view.position.x -= distance;
  }
  this.view.rotation = 0;
};

GAME.Mech.prototype.moveTowards = function(x, y, distance){
  var x1, y1;
  var x0 = this.view.position.x - this.view.width;
  var y0 = this.view.position.y;
  console.log("moveTowards:", x, y, "at:", x0, y0);

  var diffx = x0 - x;
  diffx = diffx < 0 ? diffx * -1 : diffx;
  var distancex = diffx < distance ? diffx : distance;

  var diffy = y0 - y;
  diffy = diffy < 0 ? diffy * -1 : diffy;
  var distancey = diffy < distance ? diffy : distance;

  if (x0 < x) { this.view.position.x += distancex;}
  if (x0 > x) { this.view.position.x -= distancex;}
  if (y0 < y) { this.view.position.y += distancey;}
  if (y0 > y) { this.view.position.y -= distancey;}


};

GAME.Mech.prototype.update = function(game) {
  this.view.animationSpeed = this.realAnimationSpeed;
  this.fire_next++;
  this.charge++;

  p = {
    'x': this.view.position.x,
    'y': this.view.position.y,
    'w': this.view.width,
    'h': this.view.height,
    'rw': game.w(),
    'rh': game.h(),
    'm':'inside'
  };

  if (this.active) {
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

    if(adj_altitude === false) {
      this.view.rotation = 0;
    }

    // shoot bullet
    if(k_shoot) {
      if(this.fire_next > this.game.firerate){
        var bullet = this.bullet(this.w(), this.h());
        if(this.charge > this.charged){
          bullet.super();
        }
        this.game.fire(bullet);
        this.fire_next = 0;
        this.charge = 0;
        k_shoot = false;
        k_charge = false;
      }
    }

    if(this.charge > this.charged){
      this.view.filters = [this.filter];
    } else {
      this.view.filters = null;
    }

    //touch
    if(this.game.touch.enabled) {
      this.moveTowards(this.move_x, this.move_y, this.speed);
    }
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
  var a = (A < 0) ? this.y() : this.game.renderer.height - this.y();
  if(A !== 0) {
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
    PIXI.Texture.fromImage("sprite/tomb04.png"),
    PIXI.Texture.fromImage("sprite/tomb03.png"),
    PIXI.Texture.fromImage("sprite/tomb02.png"),
    PIXI.Texture.fromImage("sprite/tomb01.png")
  ];

  this.view.textures = this.frames.tomb;
  this.view.loop = false;
  this.view.interactive = true;
  _this = this;
  this.view.on('mousedown', function(e){
    _this.game.newGame();
  });

  this.view.gotoAndPlay(0);
  this.view.onComplete = function(){
    console.log("i am function");
  };
};

//end mech
