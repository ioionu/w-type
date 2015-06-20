var GAME = GAME || {};

GAME.Title = function(game) {
  this.game = game;
  this.view = PIXI.Sprite.fromImage('sprite/newGame01.png');
  var left = (this.game.width * 0.5);
  var top = (this.game.height * 0.5);
  this.game.stage.addChild(this.view);
  this.view.anchor = new PIXI.Point(0.5, 0.5);
  this.view.position = new PIXI.Point(left, top);

  this.view.interactive = true;
  var _this = this;
  this.view.on('mousedown', function(e){
    _this.game.newGame();
    _this.hide();
  });

  //set title position
};

GAME.Title.prototype.show = function() {
  this.view.visible = true;
};

GAME.Title.prototype.hide = function() {
  this.view.visible = false;
};
