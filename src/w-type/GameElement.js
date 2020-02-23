import * as PIXI from 'pixi.js';
import LifeBar from './LifeBar';
import Game from './Game';

class GameElement {
  constructor() {
    this.active = true;
    this.remove = false;
    this.life = 100;
    this.life_full = this.life;
    this.onDie = null;
    this.size = () => ({
      w: this.view.texture.width,
      h: this.view.texture.height,
    });

  }

  loadDefaultFrames(x) {
    if (typeof this.frames === 'undefined') {
      this.frames = {};
    }
    this.frames.explode = [
      PIXI.Texture.from('boom01.png'),
      PIXI.Texture.from('boom02.png'),
      PIXI.Texture.from('boom03.png'),
    ];
  }

  x(x) {
    if (typeof x !== 'undefined') {
      this.view.position.x = x;
    }
    return this.view.position.x;
  }

  y(y) {
    if (typeof y !== 'undefined') {
      this.view.position.y = y;
    }
    return this.view.position.y;
  }

  a(a) {
    if (typeof a !== 'undefined') {
      this.view.alpha = a;
    }
    return this.view.alpha;
  }

  w(w) {
    if (typeof w !== 'undefined') {
      this.view.width = w;
    }
    return this.view.width;
  }

  h(h) {
    if (typeof h !== 'undefined') {
      this.view.height = h;
    }
    return this.view.height;
  }

  right() {
    return this.view.position.x - this.view.width/2;
  }

  r(r) {
    if (typeof r !== 'undefined') {
      this.view.rotation = r;
    }
    return this.view.rotation;
  }

  hit(damage) {
    this.life = (this.life - damage < 0) ? 0 : this.life - damage;
    if (typeof this.life_bar !== 'undefined') {
      this.life_bar.update( this.life ); /* ugh... now i understand why js is...
                                                                  * TODO: look at crreating a life() function in baddy
                                                                  * or do use _super fu http://ejohn.org/blog/simple-javascript-inheritance/
                                                                  */
    }
    // console.log("hit", this.life);
    if (this.life <= 0) {
      this.die();

      // did we kill baddie?
      if (this.type === 'baddyTweened') {
        this.game.mech.score += this.value;
        this.game.score.updateScore(this.game.mech.score);
      }

      // did we be dead?
      if (this.type === 'mech') {
        this.lives--;
        this.game.score.updateLife(this.lives);
      }
      return true;
    }
    return false;
  }

  die() {
    // if explode returns false then it did not blow up the element and we need to remove it here
    // TODO: clean up explode() so it does not do this funk
    if (!this.explode()) {
      this.removeFromStage();
    }
    this.active = false;
  }

  explode() {
    if (typeof this.frames.explode !== 'undefined') {
      this.view.textures = this.frames.explode;
      this.view.gotoAndPlay(0);
      this.view.loop = false;
      this.view.game_element = this;
      const gameElement = this;
      this.view.onComplete = () => {
        if (typeof gameElement !== 'undefined') {
          gameElement.remove = true;
          if (typeof gameElement.respawn !== 'undefined') {
            gameElement.respawn();
          }
        }
      };
      return true;
    }
    return false;
  }

  removeFromStage() {
    if (typeof this.game !== 'undefined' && this.view.stage !== null) {
      this.game.app.stage.removeChild(this.view);
    }
  }

  recoil(bullet) {
    const recoil = 10;
    if (bullet.x() < this.x()) {
      if (Game.checkBounds(this.x() + recoil, this.y(), this.h(), this.w(), this.game.width, this.game.height, 'inside')) {
        this.x( this.x()+recoil);
      }
    } else {
      const check = Game.checkBounds(
        (this.x() - recoil),
        this.y(),
        this.h(),
        this.w(),
        this.game.width,
        this.game.height,
        'inside'
      );
      if (check) {
        this.x(this.x() - recoil);
      }
    }
  }

  addLifeBar() {
    this.life_bar = new LifeBar({
      life_full: this.life_full,
      life: this.life,
    });
    this.view.addChild(this.life_bar.view);
  }

  showLifeBar() {
    this.life_bar.view.visible = true;
  }

  hideLifeBar() {
    this.life_bar.view.visible = false;
  }

}

export default GameElement;
