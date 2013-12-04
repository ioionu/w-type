var GAME = GAME || {};

GAME.Baddy = function(source) {

  this.SPEED = 1;
  this.YMOD = 0.1;
  this.YBASE = Math.random()*600; // TODO get this from stage height
  this.YPOWER = Math.random()*100;
  
  this.frames = {};
  this.frames.character = [
    PIXI.Texture.fromFrame("baddy01.png"),
    PIXI.Texture.fromFrame("baddy02.png"),
    PIXI.Texture.fromFrame("baddy03.png")
  ];

  this.view = new PIXI.MovieClip(this.frames.character);
  this.view.animationSpeed = 0.20;
  this.view.play();
  this.view.anchor.x = this.view.anchor.y = 0.5;
  this.view.position.x = renderer.width;
  this.view.position.y = this.YBASE;

  this.addLifeBar();
  this.loadDefaultFrames();
  this.sound = {};
  this.sound.die = "die";
};

GAME.Baddy.constructor = GAME.Baddy;
GAME.Baddy.prototype = new GAME.GameElement();

GAME.Baddy.prototype.updateLife = function() {
  this.view.addChild( new GAME.LifeBar().view );
  //life_bar.scale.x = this.life / this.life_full;
};

GAME.Baddy.prototype.update = function(){
  this.view.position.x -= this.SPEED;
  this.view.position.y = (Math.sin( (this.x() * this.YMOD) ) * this.YPOWER) + this.YBASE;
  this.YPOWER -= this.YPOWER * (this.YMOD/100);
  if( this.x() == 600 ){
    params = {'x1': this.x(), 'y1': this.y(), 'x2': mech.x(), 'y2': mech.y(), 'source': this, 'damage': 10};
    i = bullets.push( new GAME.Bullet(params) );
    stage.addChild(bullets[i-1].view);
  }
};

GAME.Baddy.prototype.inBounds = function() {
  return checkBounds(
    this.view.position.x
   ,this.view.position.y
   ,this.view.width
   ,this.view.height
   ,renderer.width
   ,renderer.height
   ,'outside'
  );
};

function addBaddy() {
  i = baddies.push( new GAME.Baddy() );
  stage.addChild(baddies[i-1].view);
};
//end baddy

