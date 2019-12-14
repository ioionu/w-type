import * as PIXI from 'pixi.js';
import TWEEN from '@tweenjs/tween.js';
import GameElement from './GameElement';

/*
 * as opposed to baddy bullets above
 */
export default class GoodyBullet extends GameElement {
  constructor(param) {
    super();
    this.type = param.type;
    this.BULLET_SPEED = 2;
    this.damage = param.damage;
    this.source = param.source;
    this.frames = [
      PIXI.Texture.from('bullet01'),
      // PIXI.Texture.from("bullet02"),
      // PIXI.Texture.from("bullet03")
    ];

    this.game = param.game;
    this.view = new PIXI.extras.MovieClip(this.frames);
    this.view.animationSpeed = 0.05;
    this.view.play();
    this.view.anchor.x = this.view.anchor.y = 0.5;
    this.view.position.x = param.x1;
    this.view.position.y = param.y1;
    this.view.scale = new PIXI.Point(2, 0.5);
    this.target = {
      x: param.x2,
      y: param.y2,
    };
    this.colloide = true;
    this.tween_speed = param.distance * this.BULLET_SPEED;

    this.tween = new TWEEN.Tween({
      x: this.x(),
      y: this.y(),
      bullet: this,
    })
      .to({ x: this.target.x, y: this.target.y }, this.tween_speed)
      .delay(0)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(function () {
        this.bullet.x(this.x);
        this.bullet.y(this.y);
      })
      .onComplete(function () {
        this.bullet.die();
      })
      .start();
  }

  super() {
    this.type = 'super';
    this.view.scale = new PIXI.Point(5, 3);
    this.colloide = false;
    this.damage = 100;
  }
}
