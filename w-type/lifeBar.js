
var GAME = GAME || {};

/*
 * {'x': this.x()-50, 'y': this.y()};
 * */
GAME.LifeBar = function(param) {

  this.width = 20;
  this.x = this.width * -1;
  this.y = -20;
  this.life = param.life;
  this.life_full = param.life_full;


  this.view = new PIXI.Graphics();
  //this.draw();
};

GAME.LifeBar.constructor = GAME.LifeBar;

GAME.LifeBar.prototype.update = function(life) {
  this.life = life;
  this.draw();
};

GAME.LifeBar.prototype.draw = function() {
  this.view.clear();
  this.view.lineStyle( 0, 0xFFFFFF, 1);
  this.view.beginFill(0xFFFFFF);
  this.view.drawRect(this.x,this.y,this.width,3);
  this.view.lineStyle( 0, 0xFF0000, 1);
  this.view.beginFill(0xFF0000);
  this.view.drawRect(this.x+1,this.y+1,this.life/this.life_full*this.width,1);
  //this.view.drawRect(this.x+1,this.y,this.width,3);
  this.interpolation = TWEEN.Interpolation.Bezier;
  this.tween = new TWEEN.Tween({
    a:this.view.alpha,
    view:this.view
  })
    .to({a: [1, 0]}, 1500)
    .delay(0)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate( function(){
      this.view.alpha = this.a;
    })
    .start();
    
};
