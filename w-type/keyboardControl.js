var GAME = GAME || {};

GAME.Keyboard = function(game){
  this.game = game;
  this.KEYCODE_ENTER = 13;   //usefull keycode
  this.KEYCODE_SPACE = 32;   //usefull keycode
  this.KEYCODE_UP = 38;    //usefull keycode
  this.KEYCODE_LEFT = 37;    //usefull keycode
  this.KEYCODE_RIGHT = 39;   //usefull keycode
  this.KEYCODE_W = 87;     //usefull keycode
  this.KEYCODE_A = 65;     //usefull keycode
  this.KEYCODE_D = 68;     //usefull keycode
  this.KEYCODE_S = 83;     //usefull keycode

  this.k_left = false;
  this.k_right = false;
  this.k_up = false;
  this.k_down = false;
  this.k_shoot = false;

  this.handleKeyDown = this.handleKeyDown.bind(this);
  this.handleKeyUp = this.handleKeyUp.bind(this);
  document.onkeydown = this.handleKeyDown;
  document.onkeyup = this.handleKeyUp;

};

//allow for WASD and arrow control scheme
GAME.Keyboard.prototype.handleKeyDown = function(e) {
  console.log(e.keyCode);
  //cross browser issues exist
  if(!e){ var e = window.event; }

  switch(e.keyCode) {
    case this.KEYCODE_SPACE:
      this.k_shoot = false;
      break;
    case this.KEYCODE_SPACE:
      this.k_charge = true;
      break;
    case this.KEYCODE_A:
      this.k_left = true;
      break;
    case this.KEYCODE_D:
      this.k_right = true;
      break;
    case this.KEYCODE_W:
      this.k_up = true;
      break;
    case this.KEYCODE_S:
      this.k_down = true;
      break;
    case this.KEYCODE_ENTER:
      if(canvas.onclick == this.handleClick){
        this.handleClick();
      }
      break;
  }
};

GAME.Keyboard.prototype.handleKeyUp = function(e) {
  //cross browser issues exist
  if(!e){ var e = window.event; }
  switch(e.keyCode) {
    case this.KEYCODE_SPACE:
      this.k_shoot = true;
      break;
    case this.KEYCODE_A:
      this.k_left = false;
      break;
    case this.KEYCODE_D:
      this.k_right = false;
      break;
    case this.KEYCODE_W:
      this.k_up = false;
      break;
    case this.KEYCODE_S:
      this.k_down = false;
      break;
  }
};
