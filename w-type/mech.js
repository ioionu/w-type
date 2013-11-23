var GAME = GAME || {};

GAME.Mech = function() {
  this.position = new PIXI.Point();
  this.frames = [
    PIXI.Texture.fromFrame("mech01.png")
   ,PIXI.Texture.fromFrame("mech02.png")
   ,PIXI.Texture.fromFrame("mech03.png")
  ];
  this.view = new PIXI.MovieClip(this.frames);
  this.view.animationSpeed = 0.20;
  this.view.play();
  this.view.anchor.x = 0.5;
  this.view.anchor.y = 0.5;
  this.view.position.y = 240;
  this.view.position.x = 100;
  this.realAnimationSpeed = 0.20;
  this.pitch = 0.2; // when mech is moving up or down

  this.addLifeBar();
};

GAME.Mech.constructor = GAME.Mech;

GAME.Mech.prototype = new GAME.GameElement();

GAME.Mech.prototype.derp = function() {
  console.log("derp");
};


GAME.Mech.prototype.up = function() {
  if(checkBounds(p.x, this.view.position.y - MECHSPEED, p.w, p.h, p.rw, p.rh, p.m)){
    this.view.position.y -= MECHSPEED;
  }
  this.view.rotation = this.pitch * -1;
}

GAME.Mech.prototype.down = function() {
  if(checkBounds(p.x, this.view.position.y + MECHSPEED, p.w, p.h, p.rw, p.rh, p.m)){
    this.view.position.y += MECHSPEED;
  }
  this.view.rotation = this.pitch;
}
GAME.Mech.prototype.update = function() {
  this.view.animationSpeed = this.realAnimationSpeed;
  p = {
    'x': this.view.position.x
   ,'y': this.view.position.y
   ,'w': this.view.width
   ,'h': this.view.height
   ,'rw': renderer.width
   ,'rh': renderer.height
   ,'m':'inside'
  };
  if(k_right) {
    p.x = this.view.position
    if(checkBounds(this.view.position.x + MECHSPEED, p.y, p.w, p.h, p.rw, p.rh, p.m)){
      this.view.position.x += MECHSPEED;
    }
    this.view.rotation = 0;
  }
  
  if(k_left) {
    if(checkBounds(this.view.position.x - MECHSPEED, p.y, p.w, p.h, p.rw, p.rh, p.m)){
      this.view.position.x -= MECHSPEED/2;
    }
    this.view.rotation = 0;
  }
  
  var adj_altitude = false;
  if(k_up) {
    this.up();
    adj_altitude = true;
  }
  
  if(k_down) {
    this.down();
    adj_altitude = true;
  }

  if(adj_altitude == false) {
    this.view.rotation = 0;
  }
};

//end mech
