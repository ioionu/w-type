import * as PIXI from 'pixi.js';

export default class ScoreBoard {
  constructor(score, lives) {
    this.score = score;
    this.lives = lives;

    const value = 'Hello';
    this.view = new PIXI.Text(value, {
      font: '24px misakiminchoregular', fill: 0xFFFFFF, align: 'center', lineHeight: '50', padding: 5,
    });
    this.update();
  }

  updateScore(score) {
    this.score = score;
    this.update();
  }

  updateLife(lives) {
    this.lives = lives;
    this.update();
  }

  update() {
    const t = `Lives: ${this.lives} Score: ${this.score}`;
    this.view.text = t;
  }
}
