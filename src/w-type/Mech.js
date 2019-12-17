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
    this.lives = 3;
    this.score = 0;
    this.speed = 7;
    this.frames = {};
    this.loadDefaultFrames();
    this.frames.character = [
      PIXI.Texture.from('mech01'),
      PIXI.Texture.from('mech02'),
      PIXI.Texture.from('mech03'),
    ];
    this.view = new PIXI.AnimatedSprite(this.frames.character);
    this.view.animationSpeed = 0.20;
    this.view.play();
    this.view.anchor.x = 0.5;
    this.view.anchor.y = 0.5;
    this.view.position.y = 240;
    this.view.position.x = 100;
    this.realAnimationSpeed = 0.20;
    this.pitch = 0.2; // when mech is moving up or down
    this.fire_next = 0;
    this.charge = 0;
    this.charged = 100;
    this.adj_altitude = false;
    this.state = {
      up: false,
      down: false,
      left: false,
      right: false,
      shoot: false,
    };

    this.filter = new PIXI.filters.ColorMatrixFilter();

    for (let p in params) {
      this[p] = params[p];
    }

    this.addLifeBar();
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
    let x1; var y1;
    let x0 = this.view.position.x;// - this.view.width;
    let y0 = this.view.position.y;
    x += this.view.width;

    let diffx = x0 - x;
    diffx = diffx < 0 ? diffx * -1 : diffx;
    let speedx = diffx < speed ? diffx : speed;

    let diffy = y0 - y;
    let altitude_distance = diffy;
    diffy = diffy < 0 ? diffy * -1 : diffy;
    let speedy = diffy < speed ? diffy : speed;

    if (diffx > 0 || diffy > 0) {
      // distance from mech to touch
      let line = Math.sqrt(diffx * diffx + diffy * diffy);
      let propx = speedx / line;
      let propy = speedy / line;

      x1 = x0 + propx * (x - x0);
      y1 = y0 + propy * (y - y0);

      this.view.position.x = x1;
      this.view.position.y = y1;
    }

    let pitch_threshold = 5;
    this.adj_altitude = false;
    if (altitude_distance > pitch_threshold) {
      this.view.rotation = this.pitch * -1;
      this.adj_altitude = true;
    }
    if (altitude_distance < (pitch_threshold * -1)) {
      this.view.rotation = this.pitch;
      this.adj_altitude = true;
    }
    if (altitude_distance <= pitch_threshold && altitude_distance >= 0) {
      this.view.rotation = 0;
    }
  }

  update(game) {
    this.view.animationSpeed = this.realAnimationSpeed;
    this.fire_next++;
    this.charge++;


    let p = {
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
      let {inputs} = this.game;
      let active_input;
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].enabled) {
          this.state = inputs[i].getState();
          active_input = inputs[i];
        }
      }
      active_input.update();
      if (this.charge > this.charged) {
        this.view.filters = [this.filter];
      } else {
        this.view.filters = null;
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
      this.life = 100;
      this.life_bar.update(this.life);
      console.log('respawn');
    } else {
      this.active = false;
      this.game.gameOver();
    }
  }

  bullet(screen_width, screen_height) {
    // createjs.Sound.play("peow");
    let x; var y; var b; var distance;
    let p = {};

    // find target...
    let A = this.r();
    console.log('rotation', A);
    let a = (A < 0) ? this.y() : this.game.app.renderer.height - this.y();
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
      distance: distance,
      game: this.game,
      type: 'goodyBullet',
    });
    // this.bullets.push(bullet);
    // this.stage.addChild(bullet.view);
    // var instance = createjs.Sound.play("fire");
    return bullet;
  }

  superBullet(screen_width, screen_height) {
    // createjs.Sound.play("peow");
    let x; var y; var b; var distance;
    let p = {};

    // find target...
    let A = this.r();
    let a = (A < 0) ? this.y() : this.game.app.renderer.height - this.y();
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
    this.frames.tomb = [
      PIXI.Texture.from('tomb01'),
      PIXI.Texture.from('tomb02'),
      PIXI.Texture.from('tomb03'),
      PIXI.Texture.from('tomb04'),
      PIXI.Texture.from('tomb05'),
    ];

    this.view.textures = this.frames.tomb;
    this.view.loop = false;
    this.view.interactive = true;
    let _this = this;
    this.view.on('mousedown', (e) => {
      _this.game.newGame();
    });

    this.view.gotoAndPlay(0);
    this.view.onComplete = function () {
      console.log('i am function');
    };
  }
}

// end mech
