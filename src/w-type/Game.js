import * as PIXI from 'pixi.js';
import TWEEN from '@tweenjs/tween.js';
import Mech from './Mech';
import ScoreBoard from './ScoreBoard';
import TopScores from './TopScores';
import Star from './Star';
import Title from './Title';
import Keyboard from './Keyboard';
import Touch from './Touch';
import BaddyTweened from './BaddyTweened';

/**
 * Construct a game
 * @constructor
 * @param {object} params - width and height and m0ar!
 */
export default class Game {
  constructor(params) {
    this.width = 800;
    this.height = 600;
    this.stretch = true;
    this.sprite_sheet = [
      'img/SpriteSheet.json',
      'img/page.jpg',
    ];
    this.id = 'game';

    this.stars = [];
    this.baddies = [];
    this.bullets = [];

    // for(var p in params) {
    //   this[p] = params[p];
    // }

    /* make "this" available in this.update() when called from requestAnimFrame()
    * http://stackoverflow.com/questions/20177297/how-to-call-requestanimframe-on-an-object-method
    */
    this.animate = this.animate.bind(this);
    //  this.init();

    this.app = new PIXI.Application({backgroundColor: 0x000000});

    this.app.loader.add(this.sprite_sheet)
    .load(()=>{
      const _this = this;
      this.app.loader.e = this;
      this.start();
    });
  }


  /**
   * when assets are loaded prepare stage
   * @param {GAME.game} game object
   */
  start() {

    // let pixi choose WebGL or canvas
    this.app.renderer = PIXI.autoDetectRenderer(this.width, this.height);
    // set the canvas width and height to fill the screen
    const screen_width = window.innerWidth;// 800;
    const screen_height = window.innerHeight;// 600;
    const ratio_width = screen_width / this.width;
    const ratio_height = screen_height / this.height;
    if (ratio_width > ratio_height) {
      var calc_width = this.width * ratio_height;
      var calc_height = screen_height;
    } else {
      var calc_height = this.height * ratio_width;
      var calc_width = screen_width;
    }

    this.app.renderer.view.style.display = 'block';
    this.app.renderer.view.style.width = `${calc_width }px`;
    this.app.renderer.view.style.height = `${calc_height }px`;
    this.app.renderer.view.style.margin = 'auto';
    this.app.renderer.view.id = this.id;

    // we need to place canvas in a container to prevent distortion in firefox
    this.container = document.createElement('div');
    this.container.id = `${this.id }-container`;
    this.container.style.width = '100%';
    this.container.style.height = '100%';

    // attach render to page
    this.container.appendChild(this.app.view);
    document.body.appendChild(this.container);
    this.baddie_next = 0;

    // background image
    const page = new PIXI.Sprite(PIXI.Texture.fromImage('img/page.jpg'));
    page.width = WIDTH;
    page.height = HEIGHT;
    this.e.stage.addChild(page);

    // add stars
    for (let s = 0; s < 25; s++) {
      const x = this.e.renderer.width;
      const y = Math.random() * this.e.renderer.height;
      this.e.addStar();
    }

    // add player
    const params = { game: this.e, lives: 1 };
    this.e.mech = new Mech(params);
    this.e.mech.active = false;
    this.e.stage.addChild(this.e.mech.view);

    // add score
    this.e.score = new ScoreBoard(0, this.e.mech.lives);
    this.e.score.view.position.x = '5';
    this.e.score.view.position.y = '5';
    this.e.stage.addChild(this.e.score.view);

    // top scores
    this.e.top_scores = new TopScores(this.e);
    console.log('top scores', this.e.top_scores.get());

    // add title
    this.e.title = new Title(this.e);

    // keyboard events
    this.e.inputs = [
      new Keyboard(this.e),
      new Touch(this.e),
    ];

    // fullscreen events
    const _this = this.e;
    window.onresize((e) => {
      _this.resize();
    });

    // not paused
    this.e.paused = false;
    this.e.animate();
  }

  animate() {
    if (!this.paused) {
      this.mech.update(this);
      TWEEN.update();

      // add bad guy
      // console.log(baddie_next, baddie_rate);
      if (this.baddie_next > this.baddie_rate && this.mech.active) {
        // addBaddy();
        this.createBaddyTweenedSquad();
        this.baddie_next = 0;
        if (this.baddie_rate >= this.baddie_rate_min) {
          this.baddie_rate = this.baddie_rate - this.baddie_rate_accel;
        }
        console.log(this.baddie_rate);
      } else {
        this.baddie_next++;
      }


      // test for hits and move baddies
      for (const baddy in this.baddies) {
        if (this.baddies.hasOwnProperty(baddy)) {
          if (this.baddies[baddy].active) {
            if (hitTest(this.mech, this.baddies[baddy])) {
              this.mech.hit(20);
              this.baddies[baddy].die();
            }

            if (this.baddies[baddy].right() < (this.baddies[baddy].w() * -1)) {
              this.baddies[baddy].die();
              this.baddies[baddy].removeFromStage();
            }
            for (let bullet = 0; bullet < this.bullets.length; bullet++) {
              const { damage } = this.bullets[bullet];
              if (hitTest(this.bullets[bullet], this.baddies[baddy])) {
                // console.log("hit!!");
                this.baddies[baddy].hit(damage);
                this.baddies[baddy].recoil(this.bullets[bullet]);
                if (this.bullets[bullet].type !== 'super') {
                  this.bullets[bullet].die();
                }
              }
              if (this.bullets[bullet].source != this.mech && hitTest(this.bullets[bullet], this.mech)) {
                this.bullets[bullet].die();
                this.mech.hit(damage);
                this.mech.recoil(this.bullets[bullet]);
              }
            }
          }
          if (this.baddies[baddy].remove) {
            // if this baddy is not active then remove it from stage
            this.baddies[baddy].removeFromStage();
            delete this.baddies[baddy];
          }
        }
      }
    } else {
      // THIS DOESNT WORK
      // https://github.com/tweenjs/tween.js/issues/15
      // TWEEN.stop();
    }// paused


    // draw
    this.renderer.render(this.stage);
    window.requestAnimationFrame(this.animate);
  }

  enableInput(input) {
    for (let i = 0; i < this.inputs.length; i++) {
      if (this.inputs[i] == input) {
        this.inputs[i].enable();
      } else {
        this.inputs[i].disable();
      }
    }
  }

  pause() {
    this.paused = !this.paused;
  }

  w(width) {
    if (typeof width !== 'undefined') {
      this.width = width;
    }
    return this.width;
  }

  h(height) {
    if (typeof height !== 'undefined') {
      this.height = height;
    }
    return this.height;
  }

  scaledWidth() {
    return this.renderer.view.style.width;
  }

  scaledHeight() {
    return this.renderer.view.style.height;
  }

  addStar() {
    const star = new Star(this.w(), (Math.random() * this.h()));
    this.stars.push(star);
    this.stage.addChild(star.view);
  }

  addBaddyTweened(params) {
    const baddy = new BaddyTweened(params);
    this.baddies.push(baddy);
    this.stage.addChild(baddy.view);
  }

  createBaddyTweenedSquad() {
    const w = this.w();
    const h = this.h();
    const path = {
      x: [w + 45, w * Math.random(), w * Math.random(), -75], // TODO fix hardcoded last tween poing
      y: [h * Math.random(), h * Math.random(), h * Math.random()],
      shoot: Math.floor(Math.random() * 50),
      interpolation: TWEEN.Interpolation.CatmullRom,
      time: 10500,
    };

    for (let i = 0; i < 4; i++) {
      this.addBaddyTweened({
        x: path.x,
        y: path.y,
        delay: i * 1000,
        time: path.time,
        interpolation: path.interpolation,
        shoot: path.shoot,
        mech: this.mech,
        game: this,
      });
    }
  }

  fire(bullet) {
    this.bullets.push(bullet);
    this.stage.addChild(bullet.view);
  }

  gameOver() {
    console.log('game over man! game over!!!');
    this.mech.tombStone();
    const rank = this.top_scores.check(this.mech.score);
    if (rank !== -1 && rank < 3) {
      this.top_scores.showPlayerName();
    }
    this.title.show();
  }

  newGame() {
    // enable keyboard... bit of a hack, not really needed
    this.enableInput(this.inputs[0]);

    // TODO: use newGame() function for first game
    this.baddies = [];
    this.baddie_rate = 250;
    // add player
    const params = { game: this, lives: 1 };
    this.mech.removeFromStage();
    this.mech = new Mech(params);
    this.stage.addChild(this.mech.view);

    this.score.updateLife(this.mech.lives);
    this.score.updateScore(0);
  }

  fullscreen() {
    const element = this.container;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    this.resize();
  }

  resize() {
    console.log('resize');
    let calc_height; let calc_width; let
      factor;

    // do we stretch to fullscreen ot keep aspect ratio?
    if (this.stretch) {
      const WIDTH = this.width;
      const HEIGHT = this.height;
      // let pixi choose WebGL or canvas
      const screen_width = window.innerWidth;// 800;
      const screen_height = window.innerHeight;// 600;
      if (screen_width > screen_height) {
        factor = screen_height / HEIGHT;
      } else {
        factor = screen_width / WIDTH;
      }
      // console.log(factor, calc_height, screen_height, calc_width, screen_width);

      this.renderer.view.style.display = 'block';
      calc_height = `${HEIGHT * factor }px`;
      calc_width = `${WIDTH * factor }px`;
    } else {
      calc_height = `${window.innerHeight }px`;
      calc_width = '100%';
    }
    this.renderer.view.style.width = calc_width; // "100%";
    this.renderer.view.style.height = calc_height; // "100%";
  }

  toggleStretch() {
    if (this.stretch) {
      this.stretch = false;
    } else {
      this.stretch = true;
    }
    return this.stretch;
  }

  getAngle(x1, y1, x2, y2) {
    return Math.atan2((y1 - y2), (x1 - x2));//* 180 / Math.PI;
  }

  /* A = the angle of the ship in radians
  * a = the distance from the top of the renderer
  */
  static getTargetPoint(A, a) {
    if (A === 0) {
      return false;
    }
    // if A is negative make it possitive
    A = A < 0 ? A * -1 : A;
    A *= 2;
    const C = 90; // TODO use radians not degrees
    A /= (Math.PI / 180); // convert radians to degree... because im dumb
    const B = 180 - A - C;

    const b = Math.sin(B * (Math.PI / 180)) * a / Math.sin(A * (Math.PI / 180));

    return { x: b, y: a };
  }

  static hitTest(a, b) {
    if (a.active && b.active) {
      if (a.source != b && b.source != a) {
        const hx = a.x() - b.x();
        const hy = a.y() - b.y();
        const dist = Math.sqrt(hx * hx + hy * hy);
        const width_a = ((a.size()).h) / 2;
        const width_b = ((b.size()).h) / 2;
        return dist <= width_a + width_b;
      }
    }
    return false;
  }

  static checkBounds(x,y,h,w,sw,sh, mode) {

    if(mode === 'inside'){
      if (x - w/2 > 0 && x + w/2 < sw && y - h/2 > 0 && y + h/2 < sh) {
        return true;
      }
      return false;
    }
    if (mode === 'outside') {

      if(x + w/2 > 0 && x - w/2 < sw && y + h/2 > 0 && y - h/2 < sh){ return true; }
      else { return false; }
    }
    console.log("derp... checkbounds spacked out");
    return false;
  }
}
