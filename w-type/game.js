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
  this.sprite_sheet = ['SpriteSheet.json', 'page.jpg'];
  this.audio = [
    {id: "hit", src:"audio/fx_kick.mp3"},
    {id: "fire", src: "audio/yFX3.mp3"},
    {id: 'die', src: 'audio/tom_01.mp3'}
  ];

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
  this.init();
};
GAME.game.constructor = GAME.game;

/**
 * intialise game by preloading assets
 **/
GAME.game.prototype.init = function() {
  this.loader = new PIXI.loaders.Loader();
  this.loader.add(this.sprite_sheet);
  this.loader.e = this;
  _this = this;
  this.loader.once('complete', this.start);
  this.loader.load();

  //TODO: replace e with bind like i do on animate
  //this.loader.e = this;
  //this.loader.onComplete = this.start; //TODO: less cool function name

  //this.queue = new createjs.LoadQueue();
  //this.queue.installPlugin(createjs.Sound);
  //this.queue.addEventListener("complete", handleComplete);
  //createjs.Sound.setMute(true); //TODO: fix sound

};

/**
 * when assets are loaded prepare stage
 * @param {GAME.game} game object
 **/
GAME.game.prototype.start = function(e) {
  this.e.stage = new PIXI.Stage(0x000000);

  WIDTH = 800;
  HEIGHT = 640;
  // let pixi choose WebGL or canvas
  this.e.renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);
  // set the canvas width and height to fill the screen
  var screen_width = $(window).width();//800;
  var screen_height = $(window).height();//600;
  if(screen_width > screen_height) {
    factor = screen_height / HEIGHT;
  } else {
    factor = screen_width / WIDTH;
  }
  calc_height = HEIGHT * factor;
  calc_width = WIDTH * factor;
  //console.log(factor, calc_height, screen_height, calc_width, screen_width);

  this.e.renderer.view.style.display = "block";
  this.e.renderer.view.style.width = calc_width + "px"; //"100%";
  this.e.renderer.view.style.height = calc_height + "px"; //"100%";
  this.e.renderer.view.id = "fuckhead";

  // attach render to page
  document.body.appendChild(this.e.renderer.view);
  this.e.baddie_next = 0;

  // background image
  var page = new PIXI.Sprite( PIXI.Texture.fromImage('page.jpg') );
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

  Hammer(document.getElementById(this.e.renderer.view.id)).on("swipeleft", function() {
      k_left = true;
      k_right = k_up = k_down = false;
      //alert('you swiped left!');
  });
  Hammer(document.getElementById(this.e.renderer.view.id)).on("swiperight", function() {
      k_right = true;
      k_left = k_up = k_down = false;
      //alert('you swiped left!');
  });
  Hammer(document.getElementById(this.e.renderer.view.id)).on("swipeup", function() {
      k_up = true;
      k_right = k_left = k_down = false;
      //alert('you swiped left!');
  });
  Hammer(document.getElementById(this.e.renderer.view.id)).on("swipedown", function() {
      k_down = true;
      k_right = k_left = k_up = false;
      //alert('you swiped left!');
  });
  Hammer(document.getElementById(this.e.renderer.view.id)).on("swipedown", function() {
      k_down = true;
      k_right = k_left = k_up = false;
      //alert('you swiped left!');
  });
  Hammer(document.getElementById(this.e.renderer.view.id)).on("tap", function(event) {
      /*game.fire(
        game.mech.bullet(this)
      );
      */
     1+1;
      //k_shoot = true;
      //k_right = k_left = k_up = false;
      //alert('you swiped left!');
  });

  //requestAnimFrame( this.e.animate );
  this.e.animate();
}

GAME.game.prototype.animate = function() {
  this.mech.update(this);
  TWEEN.update();

  // add bad guy
  //console.log(baddie_next, baddie_rate);
  if(this.baddie_next > this.baddie_rate && this.mech.active) {
    //addBaddy();
    this.createBaddyTweenedSquad()
    this.baddie_next = 0;
    if (this.baddie_rate >= this.baddie_rate_min) {
      this.baddie_rate = this.baddie_rate - this.baddie_rate_accel;
    }
    console.log(this.baddie_rate);
  } else {
    this.baddie_next++;
  }


  // test for hits and move baddies
  for(var baddy = 0; baddy < this.baddies.length; baddy++) {
    if(this.baddies[baddy].active) {
      //baddies[baddy].update();
      if(hitTest(this.mech, this.baddies[baddy])) {
        //console.log("dead");
        //baddies.splice(baddy, 1);
        //かみかぜ
        this.mech.hit(20);
        this.baddies[baddy].die();
	//this.stage.removeChild(baddies[baddy].view);
      }

      if(this.baddies[baddy].right() < (this.baddies[baddy].w() * -1)) {
        this.baddies[baddy].die();
        this.baddies[baddy].removeFromStage();
      }
      for(var bullet = 0; bullet < this.bullets.length; bullet++) {
        damage = this.bullets[bullet].damage;
        if(hitTest(this.bullets[bullet], this.baddies[baddy])) {
          //console.log("hit!!");
          this.baddies[baddy].hit(damage);
          this.baddies[baddy].recoil(this.bullets[bullet]);
          this.bullets[bullet].die();
        }
        if(this.bullets[bullet].source != this.mech && hitTest(this.bullets[bullet], this.mech)) {
          this.bullets[bullet].die();
          this.mech.hit(damage);
          this.mech.recoil(this.bullets[bullet]);
        }
      }

    }
    if(this.baddies[baddy].remove) {
      //if this baddy is not active then remove it from stage
      this.baddies[baddy].removeFromStage();
    }
  }


  //draw
  this.renderer.render(this.stage);
  window.requestAnimationFrame( this.animate );
}
GAME.game.prototype.w = function(width) {
  if(typeof width !== 'undefined'){
    this.width = width;
  }
  return this.width
}

GAME.game.prototype.h = function(height) {
  if(typeof height !== 'undefined'){
    this.height = height;
  }
  return this.height
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
  w = this.w();
  h = this.h();
  path = {
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

}

GAME.game.prototype.newGame = function() {
  //TODO: use newGame() function for first game
  this.baddies = [];
  // add player
  var params = {game: this, lives: 1};
  this.mech.removeFromStage();
  this.mech = new GAME.Mech(params);
  this.stage.addChild(this.mech.view);
}

//end game
