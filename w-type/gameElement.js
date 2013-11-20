var GAME = GAME || {};

GAME.GameElement = function() {
  this.active = true;
  this.life = 100;
  this.size = function(){
    return {
      'w': this.view.texture.width
     ,'h': this.view.texture.height
    }
  }
};

GAME.GameElement.prototype.x = function(x){
  if(typeof x !== 'undefined'){
    this.view.position.x = x;
  }
  return this.view.position.x;
};

GAME.GameElement.prototype.y = function(y){
  if(typeof y !== 'undefined') {
    this.view.position.y = y;
  }
  return this.view.position.y;
};

GAME.GameElement.prototype.a = function(a){
  if(typeof a !== 'undefined') {
    this.view.alpha = a;
  }
  return this.view.alpha;
};

GAME.GameElement.prototype.w = function(w){
  if(typeof w !== 'undefined') {
    this.view.width = w;
  }
  return this.view.width;
};

GAME.GameElement.prototype.h = function(h){
  if(typeof h !== 'undefined') {
    this.view.height = h;
  }
  return this.view.height;
};

GAME.GameElement.prototype.right = function(){
  return this.view.position.x - this.view.width/2;
}

GAME.GameElement.prototype.r = function(r) {
  if(typeof r !== 'undefined') {
    this.view.rotation = r;
  }
  return this.view.rotation;
};

GAME.GameElement.prototype.hit = function(damage) {
  this.life -= damage;
  console.log("hit", this.life);
  if(this.life <= 0) {
    this.die();
    return true;
  } else {
    createjs.Sound.play("hit");
    return false;
  }
}
GAME.GameElement.prototype.die = function(){
  stage.removeChild(this.view);
  this.active = false;
  createjs.Sound.play(this.sound.die);
};

GAME.GameElement.prototype.recoil = function(bullet) {
  var recoil = 5;
  if(bullet.x() < this.x()) {
    this.x( this.x()+recoil);
  } else {
    this.x( this.x()-recoil);
  }
};
// end game element

