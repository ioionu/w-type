var GAME = GAME || {};

GAME.Touch = function(game){
  console.log("touch this", game);
  this.game = game;
  this.direction_element = document.getElementById(this.game.id);
  this.hammer = new Hammer(this.direction_element);
  this.hammer.get('swipe').set({direction: Hammer.DIRECTION_ALL, threshold: 7, velocity: 0.33});
  this.hammer.get('tap').set({interval: 25});
  var _this = this;
  this.hammer.on('swipeleft', function(e){
    console.log("swipeleft", e);
    _this.clear();
    k_left=true;
  });
  this.hammer.on('swiperight', function(e){
    console.log("swiperight", e);
    _this.clear();
    k_right=true;
  });
  this.hammer.on('swipeup', function(e){
    console.log("swipeup", e);
    _this.clear();
    k_up=true;
  });
  this.hammer.on('swipedown', function(e){
    console.log("swipedown", e);
    _this.clear();
    k_down=true;
  });
  this.hammer.on('tap', function(e){
    var half_way = window.innerWidth/2;
    //console.log("tap", half_way, e.center.x, e);
    if(e.center.x < half_way) {
      _this.clear();
    } else {
      k_shoot = true;
    }
  });
};

GAME.Touch.prototype.clear = function(){
  k_left=k_right=k_up=k_down=false;
};
