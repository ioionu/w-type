var GAME = GAME || {};

/*
 * {'x': this.x()-50, 'y': this.y()};
 * */
GAME.Bullet = function(param) {
  this.type = "bullet";
  this.BULLET_SPEED = 5;
  this.damage = param['damage'];
  this.source = param['source'];
  this.frames = [
    PIXI.Texture.fromFrame("bullet01.png")
   ,PIXI.Texture.fromFrame("bullet02.png")
   ,PIXI.Texture.fromFrame("bullet03.png")
  ];
  this.view = new PIXI.extras.MovieClip(this.frames);
  this.view.animationSpeed = 0.05;
  this.view.play();
  this.view.anchor.x = this.view.anchor.y = 0.5;
  this.view.position.x = param.x1;
  this.view.position.y = param.y1;

  this.game = param.game;

  this.interpolation = TWEEN.Interpolation.Bezier;
  if(typeof param.interpolation == 'None') {
    this.interpolation = param.interpolation;
  }
  this.tween = {};

  // bullet will continue to the closeset left or right edge after hitting target x,y
  this.finish_point = 0 - 30; //TODO: dont hardcode 30 (get it from width of bullet or make a standard out of bounds distance)

  if(param.x2 > param.x1) {
    this.finish_point = param.game.renderer.width + 30;
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
    .interpolation(this.interpolation)
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
    .interpolation(this.interpolation)
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

/*
 * as opposed to baddy bullets above
 */
GAME.GoodyBullet = function(param) {

  this.type = "goodyBullet";
  this.BULLET_SPEED = 2;
  this.damage = param['damage'];
  this.source = param['source'];
  this.frames = [
    PIXI.Texture.fromFrame("bullet01.png")
   ,PIXI.Texture.fromFrame("bullet02.png")
   ,PIXI.Texture.fromFrame("bullet03.png")
  ];

  this.game = param.game;
  this.view = new PIXI.extras.MovieClip(this.frames);
  this.view.animationSpeed = 0.05;
  this.view.play();
  this.view.anchor.x = this.view.anchor.y = 0.5;
  this.view.position.x = param.x1;
  this.view.position.y = param.y1;
  this.target = {
    x: param.x2,
    y: param.y2
  };
  this.tween_speed = param.distance * this.BULLET_SPEED;

  this.tween = new TWEEN.Tween({
    x:this.x(),
    y:this.y(),
    bullet:this
  })
    .to({x: this.target.x, y: this.target.y}, this.tween_speed)
    .delay(0)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate( function(){
      this.bullet.x(this.x);
      this.bullet.y(this.y);
    })
    .start();

};

GAME.GoodyBullet.constructor = GAME.GoodyBullet;

GAME.GoodyBullet.prototype = new GAME.GameElement();
