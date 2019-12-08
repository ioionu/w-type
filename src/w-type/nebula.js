var GAME = GAME || {};

GAME.Nebula = function(delay) {

  this.basetexture = new PIXI.BaseTexture.fromImage("cloud.jpg");
  this.texture = new PIXI.Texture(
    this.basetexture,
    new PIXI.Rectangle(
      Math.random() * 500,
      Math.random() * 350,
      Math.random() * 500,
      Math.random() * 350
    )
  );
  this.view = new PIXI.Sprite(this.texture);
  this.view.anchor.x = 0.5;
  this.view.anchor.y = 0.5;
  this.view.position.x = renderer.width / 2;
  this.view.position.y = renderer.height / 2;
  this.view.width = renderer.width;
  this.view.height = renderer.height;
  this.view.alpha = 0; // start with a low alpha
  this.delay = 0;

  this.tween = new TWEEN.Tween({
    x:this.x(),
    y:this.y(),
    w:this.w(),
    h:this.h(),
    a:this.a(),
    nebula:this
  })
    .to({
      x:this.x() + Math.random() * -500,
      y:this.y() + Math.random() * -500,
      w:this.w() + Math.random() * 700,
      h:this.h() + Math.random() * 700,
      a:[Math.random(), 0]
    }, Math.random() * 15000)
    .delay(this.delay)
    .repeat(Infinity)
    .easing(TWEEN.Easing.Linear.None)
    .interpolation(TWEEN.Interpolation.Bezier)
    .onUpdate( function(){
      //this.nebula.x(this.x),
      //this.nebula.y(this.y),
      this.nebula.w(this.w),
      this.nebula.h(this.h),
      this.nebula.a(this.a)
    })
    .start();
};

GAME.Nebula.constructor = GAME.Nebula;

GAME.Nebula.prototype = new GAME.GameElement();
