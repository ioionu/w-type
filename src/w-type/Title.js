import * as PIXI from 'pixi.js';

export default class Title {
  constructor(game) {
    this.game = game;
    this.view = new PIXI.Container();
    this.screens = {
      title: this.titleScreen(),
    };
    this.view.addChild(this.screens.title);

    this.game.app.stage.addChild(this.view);
  }

  titleScreen() {
    const title = new PIXI.Container();
    title.visible = true;

    const logo = PIXI.Sprite.from('title.png');
    const left = (this.game.width * 0.5);
    const top = (this.game.height * 0.20);
    logo.anchor = new PIXI.Point(0.5, 0.5);
    logo.position = new PIXI.Point(left, top);
    logo.interactive = true;
    logo.on('click', () => {
      this.game.newGame();
      this.hide();
    });
    logo.on('touchstart', () =>{
      this.game.newGame();
      this.hide();
    });
    title.addChild(logo);

    const start = PIXI.Sprite.from('newGame01.png');
    start.anchor = new PIXI.Point(0.5, 0.5);
    start.position = new PIXI.Point(
      (this.game.width * 0.5),
      (this.game.height * 0.5)
    );
    start.interactive = true;
    start.on('click', () => {
      this.game.newGame();
      this.hide();
    });
    start.on('touchstart', () => {
      this.game.newGame();
      this.hide();
    });
    title.addChild(start);

    // We dont need a fullscreen button on mobile.
    if (!('cordova' in window)) {
      const option = PIXI.Sprite.from('fullscreen.png');
      option.anchor = new PIXI.Point(0.5, 0.5);
      option.position = new PIXI.Point(
        (this.game.width * 0.9),
        (this.game.height * 0.1)
      );
      option.interactive = true;
      option.on('click', () => {
        this.game.fullscreen();
      });
      option.on('touchstart', () => {
        this.game.fullscreen();
      });
      title.addChild(option);
    }

    const top_score_string = this.game.top_scores.getString();
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

    const copyright_string = "Copyright 2020 Joshua McCluskey\nFork me on github https://github.com/ioionu/w-type";
    const copyright = new PIXI.Text(
      copyright_string,
      {
        fontFamily: 'misakiminchoregular',
        fonstSize: '30px',
        fill: 0xFFFFFF,
        align: 'center',
        padding: 3,
      }
    );
    copyright.anchor = new PIXI.Point(0.5, 0.5);
    copyright.position = new PIXI.Point(
      this.game.width * 0.5,
      this.game.height * 0.95
    );

    copyright.interactive = true;
    copyright.on('click', () => {
      window.open("https://github.com/ioionu/w-type");
    });
    copyright.on('touchstart', () => {
      window.open("https://github.com/ioionu/w-type");
    });

    title.addChild(copyright);
    return title;
  }

  show() {
    this.screens.title.visible = true;
    this.view.visible = true;
  }

  hide() {
    this.view.visible = false;
  }

  update() {
    this.top_scores.text = this.game.top_scores.getString();
  }
}
