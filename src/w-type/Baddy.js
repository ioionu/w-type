import * as PIXI from 'pixi.js';
import GameElement from './GameElement';
import Game from './Game';
import LifeBar from './LifeBar';

class Baddy extends GameElement {
  constructor() {
    super();
    this.SPEED = 1;
    this.YMOD = 0.1;
    this.YBASE = Game.getHeight() * Math.random();
    this.YPOWER = Math.random()*100;

    this.frames = {};
    this.frames.character = [
      PIXI.Texture.fromFrame("baddy01"),
      PIXI.Texture.fromFrame("baddy02"),
      PIXI.Texture.fromFrame("baddy03")
    ];

    this.view = new PIXI.extras.MovieClip(this.frames.character);
    this.view.animationSpeed = 0.20;
    this.view.play();
    this.view.anchor.x = this.view.anchor.y = 0.5;
    this.view.position.x = renderer.width;
    this.view.position.y = this.YBASE;

    this.addLifeBar();
    this.loadDefaultFrames();
    this.sound = {};
    this.sound.die = "die";
  }

  updateLife() {
    this.view.addChild( new LifeBar().view );
    //life_bar.scale.x = this.life / this.life_full;
  }

  update() {
    this.view.position.x -= this.SPEED;
    this.view.position.y = (Math.sin( (this.x() * this.YMOD) ) * this.YPOWER) + this.YBASE;
    this.YPOWER -= this.YPOWER * (this.YMOD/100);
    if ( this.x() === 600 ) {
      params = {x1: this.x(), y1: this.y(), x2: mech.x(), y2: mech.y(), source: this, damage: 10};
      i = bullets.push( new GAME.Bullet(params));
      stage.addChild(bullets[i-1].view);
    }
  }

  inBounds() {
    return GAME.game.checkBounds(
      this.view.position.x,
      this.view.position.y,
      this.view.width,
      this.view.height,
      renderer.width,
      renderer.height,
      'outside'
    );
  }
}

export function addBaddy() {
  var i = baddies.push( new Baddy() );
  stage.addChild(baddies[i-1].view);
}
//end baddy

export default Baddy;
