import sound from 'pixi-sound';

export default class Audio {
  constructor(game) {
    this.game = game;
    this.ready = false;

    this.game.app.loader
      .add('hit', 'audio/hit.mp3')
      .add('die', 'audio/die.mp3')
      .add('goodieDie', 'audio/goodieDie.mp3')
      .add('charge', 'audio/charge.mp3')
      .add('zap', 'audio/zap.mp3')
      .add('oneUp', 'audio/1up.mp3');

    this.game.app.loader.load((loader, res) => {
      this.audio = res;
      this.audio.zap.sound.volume = 0.15;

      // this.audio.die.sound.filters = [new sound.filters.DistortionFilter(0.3)];
      this.ready = true;
    });
  }

  isReady() {
    return (this.isReady && this.game.audioEnabled);
  }

  hit() {
    if (this.isReady()) {
      this.audio.hit.sound.play();
    }
  }

  zap() {
    if (this.isReady()) {
      this.audio.zap.sound.play();
    }
  }

  die() {
    if (this.isReady()) {
      this.audio.die.sound.play();
    }
  }

  goodieDie() {
    if (this.isReady()) {
      this.audio.goodieDie.sound.play();
    }
  }

  charge() {
    if (this.isReady()) {
      this.audio.charge.sound.play();
    }
  }

  oneUp() {
    if (this.isReady()) {
      this.audio.oneUp.sound.play();
    }
  }
}
