import webfontloader from "webfontloader";
import Game from './w-type/Game.js';

// See https://stackoverflow.com/questions/19002850/custom-font-in-pixi-js.
const WebFontConfig = {
  custom: {
    families: ['misakiminchoregular'],
    urls: ['/style/misaki/stylesheet.css']
  }
};
webfontloader.load(WebFontConfig);

function game() {
  const game = new Game({
    width: 1024,
    height: 600,
    firerate: 10,
    baddie_rate: 0,
    baddie_rate_accel: 10,
    baddie_rate_min: 50,
  });
}


if (document.fonts.ready === 'loaded') {
  game();
} else {
  document.fonts.ready.then(() => {
    game();
  });
}
