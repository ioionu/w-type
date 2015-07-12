var GAME = GAME || {};

GAME.Title = function(game) {
  this.game = game;
  this.view = new PIXI.Container();
  this.screens = {
    title: this.titleScreen(),
    option: this.optionScreen()
  };
  this.view.addChild(this.screens.title);
  this.view.addChild(this.screens.option);

  this.game.stage.addChild(this.view);

  //set title position
};

GAME.Title.prototype.titleScreen = function(){
  var title = new PIXI.Container();
  title.visible = true;

  var start = PIXI.Sprite.fromFrame('newGame01');
  var left = (this.game.width * 0.5);
  var top = (this.game.height * 0.25);
  start.anchor = new PIXI.Point(0.5, 0.5);
  start.position = new PIXI.Point(left, top);
  start.interactive = true;
  var _this = this;
  start.on('click', function(e){
    _this.game.newGame();
    _this.hide();
  });
  start.on('touchstart', function(e){
    _this.game.newGame();
    _this.hide();
  });
  title.addChild(start);

  var option = PIXI.Sprite.fromFrame('options');
  option.anchor = new PIXI.Point(0.5, 0.5);
  option.position = new PIXI.Point(
    (this.game.width * 0.5),
    (this.game.height * 0.5)
  );
  option.interactive = true;
  option.on('click', function(e){
    _this.screens.option.visible=true;
    _this.screens.title.visible=false;
  });
  option.on('touchstart', function(e){
    _this.screens.option.visible=true;
    _this.screens.title.visible=false;
  });
  title.addChild(option);

  this.top_scores = new PIXI.Text(this.game.top_scores.getString(), {font : '24px Arial', fill : 0x0000, align : 'center'});
  this.top_scores.anchor = new PIXI.Point(0.5, 0.5);
  this.top_scores.position = new PIXI.Point(
    this.game.width * 0.5,
    this.game.height * 0.75
  );
  title.addChild(this.top_scores);
  return title;

};

GAME.Title.prototype.optionScreen = function() {
  var option = new PIXI.Container();
  option.visible = false;

  var fullscreen = PIXI.Sprite.fromFrame('fullscreen');
  fullscreen.anchor = new PIXI.Point(0.5, 0.5);
  fullscreen.position = new PIXI.Point(
    this.game.width * 0.5,
    this.game.height * 0.25
  );
  fullscreen.interactive = true;
  fullscreen.on('click', function(e){
    _this.game.fullscreen();
  });
  fullscreen.on('touchstart', function(e){
    _this.game.fullscreen();
  });

  option.addChild(fullscreen);

  //toggle stretch
  var stretch = PIXI.Sprite.fromFrame('streatch');
  stretch.anchor = new PIXI.Point(0.5, 0.5);
  stretch.position = new PIXI.Point(
    this.game.width * 0.5,
    this.game.height * 0.5
  );
  stretch.interactive = true;
  var _this = this;

  stretch.on('click', function(e){
    _this.game.toggleStretch();
    _this.game.resize();
  });
  stretch.on('touchstart', function(e){
    _this.game.toggleStretch();
    _this.game.resize();
  });
  option.addChild(stretch);

  //toggle stretch
  var back = PIXI.Sprite.fromFrame('back');
  back.anchor = new PIXI.Point(0.5, 0.5);
  back.position = new PIXI.Point(
    this.game.width * 0.5,
    this.game.height * 0.75
  );
  back.interactive = true;

  back.on('click', function(e){
    _this.screens.option.visible=false;
    _this.screens.title.visible=true;
  });
  back.on('touchstart', function(e){
    _this.screens.option.visible=false;
    _this.screens.title.visible=true;
  });
  option.addChild(back);


  return option;
};

GAME.Title.prototype.show = function() {
  this.screens.option.visible=false;
  this.screens.title.visible=true;
  this.view.visible = true;
};

GAME.Title.prototype.hide = function() {
  this.view.visible = false;
};

GAME.Title.prototype.update = function() {
  this.top_scores.text = this.game.top_scores.getString();
};
