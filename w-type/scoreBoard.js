var GAME = GAME || {};

GAME.ScoreBoard = function(score, lives) {
  this.score = score;
  this.lives = lives;

  value = 'Hello';
  this.view = new PIXI.Text(value, {font : '24px Arial', fill : 0x0000, align : 'center'});
  this.update();
};

GAME.ScoreBoard.prototype.updateScore = function(score) {
  this.score = score;
  this.update();
  console.log("xscore: " + this.score);
};

GAME.ScoreBoard.prototype.updateLife = function(lives) {
  this.lives = lives;
  this.update();
  console.log("xlives: " + this.lives);
};

GAME.ScoreBoard.prototype.update = function() {
  var t = "Lives: " + this.lives + " Score: " + this.score;
  this.view.text = t;
};
