var GAME = GAME || {};

GAME.ScoreBoard = function(score, lives) {
  this.score = score;
  this.lives = lives;

  var value = 'Hello';
  this.view = new PIXI.Text(value, {font : '24px Fixed', fill : 0x0000, align : 'center'});
  this.update();
};

GAME.ScoreBoard.prototype.updateScore = function(score) {
  this.score = score;
  this.update();
};

GAME.ScoreBoard.prototype.updateLife = function(lives) {
  this.lives = lives;
  this.update();
};

GAME.ScoreBoard.prototype.update = function() {
  var t = "Lives: " + this.lives + " Score: " + this.score;
  this.view.text = t;
};
