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

  this.interpolation = TWEEN.Interpolation.Bezier;
  if(typeof param.interpolation == 'None') {
    this.interpolation = param.interpolation;
  }
  this.tween = {};

  // bullet will continue to the closeset left or right edge after hitting target x,y  
  this.finish_point = 0 - 30; //TODO: dont hardcode 30 (get it from width of bullet or make a standard out of bounds distance)
  
  if(param.x2 > param.x1) {
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

  this.BULLET_SPEED = 2;
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

function fireBullet() {
  //createjs.Sound.play("peow");
  var x, y, a, A, b, distance;
  var p = {};
  if(fire_next > FIRERATE){
    //console.log("peow!");

    var A = mech.r();
    var a = (A < 0) ? mech.y() : renderer.height - mech.y();
    if(A != 0) {
      //console.log(A,a);
      p = getTargetPoint(A,a);
      b = p.x; //stash x as we use it to calculate the side c, and use that to calc speed 
      p.y = (A > 0) ? renderer.height+30 : 0-30;
      p.x += mech.x();
      distance = Math.sqrt(a*a + b*b);
    } else {
      p = {};
      p.x = renderer.width + 30; //TODO remove hardcode 30

      p.y = mech.y();
      distance = p.x - mech.x(); 
    }


    i = bullets.push( new GAME.GoodyBullet({
      'x1': mech.x(),
      'y1': mech.y(),
      'x2': p.x,
      'y2': p.y,
      'source': mech,
      'damage': 25,
      'distance':distance
    }));
    stage.addChild(bullets[i-1].view);
    fire_next = 0;
    var instance = createjs.Sound.play("fire");
  }
};

function baddieFireBullet() {

}
//end bullet

