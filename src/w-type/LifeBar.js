import * as PIXI from 'pixi.js';
import TWEEN from '@tweenjs/tween.js';

export default class LifeBar {
  constructor(param) {
    this.width = 20;
    this.x = this.width * -1;
    this.y = -20;
    this.life = param.life;
    this.life_full = param.life_full;
    this.view = new PIXI.Graphics();
  }

  update(life) {
    this.life = life;
    this.draw();
  }

  draw() {
    this.view.clear();
    this.view.lineStyle(0, 0xFFFFFF, 1);
    this.view.beginFill(0xFFFFFF);
    this.view.drawRect(this.x, this.y, this.width, 3);
    this.view.lineStyle(0, 0xCCCCCC, 1);
    this.view.beginFill(0x333333);
    this.view.drawRect(this.x + 1, this.y + 1, this.life / this.life_full * this.width, 1);
    this.interpolation = TWEEN.Interpolation.Bezier;

    const lifeBar = this;
    const coord = { alpha: this.view.alpha };
    this.tween = new TWEEN.Tween(coord)
      .to({ alpha: [1, 0] }, 1500)
      .delay(0)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        lifeBar.view.alpha = this.alpha;
      })
      .start();
  }
}
