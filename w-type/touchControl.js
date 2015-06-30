var GAME = GAME || {};

GAME.Touch = function(game){
  console.log("touch this", game);
  this.game = game;
  this.move_id = 0;
  this.enabled = true;
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

GAME.Touch.prototype.touchStart = function(e){
  console.log('start', e, _this, this);
  this.enabled = true;
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
      this.k_shoot = true;
    }
  }
};

GAME.Touch.prototype.touchMove = function(e){

  var offset_left = this.game.renderer.view.offsetLeft;
  var offset_top = this.game.renderer.view.offsetTop;
  var ratio = this.game.height / parseInt(this.game.renderer.view.style.height);
  var x = (e.touches.item(this.move_id).clientX - offset_left) * ratio;
  var y = (e.touches.item(this.move_id).clientY - offset_top) * ratio;
  this.game.mech.move_x = x;
  this.game.mech.move_y = y;
  //console.log('moveto:', x, y, ratio);
  //_this.mech.moveTowards(x, y, _this.mech.speed);
};


GAME.Touch.prototype.clear = function(){
  k_left=k_right=k_up=k_down=false;
};
