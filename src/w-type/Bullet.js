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
      PIXI.Texture.from('bullet01'),
      // PIXI.Texture.from("bullet02"),
      // PIXI.Texture.from("bullet03")
    ];
    this.view = new PIXI.AnimatedSprite(this.frames);
    this.view.animationSpeed = 0.05;
    this.view.play();
    this.view.anchor.x = this.view.anchor.y = 0.5;
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
      this.finish_point = param.game.renderer.width + this.view.width;
    }

    // first point on bullets bezier path will be this far out in front of the origin
    this.first_point_distance = 100;
    if (param.x2 < param.x1) {
      this.first_point_distance *= -1;
    }

    this.tween.x = new TWEEN.Tween({
      x: this.x(),
      target_x: this.x2,
      bullet: this,
    })
      .to({ x: [this.x() + this.first_point_distance, param.x2, this.finish_point] }, 1500)
      .delay(0)
      .easing(TWEEN.Easing.Linear.None)
      .interpolation(this.interpolation)
      .onUpdate(function () {
        this.bullet.x(this.x);
      })
      .onComplete(function () {
        this.bullet.die();
      })
      .start();

    this.tween.y = new TWEEN.Tween({
      y: this.y(),
      target_y: this.y2,
      bullet: this,
    })
      .to({ y: [this.y(), param.y2, param.y2] }, 1500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .interpolation(this.interpolation)
      .onUpdate(function () {
        this.bullet.y(this.y);
      })
      .start();
  }

  update() {
    this.view.position.x += this.BULLET_SPEED;
  }
}
