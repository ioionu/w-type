import * as PIXI from 'pixi.js';
import TWEEN from '@tweenjs/tween.js';
import GameElement from './GameElement';

/*
 * {'x': this.x()-50, 'y': this.y()};
 * */
export default class Bullet extends GameElement {
  constructor(param) {
    super();
    this.type = 'bullet';
    this.BULLET_SPEED = 5;
    this.damage = param.damage;
    this.source = param.source;
    this.frames = [
      PIXI.Texture.from('bullet01.png'),
      PIXI.Texture.from("bullet02.png"),
      PIXI.Texture.from("bullet03.png")
    ];
    this.view = new PIXI.AnimatedSprite(this.frames);
    this.view.animationSpeed = 0.05;
    this.view.play();
    this.view.anchor.x = 0.5;
    this.view.anchor.y = 0.5;
    this.view.position.x = param.x1;
    this.view.position.y = param.y1;

    this.game = param.game;

    this.interpolation = TWEEN.Interpolation.Bezier;
    if (typeof param.interpolation === 'None') {
      this.interpolation = param.interpolation;
    }
    this.tween = {};

    // bullet will continue to the closeset left or right edge after hitting target x,y
    // TODO: dont hardcode 30 (get it from width of bullet or make a standard out of bounds
    // distance).
    this.finish_point = 0 - this.view.width;

    if (param.x2 > param.x1) {
      this.finish_point = param.game.app.renderer.width + this.view.width;
    }

    // first point on bullets bezier path will be this far out in front of the origin
    this.first_point_distance = 100;
    if (param.x2 < param.x1) {
      this.first_point_distance *= -1;
    }

    // Play shoot sound.
    this.game.audio.zap();

    const bullet = this;

    const coord = {
      x: this.x(),
    };
    this.tween.x = new TWEEN.Tween(coord)
      .to({ x: [this.x() + this.first_point_distance, param.x2, this.finish_point] }, 1500)
      .delay(0)
      .easing(TWEEN.Easing.Linear.None)
      .interpolation(this.interpolation)
      .onUpdate(() => {
        this.view.rotation = (bullet.x() < coord.x) ? 0 : 3.1415;
        bullet.x(coord.x);
      })
      .onComplete(() => {
        bullet.die();
      })
      .start();

    const yCoord = {
      y: this.y(),
    };

    this.tween.y = new TWEEN.Tween(yCoord)
      .to({ y: [this.y(), param.y2, param.y2] }, 1500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .interpolation(this.interpolation)
      .onUpdate(() => {
        bullet.y(yCoord.y);
      })
      .start();
  }

  update() {
    this.view.position.x += this.BULLET_SPEED;
  }
}
