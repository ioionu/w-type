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
};

GAME.Mech.constructor = GAME.Mech;

GAME.Mech.prototype = new GAME.GameElement();

GAME.Mech.prototype.derp = function() {
  console.log("derp");
};

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
  }
  
  if(k_left) {
    if(checkBounds(this.view.position.x - MECHSPEED, p.y, p.w, p.h, p.rw, p.rh, p.m)){
      this.view.position.x -= MECHSPEED/2;
    }
  }
  
  if(k_up) {
    if(checkBounds(p.x, this.view.position.y - MECHSPEED, p.w, p.h, p.rw, p.rh, p.m)){
      this.view.position.y -= MECHSPEED;
    }
  }
  
  if(k_down) {
    if(checkBounds(p.x, this.view.position.y + MECHSPEED, p.w, p.h, p.rw, p.rh, p.m)){
      this.view.position.y += MECHSPEED;
    }
  }
};

//end mech
