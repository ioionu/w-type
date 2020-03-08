import * as PIXI from 'pixi.js';
import sound from 'pixi-sound';

import TWEEN from '@tweenjs/tween.js';
import Mech from './Mech';
import ScoreBoard from './ScoreBoard';
import TopScores from './TopScores';
import Star from './Star';
import Title from './Title';
import Keyboard from './Keyboard';
import Touch from './Touch';
import BaddyTweened from './BaddyTweened';
import Audio from './Audio';

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
    this.firerate = params.firerate;

    this.audioEnabled = true;

    // Baddie spawn rate (per score). See GameElement.hit().
    this.baddie_rate_default = 200;
    this.baddie_rate_change = 10;
    this.baddie_rate_min = 80;

    this.stars = [];
    this.baddies = [];
    this.bullets = [];

    // After super bullet set charge to.
    this.chargeSpeed = 0;
    // When super bullet fires.
    this.charged = 70;

    this.lives = 2;

    // Increase baddie rate and add extra life.
    this.levelUp = 50;

    /* make "this" available in this.update() when called from requestAnimFrame()
    * http://stackoverflow.com/questions/20177297/how-to-call-requestanimframe-on-an-object-method
    */
    this.animate = this.animate.bind(this);
    //  this.init();

    PIXI.settings.SPRITE_MAX_TEXTURES = Math.min(PIXI.settings.SPRITE_MAX_TEXTURES, 16);
    this.app = new PIXI.Application({ backgroundColor: 0x000000 });

    this.app.loader.add(this.sprite_sheet)
      .load(() => {
        this.start();
      });
  }


  /**
   * when assets are loaded prepare stage
   * @param {GAME.game} game object
   */
  start() {
    // let pixi choose WebGL or canvas
    // this.renderer = PIXI.autoDetectRenderer(this.width, this.height);
    // set the canvas width and height to fill the screen
    const screenWidth = window.innerWidth;// 800;
    const screenHeight = window.innerHeight;// 600;
    const ratioWidth = screenWidth / this.width;
    const ratioHeight = screenHeight / this.height;
    let calcWidth;
    let calcHeight;
    this.audio = new Audio(this);


    if (ratioWidth > ratioHeight) {
      calcWidth = this.width * ratioHeight;
      calcHeight = screenHeight;
    } else {
      calcHeight = this.height * ratioWidth;
      calcWidth = screenWidth;
    }

    this.app.view.style.display = 'block';
    this.app.view.style.margin = 'auto';
    this.app.view.id = this.id;

    // we need to place canvas in a container to prevent distortion in firefox
    this.container = document.createElement('div');
    this.container.id = `${this.id}-container`;
    this.container.style.width = '100%';
    this.container.style.height = '100%';

    // attach render to page
    this.container.appendChild(this.app.view);
    document.body.appendChild(this.container);
    this.resize();
    this.baddie_next = 0;

    // background image
    const page = new PIXI.Sprite.from('img/page.jpg');
    page.width = this.width;
    page.height = this.height;
    this.app.stage.addChild(page);

    // add stars
    for (let s = 0; s < 25; s++) {
      this.addStar();
    }

    // add player
    const params = {
      game: this,
      lives: 2,
    };
    this.mech = new Mech(params);
    this.mech.active = false;
    this.app.stage.addChild(this.mech.view);

    // add score
    this.score = new ScoreBoard(0, this.mech.lives);
    this.score.view.position.x = '5';
    this.score.view.position.y = '5';
    this.app.stage.addChild(this.score.view);

    // top scores
    this.top_scores = new TopScores(this);
    console.log('top scores', this.top_scores.get());

    // add title
    this.title = new Title(this);

    // keyboard events
    this.inputs = [
      new Keyboard(this),
      new Touch(this),
    ];

    // fullscreen events
    window.addEventListener('resize', () => {
      this.resize();
    });

    // not paused
    this.paused = false;
    this.animate();
  }

  toggleAudio() {
    this.audioEnabled = !(this.audioEnabled);
    console.log("audio set", this.audioEnabled);
  }

  animate() {
    this.mech.update(this);
    TWEEN.update();

    // add bad guy
    // console.log(baddie_next, baddie_rate);
    if (this.baddie_next > this.baddie_rate && this.mech.active) {
      // addBaddy();
      this.createBaddyTweenedSquad();
      this.baddie_next = 0;

      console.log(this.baddie_rate);
    } else {
      this.baddie_next++;
    }

    // test for hits and move baddies
    this.baddies.forEach((baddy) => {
      if (baddy.active) {
        if (Game.hitTest(this.mech, baddy)) {
          this.mech.hit(30);
          baddy.die();
        }

        if (baddy.right() < (baddy.w() * -1)) {
          baddy.die();
          baddy.removeFromStage();
        }

        this.bullets.forEach((bullet) => {
          const { damage } = bullet;
          if (
            bullet.source === this.mech &&
            Game.hitTest(bullet, baddy)
          ) {
            // console.log("hit!!");
            // sound.Sound.from('hit.mp3').play();
            this.audio.hit();

            baddy.hit(damage);
            baddy.recoil(bullet);
            if (bullet.type !== 'super') {
              bullet.die();
            }
          }
          if (
            bullet.source !== this.mech &&
            Game.hitTest(bullet, this.mech)
          ) {
            bullet.die();
            this.mech.hit(damage);
            this.mech.recoil(bullet);
            this.audio.hit();
          }

          // Test for bullet collision.
          this.bullets.forEach((bullet2) => {
            if (
              bullet !== bullet2 &&
              bullet2.source !== this.mech &&
              Game.hitTest(bullet, bullet2)
            ) {
              bullet2.die();
            }
          });
        });
      }
      if (baddy.remove) {
        // if this baddy is not active then remove it from stage
        baddy.removeFromStage();
        this.baddies = this.baddies.filter((target) => target !== baddy);
      }
    });

    this.bullets = this.bullets.filter((bullet) => bullet.active);

    // draw
    window.requestAnimationFrame(this.animate);
  }

  enableInput(input) {
    for (let i = 0; i < this.inputs.length; i++) {
      if (this.inputs[i] === input) {
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
    return this.app.view.style.width;
  }

  scaledHeight() {
    return this.app.view.style.height;
  }

  addStar() {
    const star = new Star(this.w()+1, (Math.random() * this.h()));
    this.stars.push(star);
    this.app.stage.addChild(star.view);
  }

  addBaddyTweened(params) {
    const baddy = new BaddyTweened(params);
    this.baddies.push(baddy);
    this.app.stage.addChild(baddy.view);
  }

  createBaddyTweenedSquad() {
    const w = this.w();
    const h = this.h();
    const path = {

      // TODO: fix hardcoded last tween poing.
      x: [w + 45, w * Math.random(), w * Math.random(), -75],
      y: [h * Math.random(), h * Math.random(), h * Math.random()],
      shoot: Math.floor(Math.random() * 50),
      interpolation: TWEEN.Interpolation.CatmullRom,
      time: 9500,
    };

    const squadSize = (Math.floor(Math.random() * 5)) + 2;

    for (let i = 0; i < squadSize; i++) {
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
    this.app.stage.addChild(bullet.view);
  }

  gameOver() {
    console.log('game over man! game over!!!');
    const rank = this.top_scores.check(this.mech.score);
    if (rank !== -1 && rank < 3) {
      this.top_scores.showPlayerName();
    }
    this.title.show();
  }

  newGame() {
    // enable keyboard... bit of a hack, not really needed
    this.enableInput(this.inputs[0]);

    // Reset the baddie rate.
    this.baddie_rate = this.baddie_rate_default;

    // TODO: use newGame() function for first game
    this.baddies = [];
    // add player
    const params = { game: this, lives: 2 };
    this.mech.removeFromStage();
    this.mech = new Mech(params);
    this.app.stage.addChild(this.mech.view);

    this.score.updateLife(this.mech.lives);
    this.score.updateScore(0);
  }

  fullscreen() {
    const element = this.container;
    if (element.requestFullscreen) {
      if (!document.fullscreenElement) {
        element.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
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
    console.log('resize', this.stretch);
    let calcHeight;
    let calcWidth;
    let factor;

    // do we stretch to fullscreen ot keep aspect ratio?
    if (!this.stretch) {
      const WIDTH = this.width;
      const HEIGHT = this.height;
      // let pixi choose WebGL or canvas
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      if (screenWidth > screenHeight) {
        factor = screenHeight / HEIGHT;
      } else {
        factor = screenWidth / WIDTH;
      }
      // console.log(factor, calc_height, screen_height, calc_width, screen_width);

      this.app.renderer.view.style.display = 'block';
      calcHeight = `${HEIGHT * factor}px`;
      calcWidth = `${WIDTH * factor}px`;
    } else {
      calcHeight = `${window.innerHeight}px`;
      calcWidth = '100%';
    }
    this.app.renderer.view.style.width = calcWidth; // "100%";
    this.app.renderer.view.style.height = calcHeight; // "100%";
  }

  toggleStretch() {
    if (this.stretch) {
      this.stretch = false;
    } else {
      this.stretch = true;
    }
    return this.stretch;
  }

  static getAngle(x1, y1, x2, y2) {
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
      if (a.source !== b && b.source !== a) {
        const hx = a.x() - b.x();
        const hy = a.y() - b.y();
        const dist = Math.sqrt(hx * hx + hy * hy);
        const widthA = ((a.size()).h) / 2;
        const widthB = ((b.size()).h) / 2;
        return dist <= widthA + widthB;
      }
    }
    return false;
  }

  static checkBounds(x, y, h, w, sw, sh, mode) {
    if (mode === 'inside') {
      if (x - w / 2 > 0 && x + w / 2 < sw && y - h / 2 > 0 && y + h / 2 < sh) {
        return true;
      }
      return false;
    }
    if (mode === 'outside') {
      if (x + w / 2 > 0 && x - w / 2 < sw && y + h / 2 > 0 && y - h / 2 < sh) {
        return true;
      }
      return false;
    }

    console.log('Error in checkbounds');
    return false;
  }
}
