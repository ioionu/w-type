import * as PIXI from 'pixi.js';
import GameElement from './GameElement';
import Game from './Game';
import GoodyBullet from './GoodyBullet';
import LifeBar from './LifeBar';


/**
 * @class Mech
 * @construcor
 * */
export default class Mech extends GameElement {
  constructor(params) {
    super();
    this.position = new PIXI.Point();
    this.type = 'mech';

    this.game = params.game;
    this.lives = 0;
    this.score = 0;
    this.speed = 15;
    this.frames = {};
    this.loadDefaultFrames();
    this.frames.character = [
      PIXI.Texture.from('mech01.png'),
      PIXI.Texture.from('mech02.png'),
      PIXI.Texture.from('mech03.png'),
    ];
    this.view = new PIXI.AnimatedSprite(this.frames.character);
    this.view.animationSpeed = 0.01;
    this.view.play();
    this.view.anchor.x = 0.5;
    this.view.anchor.y = 0.5;
    this.view.position.y = 240;
    this.view.position.x = 100;

    this.realAnimationSpeed = 0.1;
    this.pitch = 0.2; // when mech is moving up or down
    this.fire_next = 0;
    this.charge = 0;
    this.charged = ('charged' in this.game) ? this.game.charged : 50;
    this.adj_altitude = false;
    this.state = {
      up: false,
      down: false,
      left: false,
      right: false,
      shoot: false,
    };
    this.scale = new PIXI.Point(0.5, 0.5);

    this.dieSound = () => this.game.audio.goodieDie();

    this.is_dead = true;

    // TODO: remove this.
    for (const p in params) {
      this[p] = params[p];
    }

    this.addLifeBar();
    this.addCharge();
  }

  addCharge() {
    this.charge_frame = new PIXI.AnimatedSprite([
      PIXI.Texture.from('charge01.png'),
      PIXI.Texture.from('charge02.png'),
      PIXI.Texture.from('charge03.png'),
    ]);
    this.charge_frame.animationSpeed = 0.10;
    this.charge_frame.play();
    this.charge_frame.anchor.x = 0.5;
    this.charge_frame.anchor.y = 0.5;
    this.charge_frame.visible = false;
    // this.charge_frame.position.y = 240;
    // this.charge_frame.position.x = 100;
    this.view.addChild(this.charge_frame);
  }

  resetState() {
    this.state = {};
  }

  moveUp(distance) {
    if (Game.checkBounds(this.x(), this.y() - distance, this.h(), this.w(), this.game.width, this.game.height, 'inside')) {
      this.view.position.y -= distance;
    }
    this.view.rotation = this.pitch * -1;
  }

  moveDown(distance) {
    if (Game.checkBounds(this.x(), this.y() + distance, this.h(), this.w(), this.game.width, this.game.height, 'inside')) {
      this.view.position.y += distance;
    }
    this.view.rotation = this.pitch;
  }

  moveRight(distance) {
    if (Game.checkBounds(this.x() + distance, this.y(), this.h(), this.w(), this.game.width, this.game.height, 'inside')) {
      this.view.position.x += distance;
    }
    this.view.rotation = 0;
  }

  moveLeft(distance) {
    if (Game.checkBounds(this.x() - distance, this.y(), this.h(), this.w(), this.game.width, this.game.height, 'inside')) {
      this.view.position.x -= distance;
    }
    this.view.rotation = 0;
  }

  moveTowards(x, y, speed) {
    let x1; let y1;
    const x0 = this.view.position.x;// - this.view.width;
    const y0 = this.view.position.y;

    // Offset the xcoord so that it is not under the finder.
    x += this.view.width / 2;

    let diffx = x0 - x;
    diffx = diffx < 0 ? diffx * -1 : diffx;
    const speedx = diffx < speed ? diffx : speed;

    let diffy = y0 - y;
    const altitudeDistance = diffy;
    diffy = diffy < 0 ? diffy * -1 : diffy;
    const speedy = diffy < speed ? diffy : speed;

    if (diffx > 0 || diffy > 0) {
      // distance from mech to touch
      const line = Math.sqrt(diffx * diffx + diffy * diffy);
      const propx = speedx / line;
      const propy = speedy / line;

      x1 = x0 + propx * (x - x0);
      y1 = y0 + propy * (y - y0);

      this.view.position.x = x1;
      this.view.position.y = y1;
    }

    const pitchThreshold = 5;
    this.adj_altitude = false;
    if (altitudeDistance > pitchThreshold) {
      this.view.rotation = this.pitch * -1;
      this.adj_altitude = true;
    }
    if (altitudeDistance < (pitchThreshold * -1)) {
      this.view.rotation = this.pitch;
      this.adj_altitude = true;
    }
    if (altitudeDistance <= pitchThreshold && altitudeDistance >= 0) {
      this.view.rotation = 0;
    }
  }

  update(game) {
    this.view.animationSpeed = this.realAnimationSpeed;
    this.fire_next += 1;
    this.charge += 1;


    const p = {
      x: this.view.position.x,
      y: this.view.position.y,
      w: this.view.width,
      h: this.view.height,
      rw: game.w(),
      rh: game.h(),
      m: 'inside',
    };

    if (this.active) {
      // get inputs from game
      const { inputs } = this.game;
      let activeInput;
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].enabled) {
          this.state = inputs[i].getState();
          activeInput = inputs[i];
        }
      }
      activeInput.update();
      if (this.charge > this.charged) {
        if (!this.charge_frame.visible) {
          this.game.audio.charge();
        }
        this.charge_frame.visible = true;
        
      } else {
        this.scale.set(1, 1);
        this.charge_frame.visible = false;
      }
    }
  }

  respawn() {
    // in the spirit of SMB 0 is a life
    if (this.lives >= 0) {
      this.view.textures = this.frames.character;
      this.view.gotoAndPlay(0);
      this.view.loop = true;
      this.active = true;
      this.is_dead = false;
      this.life = 100;
      this.life_bar.update(this.life);
      this.showLifeBar();
    } else if (!this.is_dead) {
      // this.active = false;
      this.is_dead = true;
      this.game.gameOver();
      this.tombStone();
      this.hideLifeBar();
    }
  }

  gameOver() {
    this.game.gameOver();
    this.tombStone();
  }

  /**
   * Construct a player 1 bullet.
   *
   * @param {*} screen_width
   * @param {*} screen_height
   * @return GoodyBullet
   */
  bullet() {
    let b;
    let distance;
    let p = {};

    // find target...
    const A = this.r();
    const a = (A < 0) ? this.y() : this.game.app.renderer.height - this.y();
    if (A !== 0) {
      // console.log(A,a);
      p = Game.getTargetPoint(A, a);
      b = p.x; // stash x as we use it to calculate the side c, and use that to calc speed
      p.y = (A > 0) ? this.game.app.renderer.height + 30 : 0 - 30;
      p.x += this.x();
      distance = Math.sqrt(a * a + b * b);
    } else {
      // shoot strait
      p = {};
      p.x = this.game.app.renderer.width + 30; // TODO remove hardcode 30

      p.y = this.y();
      distance = p.x - this.x();
    }


    const bullet = new GoodyBullet({
      x1: this.x(),
      y1: this.y(),
      x2: p.x,
      y2: p.y,
      source: this,
      damage: 50,
      distance,
      game: this.game,
      type: 'goodyBullet',
    });
    // this.bullets.push(bullet);
    // this.stage.addChild(bullet.view);
    // var instance = createjs.Sound.play("fire");
    return bullet;
  }

  superBullet() {
    let x; let y; let b; let distance;
    let p = {};

    // find target...
    const A = this.r();
    const a = (A < 0) ? this.y() : this.game.app.renderer.height - this.y();
    if (A !== 0) {
      // console.log(A,a);
      p = Game.getTargetPoint(A, a);
      b = p.x; // stash x as we use it to calculate the side c, and use that to calc speed
      p.y = (A > 0) ? this.game.app.renderer.height + 30 : 0 - 30;
      p.x += this.x();
      distance = Math.sqrt(a * a + b * b);
    } else {
      // shoot strait
      p = {};
      p.x = this.game.renderer.width + 30; // TODO remove hardcode 30

      p.y = this.y();
      distance = p.x - this.x();
    }


    const bullet = new GoodyBullet({
      x1: this.x(),
      y1: this.y(),
      x2: p.x,
      y2: p.y,
      source: this,
      damage: 100,
      distance,
      game: this.game,
      type: 'superBullet',
    });
    // this.bullets.push(bullet);
    // this.stage.addChild(bullet.view);
    // var instance = createjs.Sound.play("fire");
    return bullet;
  }


  /*
  * replace mech with tomb stone
  * @method tombStone
  */
  tombStone() {
    this.charge_frame.visible = false;
    this.frames.tomb = [
      PIXI.Texture.from('tomb01.png'),
      PIXI.Texture.from('tomb02.png'),
      PIXI.Texture.from('tomb03.png'),
      PIXI.Texture.from('tomb04.png'),
      PIXI.Texture.from('tomb05.png'),
    ];

    this.view.textures = this.frames.tomb;
    this.view.loop = false;
    this.view.interactive = true;
    this.view.on('mousedown', () => {
      this.game.newGame();
    });

    this.view.gotoAndPlay(0);
  }
}

// end mech
