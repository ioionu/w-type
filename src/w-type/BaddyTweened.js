import * as PIXI from 'pixi.js';
import GameElement from './GameElement';
import Game from './Game';
import LifeBar from './LifeBar';
import Bullet from './Bullet';

export default class BaddyTweened extends GameElement {
  constructor(params) {
    this.type = 'baddyTweened';
    this.SPEED = 1;
    this.YMOD = 0.1;
    this.YPOWER = Math.random() * 100;
    this.strength = 10;
    this.value = 1;

    this.frames = {};
    this.frames.character = [
      PIXI.Texture.from('baddy01'),
      PIXI.Texture.from('baddy02'),
      PIXI.Texture.from('baddy03'),
    ];

    this.view = new PIXI.extras.MovieClip(this.frames.character);
    this.view.animationSpeed = 0.20;
    this.view.play();
    this.view.anchor.x = this.view.anchor.y = 0.5;
    this.view.position.x = params.x[0];
    this.view.position.y = params.y[0];

    this.addLifeBar();
    this.loadDefaultFrames();
    this.sound = {};
    this.sound.die = 'die';

    this.target = params.mech;
    this.game = params.game;

    this.loaded = true; // can baddie fire? TODO: make a shot spacing

    this.path = {};
    this.path.easing = TWEEN.Easing.Linear.None;
    this.path.interpolation = TWEEN.Interpolation.Linear;
    this.path.time = 1500;
    this.path.delay = 0;
    this.path.shoot = 50; // time in tween * 100 that baddy will shoot

    for (let key in params) {
      this.path[key] = params[key];
    }

    this.tween = {};
    this.tween.x = new TWEEN.Tween({
      x: this.path.x[0],
      baddy: this,
    })
      .to({ x: this.path.x.slice(1) }, this.path.time)
      .delay(this.path.delay)
      .easing(this.path.easing)
      .interpolation(this.path.interpolation)
      .onUpdate(function () {
        this.baddy.x(this.x);
        // console.log(arguments[0]);
        // console.log(this.baddy.path.shoot, Math.floor( arguments[0] * 100 ));
        if (this.baddy.path.shoot == Math.floor(arguments[0] * 100)) {
          // console.log(this.baddy.path.shoot, Math.floor( arguments[0] * 100 ));
          this.baddy.bullet();
        }
      })
      .start();

    this.tween.y = new TWEEN.Tween({
      y: this.path.y[0],
      baddy: this,
    })
      .to({ y: this.path.y.slice(1) }, this.path.time)
      .delay(this.path.delay)
      .easing(this.path.easing)
      .interpolation(this.path.interpolation)
      .onUpdate(function () {
        this.baddy.y(this.y);
      })
      .start();
  }


  updateLife() {
    this.view.addChild(new LifeBar().view);
    // life_bar.scale.x = this.life / this.life_full;
  }

  bullet() {
    if (this.loaded && this.active) {
      let params = {
        x1: this.x(),
        y1: this.y(),
        x2: this.target.x(),
        y2: this.target.y(),
        source: this,
        damage: this.strength,
        game: this.game,
      };
      this.loaded = false;
      let bullet = new Bullet(params);
      this.game.fire(bullet);
    }
  }

  inBounds() {
    return Game.checkBounds(
      this.view.position.x,
      this.view.position.y,
      this.view.width,
      this.view.height,
      Game.w(),
      Game.h(),
      'outside',
    );
  }
}
