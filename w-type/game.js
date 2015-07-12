var GAME = GAME || {};

/**
 * Construct a game
 * @constructor
 * @param {object} params - width and height and m0ar!
 **/
GAME.game = function(params) {
  //TODO: im sure this could do something awesome!
  this.width = 800;
  this.height = 600;
  this.stretch = true;
  this.sprite_sheet = [
    'img/SpriteSheet.json',
    'img/page.jpg'
  ];
  this.id = "game";

  this.stars = [];
  this.baddies = [];
  this.bullets = [];

  for(var p in params) {
    this[p] = params[p];
  }

  /* make "this" available in this.update() when called from requestAnimFrame()
   * http://stackoverflow.com/questions/20177297/how-to-call-requestanimframe-on-an-object-method
   */
  this.animate = this.animate.bind(this);
//  this.init();

  this.loader = new PIXI.loaders.Loader();
  this.loader.add(this.sprite_sheet);
  this.loader.e = this;
  var _this = this;
  this.loader.once('complete', this.start);
  this.loader.load();

};

GAME.game.constructor = GAME.game;

/**
 * when assets are loaded prepare stage
 * @param {GAME.game} game object
 **/
GAME.game.prototype.start = function(e) {
  this.e.stage = new PIXI.Stage(0x000000);

  var WIDTH = this.e.width;
  var HEIGHT = this.e.height;
  // let pixi choose WebGL or canvas
  this.e.renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);
  // set the canvas width and height to fill the screen
  var screen_width = window.innerWidth;//800;
  var screen_height = window.innerHeight;//600;
  var factor;
  if(screen_width > screen_height) {
    factor = screen_height / HEIGHT;
  } else {
    factor = screen_width / WIDTH;
  }
  var calc_height = HEIGHT * factor;
  var calc_width = WIDTH * factor;


  this.e.renderer.view.style.display = "block";
  this.e.renderer.view.style.width = calc_width + "px";
  this.e.renderer.view.style.height = calc_height + "px";
  this.e.renderer.view.style.margin = "auto";
  this.e.renderer.view.id = this.e.id;

  //we need to place canvas in a container to prevent distortion in firefox
  this.e.container = document.createElement("div");
  this.e.container.id = this.e.id + "-container";
  this.e.container.style.width = "100%";
  this.e.container.style.height = "100%";

  // attach render to page
  this.e.container.appendChild(this.e.renderer.view);
  document.body.appendChild(this.e.container);
  this.e.baddie_next = 0;

  // background image
  var page = new PIXI.Sprite( PIXI.Texture.fromImage('img/page.jpg') );
  page.width = WIDTH;
  page.height = HEIGHT;
  this.e.stage.addChild(page);

  // add stars
  for(var s = 0; s < 25; s++) {
    var x = this.e.renderer.width;
    var y = Math.random() * this.e.renderer.height;
    this.e.addStar();
  }

  // add player
  var params = {game: this.e, lives: 1};
  this.e.mech = new GAME.Mech(params);
  this.e.mech.active = false;
  this.e.stage.addChild(this.e.mech.view);

  // add score
  this.e.score = new GAME.ScoreBoard(0, this.e.mech.lives);
  this.e.stage.addChild(this.e.score.view);

  //top scores
  this.e.top_scores = new GAME.TopScores(this.e);
  console.log("top scores", this.e.top_scores.get());

  // add title
  this.e.title = new GAME.Title(this.e);

  //keyboard events
  this.e.inputs = [
    new GAME.Keyboard(this.e),
    new GAME.Touch(this.e)
  ];

  //fullscreen events
  var _this = this.e;
  window.onresize = function(e){
    _this.resize();
  };

  //not paused
  this.e.paused = false;
  this.e.animate();


};

GAME.game.prototype.animate = function() {
  if(!this.paused) {
    this.mech.update(this);
    TWEEN.update();

    // add bad guy
    //console.log(baddie_next, baddie_rate);
    if(this.baddie_next > this.baddie_rate && this.mech.active) {
      //addBaddy();
      this.createBaddyTweenedSquad();
      this.baddie_next = 0;
      if (this.baddie_rate >= this.baddie_rate_min) {
        this.baddie_rate = this.baddie_rate - this.baddie_rate_accel;
      }
      console.log(this.baddie_rate);
    } else {
      this.baddie_next++;
    }


    // test for hits and move baddies
    for(var baddy in this.baddies) {
      if(this.baddies.hasOwnProperty(baddy)) {
        if(this.baddies[baddy].active) {
          if(GAME.game.hitTest(this.mech, this.baddies[baddy])) {
            this.mech.hit(20);
            this.baddies[baddy].die();
          }

          if(this.baddies[baddy].right() < (this.baddies[baddy].w() * -1)) {
            this.baddies[baddy].die();
            this.baddies[baddy].removeFromStage();
          }
          for(var bullet = 0; bullet < this.bullets.length; bullet++) {
            var damage = this.bullets[bullet].damage;
            if(GAME.game.hitTest(this.bullets[bullet], this.baddies[baddy])) {
              //console.log("hit!!");
              this.baddies[baddy].hit(damage);
              this.baddies[baddy].recoil(this.bullets[bullet]);
              if(this.bullets[bullet].type !== 'super') {
                this.bullets[bullet].die();
              }
            }
            if(this.bullets[bullet].source != this.mech && GAME.game.hitTest(this.bullets[bullet], this.mech)) {
              this.bullets[bullet].die();
              this.mech.hit(damage);
              this.mech.recoil(this.bullets[bullet]);
            }
          }

        }
        if(this.baddies[baddy].remove) {
          //if this baddy is not active then remove it from stage
          this.baddies[baddy].removeFromStage();
          delete this.baddies[baddy];
        }
      }
    }
  } else {
    // THIS DOESNT WORK
    // https://github.com/tweenjs/tween.js/issues/15
    // TWEEN.stop();
  }//paused


  //draw
  this.renderer.render(this.stage);
  window.requestAnimationFrame( this.animate );
};

GAME.game.prototype.enableInput = function(input){
  for(var i = 0; i < this.inputs.length; i++){
    if(this.inputs[i] == input) {
      this.inputs[i].enable();
    } else {
      this.inputs[i].disable();
    }
  }
};

GAME.game.prototype.pause = function(){
  this.paused = this.paused ? false : true;
};

GAME.game.prototype.w = function(width) {
  if(typeof width !== 'undefined'){
    this.width = width;
  }
  return this.width;
};

GAME.game.prototype.h = function(height) {
  if(typeof height !== 'undefined'){
    this.height = height;
  }
  return this.height;
};

GAME.game.prototype.scaledWidth = function() {
  return this.renderer.view.style.width;
};

GAME.game.prototype.scaledHeight = function() {
  return this.renderer.view.style.height;
};

GAME.game.prototype.addStar = function() {
  var star = new GAME.Star(this.w(),(Math.random()*this.h()));
  this.stars.push(star);
  this.stage.addChild(star.view);
};

GAME.game.prototype.addBaddyTweened = function(params) {
  var baddy = new GAME.BaddyTweened(params);
  this.baddies.push(baddy);
  this.stage.addChild(baddy.view);
};

GAME.game.prototype.createBaddyTweenedSquad = function() {
  var w = this.w();
  var h = this.h();
  var path = {
    x: [w+45 , w * Math.random(), w * Math.random(), -75], //TODO fix hardcoded last tween poing
    y: [h * Math.random(), h * Math.random(), h * Math.random()],
    shoot: Math.floor(Math.random() * 50),
    interpolation: TWEEN.Interpolation.CatmullRom,
    time: 10500
  };

  for(var i = 0; i < 4; i++) {
    this.addBaddyTweened({
      x: path.x,
      y: path.y,
      delay: i * 1000,
      time: path.time,
      interpolation: path.interpolation,
      shoot: path.shoot,
      mech: this.mech,
      game: this
    });
  }
};

GAME.game.prototype.fire = function(bullet) {
  this.bullets.push(bullet);
  this.stage.addChild(bullet.view);
};

GAME.game.prototype.gameOver = function() {
  console.log("game over man! game over!!!");
  this.mech.tombStone();
  var rank = this.top_scores.check(this.mech.score);
  if(rank != -1 && rank < 3) {
    this.top_scores.showPlayerName();
  }
  this.title.show();

};

GAME.game.prototype.newGame = function() {

  //enable keyboard... bit of a hack, not really needed
  this.enableInput(this.inputs[0]);

  //TODO: use newGame() function for first game
  this.baddies = [];
  this.baddie_rate = 250;
  // add player
  var params = {game: this, lives: 1};
  this.mech.removeFromStage();
  this.mech = new GAME.Mech(params);
  this.stage.addChild(this.mech.view);

  this.score.updateLife(this.mech.lives);
  this.score.updateScore(0);


};

GAME.game.prototype.fullscreen = function() {
  var element = this.container;
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
  this.resize();
};

GAME.game.prototype.resize = function() {
  console.log("resize");
  // do we stretch to fullscreen ot keep aspect ratio?
  if(this.stretch) {
    WIDTH = this.width;
    HEIGHT = this.height;
    // let pixi choose WebGL or canvas
    var screen_width = window.innerWidth;//800;
    var screen_height = window.innerHeight;//600;
    if(screen_width > screen_height) {
      factor = screen_height / HEIGHT;
    } else {
      factor = screen_width / WIDTH;
    }
    //console.log(factor, calc_height, screen_height, calc_width, screen_width);

    this.renderer.view.style.display = "block";
    calc_height = HEIGHT * factor + "px";
    calc_width = WIDTH * factor + "px";
  } else {
    calc_height = window.innerHeight + "px";
    calc_width = "100%";
  }
  this.renderer.view.style.width = calc_width; //"100%";
  this.renderer.view.style.height = calc_height; //"100%";
};

GAME.game.prototype.toggleStretch = function(){
  if(this.stretch) {
    this.stretch = false;
  }
  else
  {
    this.stretch = true;
  }
  return this.stretch;
};

GAME.game.prototype.getAngle = function(x1,y1,x2,y2) {
  return Math.atan2(  (y1-y2) ,(x1-x2)) ;//* 180 / Math.PI;
};

/* A = the angle of the ship in radians
 * a = the distance from the top of the renderer
 */
GAME.game.getTargetPoint = function(A,a) {
  if(A === 0) {
    return false;
  }
  //if A is negative make it possitive
  A = A < 0 ? A * -1 : A;
  A = A*2;
  var C = 90; //TODO use radians not degrees
  A = A / (Math.PI/180); //convert radians to degree... because im dumb
  var B = 180 - A - C;

  var b = Math.sin( B * (Math.PI/180) ) * a / Math.sin( A * (Math.PI/180) );

  return {x:b,y:a};
};

GAME.game.hitTest = function(a, b) {
  if(a.active && b.active) {
    if(a.source != b && b.source != a){
      var hx = a.x() - b.x();
      var hy = a.y() - b.y();
      var dist = Math.sqrt(hx*hx+hy*hy);
      var width_a = ((a.size()).h)/2;
      var width_b = ((b.size()).h)/2;
      return dist <= width_a + width_b;
    }
  }
  return false;
};

GAME.game.checkBounds = function(x,y,h,w,sw,sh, mode) {

  if(mode == 'inside'){

    if(x - w/2 > 0 && x + w/2 < sw && y - h/2 > 0 && y + h/2 < sh){return true;}
    else {return false;}
  }
  else if(mode == 'outside'){

    if(x + w/2 > 0 && x - w/2 < sw && y + h/2 > 0 && y - h/2 < sh){return true;}
    else {return false;}
  }
  console.log("derp... checkbounds spacked out");
  return false;
};
//end game
