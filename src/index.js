import Game from './w-type/Game.js';

let g;
function game() {
  g = new Game({
    width: 1024,
    height: 600,
    firerate: 10,
    baddie_rate: 0,
    baddie_rate_accel: 10,
    baddie_rate_min: 50,
  });
}
game();
