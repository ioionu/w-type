var GAME = GAME || {};

GAME.BaddyTweened = function(params) {

  this.SPEED = 1;
  this.YMOD = 0.1;
  this.YBASE = GAME.getHeight() * Math.random();
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
  this.view.position.x = params.x[0];
  this.view.position.y = params.y[0];

  this.addLifeBar();
  this.loadDefaultFrames();
  this.sound = {};
  this.sound.die = "die";

  this.loaded = true; //can baddie fire? TODO: make a shot spacing
  
  this.path = {};
  this.path.x = params.x;
  this.path.y = params.y;
  this.path.easing = TWEEN.Easing.Linear.None;
  this.path.interpolation = TWEEN.Interpolation.Linear;
  this.path.time = 1500;
  this.path.delay = 0;
  this.path.shoot = 50;

  for(var key in params) {
    this.path[key] = params[key];
  };

  this.tween = {};
  this.tween.x = new TWEEN.Tween({
    x:this.path.x[0],
    baddy:this
  })
    .to({x: this.path.x}, this.path.time)
    .delay(this.path.delay)
    .easing(this.path.easing)
    .interpolation(this.path.interpolation)
    .onUpdate( function(){
      this.baddy.x(this.x);
      // console.log(arguments[0]);
      //console.log(this.baddy.path.shoot, Math.floor( arguments[0] * 100 ));
      if(this.baddy.path.shoot == Math.floor( arguments[0] * 100 )) {
        //console.log(this.baddy.path.shoot, Math.floor( arguments[0] * 100 ));
        this.baddy.fire();
      }
    })
    .start();

  this.tween.y = new TWEEN.Tween({
    y:this.path.y[0],
    baddy:this
  })
    .to({y: this.path.y}, this.path.time)
    .delay(this.path.delay)
    .easing(this.path.easing)
    .interpolation(this.path.interpolation)
    .onUpdate( function(){
      this.baddy.y(this.y);
    })
    .start();

};

GAME.BaddyTweened.constructor = GAME.BaddyTweened;
GAME.BaddyTweened.prototype = new GAME.GameElement();

GAME.BaddyTweened.prototype.updateLife = function() {
  this.view.addChild( new GAME.LifeBar().view );
  //life_bar.scale.x = this.life / this.life_full;
};

GAME.BaddyTweened.prototype.fire = function() {
  if(this.loaded) {
    params = {
      'x1': this.x(), 
      'y1': this.y(), 
      'x2': mech.x(), 
      'y2': mech.y(), 
      'source': this, 
      'damage': 10
    };
    i = bullets.push( new GAME.Bullet(params) );
    stage.addChild(bullets[i-1].view);
    this.loaded = false;
  }
}

GAME.BaddyTweened.prototype.inBounds = function() {
  return checkBounds(
    this.view.position.x,
    this.view.position.y,
    this.view.width,
    this.view.height,
    renderer.width,
    renderer.height,
    'outside'
  );
};

function addBaddyTweened(params) {
  i = baddies.push( new GAME.BaddyTweened(params) ); //TODO: move baddies and stage to GAME.baddies and GAME.stage
  stage.addChild(baddies[i-1].view);
};
//end baddy

function createBaddyTweenedSquad() {
  w = GAME.getWidth();
  h = GAME.getHeight();
  path = {};
  path.x = [w + 50, w * Math.random(), w * Math.random(), -10];
  path.y = [h * Math.random(), h * Math.random(), h * Math.random()];
  path.shoot = Math.floor(Math.random() * 100);
  path.interpolation = TWEEN.Interpolation.Bezier;

  for(var i = 0; i < 5; i++) {
    addBaddyTweened({
      x: path.x,
      y: path.y,
      delay: i * 1000,
      time: 10500,
      interpolation: TWEEN.Interpolation.CatmullRom,
      shoot: path.shoot

    });
  }
}

