var GAME = GAME || {};

GAME.Touch = function(game){
  this.game = game;
  this.move_id = 0;
  this.enabled = true;
  this.state = {
    targetx: 100, //TODO: get defult from current mech pos
    targety: 240,
    touch: false
  };
  this.direction_element = document.getElementById(this.game.id);
  this.current_touches = [];

  this.touchMove = this.touchMove.bind(this);
  this.touchStart = this.touchStart.bind(this);
  this.touchEnd = this.touchEnd.bind(this);

  this.direction_element.addEventListener('touchstart', this.touchStart, false);
  this.direction_element.addEventListener('touchmove', this.touchMove, false);
  this.direction_element.addEventListener('touchcancel', this.touchCancel, false);
  this.direction_element.addEventListener('touchend', this.touchEnd, false);

};

GAME.Touch.prototype.getState = function(){
  return this.state;
};

GAME.Touch.prototype.resetState = function(){
  this.state = {};
};

GAME.Touch.prototype.enable = function(){
  this.enabled = true;
};

GAME.Touch.prototype.disable = function(){
  this.enabled = false;
};

GAME.Touch.prototype.update = function(){
  var mech = this.game.mech;
  mech.moveTowards(this.state.targetx, this.state.targety, mech.speed);

  if(this.state.shoot) {
    if(mech.fire_next > this.game.firerate){
      var bullet = mech.bullet(mech.w(), mech.h());
      if(mech.charge > mech.charged){
        bullet.super();
      }
      this.game.fire(bullet);
      mech.fire_next = 0;
      mech.charge = 0;
      mech.state.shoot = false;
      mech.state.charge = false;
      this.state.shoot = false;
      this.state.charge = false;
    }
  }

};

GAME.Touch.prototype.touchStart = function(e){
  if(!this.enabled){
    this.game.enableInput(this);
  }
  this.state.touch = true;
  var id;
  for(var i = 0; i < e.touches.length; i++){
    id = e.touches[i].identifier;
    this.current_touches[id] = e.timeStamp;
  }
};

GAME.Touch.prototype.touchCancel = function(e){
  console.log('cancel', e, _this, this);
  this.enabled = false;
};

GAME.Touch.prototype.touchEnd = function(e){
  //console.log('end', e, this);
  //this.touch.enabled = false;
  var id, duration;
  for(var i = 0; i < e.changedTouches.length; i++){
    id = e.changedTouches[i].identifier;
    duration = e.timeStamp - this.current_touches[id];

    if(duration < 200) {
      //console.log("touch length", id, this.current_touches[id], e.timeStamp);
      this.state.shoot = true;
    }
  }

  // clear touch controls so not to interfear with keyboard
  this.state.touch = false;
};

GAME.Touch.prototype.touchMove = function(e){

  var offset_left = this.game.renderer.view.offsetLeft;
  var offset_top = this.game.renderer.view.offsetTop;
  var ratio = this.game.height / parseInt(this.game.renderer.view.style.height);
  var x = (e.touches.item(this.move_id).clientX - offset_left) * ratio;
  var y = (e.touches.item(this.move_id).clientY - offset_top) * ratio;
  this.state.targetx = x;
  this.state.targety = y;
  this.state.touch = true;
  //console.log('moveto:', x, y, ratio);
  //_this.mech.moveTowards(x, y, _this.mech.speed);
};


GAME.Touch.prototype.clearShoot = function(){
  this.state.shoot = false;
};
