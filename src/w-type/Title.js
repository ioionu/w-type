import * as PIXI from 'pixi.js';

export default class Title {
  constructor(game) {
    this.game = game;
    this.view = new PIXI.Container();
    this.screens = {
      title: this.titleScreen(),
      option: this.optionScreen(),
    };
    this.view.addChild(this.screens.title);
    this.view.addChild(this.screens.option);

    this.game.app.stage.addChild(this.view);

    //set title position
  }

  titleScreen() {
    var title = new PIXI.Container();
    title.visible = true;

    var logo = PIXI.Sprite.from('title.png');
    var left = (this.game.width * 0.5);
    var top = (this.game.height * 0.20);
    logo.anchor = new PIXI.Point(0.5, 0.5);
    logo.position = new PIXI.Point(left, top);
    logo.interactive = true;
    var _this = this;
    logo.on('click', function(e){
      _this.game.newGame();
      _this.hide();
    });
    logo.on('touchstart', function(e){
      _this.game.newGame();
      _this.hide();
    });
    title.addChild(logo);

    var start = PIXI.Sprite.from('newGame01.png');
    var left = (this.game.width * 0.5);
    var top = (this.game.height * 0.40);
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

    var option = PIXI.Sprite.from('options.png');
    option.anchor = new PIXI.Point(0.5, 0.5);
    option.position = new PIXI.Point(
      (this.game.width * 0.5),
      (this.game.height * 0.6)
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

    var top_score_string = this.game.top_scores.getString();
    this.top_scores = new PIXI.Text(
      top_score_string,
      {
        fontFamily: 'misakiminchoregular',
        fontSize: '30px',
        fill: 0xFFFFFF,
        align: 'left',
        padding: 3,
      }
    );
    this.top_scores.anchor = new PIXI.Point(0.5, 0.5);
    this.top_scores.position = new PIXI.Point(
      this.game.width * 0.5,
      this.game.height * 0.80
    );
    title.addChild(this.top_scores);

    const copyright_string = "Copyright 2019 Joshua McCluskey\nFork me on github https://github.com/ioionu/w-type";
    const copyright = new PIXI.Text(
      copyright_string,
      {
        fontFamily : 'misakiminchoregular',
        fonstSize: '30px',
        fill : 0xFFFFFF,
        align : 'center',
        padding: 3,
      });
    copyright.anchor = new PIXI.Point(0.5, 0.5);
    copyright.position = new PIXI.Point(
      this.game.width * 0.5,
      this.game.height * 0.95
    );

    copyright.interactive = true;
    copyright.on('click', function(e){
      window.open("https://github.com/ioionu/w-type");
    });
    copyright.on('touchstart', function(e){
      window.open("https://github.com/ioionu/w-type");
    });
    
    title.addChild(copyright);
    return title;

  }

  optionScreen() {
    var option = new PIXI.Container();
    option.visible = false;

    var fullscreen = PIXI.Sprite.from('fullscreen.png');
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
    var stretch = PIXI.Sprite.from('streatch.png');
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
    var back = PIXI.Sprite.from('back.png');
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
  }

  show() {
    this.screens.option.visible=false;
    this.screens.title.visible=true;
    this.view.visible = true;
  }

  hide() {
    this.view.visible = false;
  }

  update() {
    this.top_scores.text = this.game.top_scores.getString();
  }
}
