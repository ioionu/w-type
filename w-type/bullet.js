var GAME = GAME || {};

/*
 * {'x': this.x()-50, 'y': this.y()};
 * */
GAME.Bullet = function(param) {

  this.BULLET_SPEED = 5;
  this.damage = param['damage'];
  this.source = param['source'];
  this.frames = [
    PIXI.Texture.fromFrame("bullet01.png")
   ,PIXI.Texture.fromFrame("bullet02.png")
   ,PIXI.Texture.fromFrame("bullet03.png")
  ];
  this.view = new PIXI.MovieClip(this.frames);
  this.view.animationSpeed = 0.05;
  this.view.play();
  this.view.anchor.x = this.view.anchor.y = 0.5;
  this.view.position.x = param.x1;
  this.view.position.y = param.y1;
  this.tween = {};

  // bullet will continue to the closeset left or right edge after hitting target x,y  
  this.finish_point = 0 - 30; //TODO: dont hardcode 30 (get it from width of bullet or make a standard out of bounds distance)
  
  if(param.x2 > renderer.width/2) {
    this.finish_point = renderer.width + 30;
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
    .interpolation(TWEEN.Interpolation.Bezier)
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
    .interpolation(TWEEN.Interpolation.Bezier)
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

function fireBullet() {
  //createjs.Sound.play("peow");
  if(fire_next > FIRERATE){
    console.log("peow!");
    i = bullets.push( new GAME.Bullet({
      'x1': mech.x()
     ,'y1': mech.y()
     ,'x2': renderer.width + 30 //TODO dont hard code in 30
     ,'y2': mech.y()
     ,'source': mech
     ,'damage': 50
    }));
    stage.addChild(bullets[i-1].view);
    fire_next = 0;
    var instance = createjs.Sound.play("fire");
  }
};

function baddieFireBullet() {

}
//end bullet

