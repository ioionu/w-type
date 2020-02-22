import webfontloader from "webfontloader";
import Game from './w-type/Game.js';


const WebFontConfig = {
  custom: {
    families: ['misakiminchoregular'],
    urls: ['/style/misaki/stylesheet.css']
  }
};
webfontloader.load(WebFontConfig);

let g;
function game() {
  new Game({
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
  // document.addEventListener('DOMContentLoaded', game);
  document.fonts.ready.then(() => {
    console.log("fuck shit");
    game();
  });
}
