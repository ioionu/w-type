var GAME = GAME || {};

GAME.TopScores = function(game){
  this.game = game;
  this.length = 3;
  this.load();
};

GAME.TopScores.prototype.default = function(){
  var scores = [];
  scores[0] = {name: 'AAA', score: 100};
  scores[1] = {name: 'FUK', score: 50};
  scores[2] = {name: 'JOS', score: 1};

  localStorage.setItem("top-scores", JSON.stringify(scores));
};

GAME.TopScores.prototype.load = function(){
  var stored = localStorage.getItem("top-scores");
  if(stored === null){
    this.default();
    stored = localStorage.getItem("top-scores");
  }
  this.scores = JSON.parse(stored);
};

GAME.TopScores.prototype.save = function(){
  localStorage.setItem("top-scores", JSON.stringify(this.scores));
};

GAME.TopScores.prototype.submit = function(score){
  for(var i = 0; i < this.length; i++) {
    if(score.score >= this.scores[i].score) {
      score.name = score.name.substr(0,3);
      score.name = score.name.toUpperCase();
      this.scores.splice(i,0,score);
      this.save();
      this.game.title.update();
      return true;
    }
  }
  return false;
};

GAME.TopScores.prototype.check = function(score){
  for(var i = 0; i < this.length; i++) {
    if(score >= this.scores[i].score) {
      return i;
    }
  }
  return -1;
};


GAME.TopScores.prototype.get = function(){
  return this.scores;
};

GAME.TopScores.prototype.getString = function(){
  var top_string = "Top Scores\n";
  for(var i = 0; i < this.length; i++){
    top_string += (i+1) + " " + this.scores[i].name + " " + this.scores[i].score + "\n";
  }
  return top_string;
};
