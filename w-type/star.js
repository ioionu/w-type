var GAME = GAME || {};

/*
 * {'x': this.x()-50, 'y': this.y()};
 * */
GAME.Star = function() {
  this.view = new PIXI.Graphics();
  this.view.beginFill(0xFF3300);

  // set a fill and line style
  this.view.beginFill(0xFF3300);
  this.view.lineStyle(1, 0xffd900, 1);
  //this.view.lineStyle(2, 0x0000FF, 1);
  this.view.drawRect(0,0,1,1);
  //this.view.anchor.x = this.view.anchor.y = 0.5;
  this.view.endFill();

  this.view.position.x = renderer.width;
  this.view.position.y = Math.random() * renderer.height;


  this.tween = new TWEEN.Tween({
    x:this.x(),
    star: this
  })
    .to({x:0}, Math.random() * 1000)
    .delay(Math.random() * 1000)
    .repeat(Infinity)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate( function(){
      //console.log(this.x, this.star.view.position.y, this.star.x());
      this.star.x( this.x );
    })
    .start();

};


GAME.Star.constructor = GAME.Star;

GAME.Star.prototype = new GAME.GameElement();

function addStar() {
  var i = stars.push( new GAME.Star() );
  stage.addChild(stars[i-1].view);
};

