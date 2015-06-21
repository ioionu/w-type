var GAME = GAME || {};

GAME.Title = function(game) {
  this.game = game;
  this.view = new PIXI.Container();

  this.start = PIXI.Sprite.fromImage('sprite/newGame01.png');
  var left = (this.game.width * 0.5);
  var top = (this.game.height * 0.3);
  this.start.anchor = new PIXI.Point(0.5, 0.5);
  this.start.position = new PIXI.Point(left, top);
  this.start.interactive = true;
  var _this = this;
  this.start.on('mousedown', function(e){
    _this.game.newGame();
    _this.hide();
  });
  this.view.addChild(this.start);

  this.fullscreen = PIXI.Sprite.fromImage('sprite/fullscreen.png');
  this.fullscreen.anchor = new PIXI.Point(0.5, 0.5);
  this.fullscreen.position = new PIXI.Point(
    this.game.width * 0.5,
    this.game.height * 0.6
  );
  this.fullscreen.interactive = true;
  this.fullscreen.on('mousedown', function(e){
    _this.game.fullscreen();
  });
  this.view.addChild(this.fullscreen);

  this.game.stage.addChild(this.view);

  //set title position
};

GAME.Title.prototype.show = function() {
  this.view.visible = true;
};

GAME.Title.prototype.hide = function() {
  this.view.visible = false;
};
