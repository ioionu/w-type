var GAME = GAME || {};

export default class TopScores {
  constructor(game) {
    this.game = game;
    this.length = 3;
    this.load();
    this.playerName();
  }

  default(){
    var scores = [];
    scores[0] = {name: 'AAA', score: 100};
    scores[1] = {name: 'FUK', score: 50};
    scores[2] = {name: 'JOS', score: 1};

    localStorage.setItem("top-scores", JSON.stringify(scores));
  }

  load(){
    var stored = localStorage.getItem("top-scores");
    if(stored === null){
      this.default();
      stored = localStorage.getItem("top-scores");
    }
    this.scores = JSON.parse(stored);
  }

  save(){
    localStorage.setItem("top-scores", JSON.stringify(this.scores));
  }

  playerNameSubmit(e){
    var name = this.form_text.value;
    this.submit({name: name, score: this.game.mech.score});
    this.hidePlayerName();
  }

  playerNameCancel(e){
    this.form_text.value = "";
    this.hidePlayerName();
  }

  showPlayerName(){
    this.form_container.style.display = 'block';
  }

  hidePlayerName(){
    this.form_container.style.display = 'none';
  }

  playerName(){
    var form_text = document.createElement("input");
    form_text.type = 'text';
    form_text.setAttribute('maxlength', 3);
    form_text.setAttribute('pattern', '[A-Z]*');

    var form_button = document.createElement("button");
    form_button.appendChild(document.createTextNode("Save"));
    this.playerNameSubmit = this.playerNameSubmit.bind(this);
    form_button.addEventListener('click', this.playerNameSubmit);

    var form_cancel = document.createElement("button");
    form_cancel.appendChild(document.createTextNode("Cancel"));
    this.playerNameCancel = this.playerNameCancel.bind(this);
    form_cancel.addEventListener('click', this.playerNameCancel);

    var form_container = document.createElement("div");
    form_container.id = "player-name";
    form_container.style.position = 'absolute';
    form_container.style.top = 0;
    form_container.style.width = "100%";
    form_container.style.height = "100%";
    form_container.style.display = "none";

    var form_inner = document.createElement("div");
    form_inner.className = 'inner';
    form_inner.style.display = 'flex';
    form_inner.style.alignItems = 'center';
    form_inner.style.justifyContent = 'center';
    form_inner.style.width = this.game.scaledWidth();
    form_inner.style.height = this.game.scaledHeight();
    form_inner.style.margin = 'auto';
    form_inner.style.backgroundColor = 'rgba(0,0,0,0.75)';

    form_inner.appendChild(form_text);
    form_inner.appendChild(form_cancel);
    form_inner.appendChild(form_button);
    form_container.appendChild(form_inner);

    var container_name = this.game.id + "-container";

    this.form_text = form_text;
    this.form_container = form_container;
    document.getElementById(container_name).appendChild(form_container);
  }

  submit(score){
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
  }

  check(score){
    for(var i = 0; i < this.scores.length; i++) {
      if(score >= this.scores[i].score) {
        return i;
      }
    }
    return -1;
  }

  get(){
    return this.scores;
  }

  getString(){
    var top_string = "Top Scores\n";
    var scores_line, line_number, line_name, line_scores;
    for(var i = 0; i < this.length; i++){
      //TODO: switch to es6 string template
      line_number = (i+1);
      line_name = this.scores[i].name;
      line_scores = parseInt(this.scores[i].score);
      scores_line = sprintf("%'03s %' 3s : %'09d\n", line_number, line_name, line_scores);
      top_string += scores_line;
    }
    return top_string;
  }
}
