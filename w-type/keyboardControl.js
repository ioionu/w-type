var GAME = GAME || {};

GAME.Keyboard = function(game){
  this.game = game;
  this.KEYCODE_ENTER = 13;   //usefull keycode
  this.KEYCODE_SPACE = 32;   //usefull keycode
  this.KEYCODE_UP = 38;    //usefull keycode
  this.KEYCODE_DOWN = 40;    //usefull keycode
  this.KEYCODE_LEFT = 37;    //usefull keycode
  this.KEYCODE_RIGHT = 39;   //usefull keycode
  this.KEYCODE_W = 87;     //usefull keycode
  this.KEYCODE_A = 65;     //usefull keycode
  this.KEYCODE_D = 68;     //usefull keycode
  this.KEYCODE_S = 83;     //usefull keycode

  this.enabled = false;
  this.state = {};
  this.state.left = false;
  this.state.right = false;
  this.state.up = false;
  this.state.down = false;
  this.state.shoot = false;

  this.handleKeyDown = this.handleKeyDown.bind(this);
  this.handleKeyUp = this.handleKeyUp.bind(this);
  document.onkeydown = this.handleKeyDown;
  document.onkeyup = this.handleKeyUp;

};

GAME.Keyboard.prototype.enable = function(){
  this.enabled = true;
};

GAME.Keyboard.prototype.disable = function(){
  this.enabled = false;
};

GAME.Keyboard.prototype.getState = function(){
  return this.state;
};

GAME.Keyboard.prototype.resetState = function(){
  this.state = {};
};

GAME.Keyboard.prototype.clearShoot = function(){
  this.state.shoot = false;
};

//allow for WASD and arrow control scheme
GAME.Keyboard.prototype.handleKeyDown = function(e) {
  if(!this.enabled){
    this.game.enableInput(this);
  }
  switch(e.keyCode) {
    case this.KEYCODE_SPACE:
      this.state.shoot = false;
      break;
    case this.KEYCODE_ENTER:
      this.state.shoot = false;
      break;
    case this.KEYCODE_LEFT:
      this.state.left = true;
      break;
    case this.KEYCODE_A:
      this.state.left = true;
      break;
    case this.KEYCODE_RIGHT:
      this.state.right = true;
      break;
    case this.KEYCODE_D:
      this.state.right = true;
      break;
    case this.KEYCODE_UP:
      this.state.up = true;
      break;
    case this.KEYCODE_W:
      this.state.up = true;
      break;
    case this.KEYCODE_DOWN:
      this.state.down = true;
      break;
    case this.KEYCODE_S:
      this.state.down = true;
      break;
  }
};

GAME.Keyboard.prototype.handleKeyUp = function(e) {
  //console.log("key", e.keyCode);
  switch(e.keyCode) {
    case this.KEYCODE_SPACE:
      this.state.shoot = true;
      break;
    case this.KEYCODE_ENTER:
      this.state.shoot = true;
      break;
    case this.KEYCODE_LEFT:
      this.state.left = false;
      break;
    case this.KEYCODE_A:
      this.state.left = false;
      break;
    case this.KEYCODE_RIGHT:
      this.state.right = false;
      break;
    case this.KEYCODE_D:
      this.state.right = false;
      break;
    case this.KEYCODE_UP:
      this.state.up = false;
      break;
    case this.KEYCODE_W:
      this.state.up = false;
      break;
    case this.KEYCODE_S:
      this.state.down = false;
      break;
    case this.KEYCODE_DOWN:
      this.state.down = false;
      break;
  }
};

GAME.Keyboard.prototype.update = function(){
  var mech = this.game.mech;

  if(this.state.up) {
    mech.moveUp(mech.speed);
    mech.adj_altitude = true;
  }

  if(this.state.down) {
    mech.moveDown(mech.speed);
    mech.adj_altitude = true;
  }

  else if(!this.state.down && !this.state.up){
    mech.adj_altitude = false;
  }

  if(this.state.left) {
    mech.moveLeft(mech.speed/2);
  }

  if(this.state.right) {
    mech.moveRight(mech.speed);
  }

  if(mech.adj_altitude === false) {
    mech.view.rotation = 0;
  }

  // shoot bullet
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
