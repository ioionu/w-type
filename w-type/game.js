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
  this.sprite_sheet = ['SpriteSheet.json', 'cloud.jpg'];
  this.audio = [
    {id: "hit", src:"audio/fx_kick.mp3"}, 
    {id: "fire", src: "audio/yFX3.mp3"}, 
    {id: 'die', src: 'audio/tom_01.mp3'} 
  ];

  this.stars = [];
  this.baddies = [];
  this.bullets = [];

  for(p in params) {
    this[p] = params[p];
  };

  /* make "this" available in this.update() when called from requestAnimFrame()
   * http://stackoverflow.com/questions/20177297/how-to-call-requestanimframe-on-an-object-method
   */
  this.animate = this.animate.bind(this);
  this.init();
}
GAME.game.constructor = GAME.game;

/**
 * intialise game by preloading assets
 **/
GAME.game.prototype.init = function() {
  this.loader = new PIXI.AssetLoader(this.sprite_sheet);
  this.loader.load();

  //TODO: replace e with bind like i do on animate
  this.loader.e = this;
  this.loader.onComplete = this.start; //TODO: less cool function name
  
  this.queue = new createjs.LoadQueue();
  this.queue.installPlugin(createjs.Sound);
  this.queue.addEventListener("complete", handleComplete);
  this.queue.loadManifest(this.audio);
  createjs.Sound.setMute(true); //TODO: fix sound

}

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
  baddie_next = fire_next = 0;

  this.e.mech = new GAME.Mech();
  this.e.stage.addChild(this.e.mech.view);

  for(var s = 0; s < 50; s++) {
    var x = this.e.renderer.width; 
    var y = Math.random() * this.e.renderer.height;
    this.e.addStar();
  }


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
  // shooth bullet
  fire_next++;
  if(k_shoot) {
    if(fire_next > FIRERATE){
      bullet = this.mech.bullet(this.w(), this.h());
      this.fire(bullet);
      fire_next = 0;
    }
  }


  // add bad guy
  //console.log(baddie_next, baddie_rate);
  if(baddie_next > baddie_rate) {
    //addBaddy();
    this.createBaddyTweenedSquad()
    baddie_next = 0;
  } else {
    baddie_next++;
  }
  

  // test for hits and move baddies
  for(var baddy = 0; baddy < baddies.length; baddy++) {
    if(baddies[baddy].active) {
      //baddies[baddy].update();
      if(hitTest(mech, baddies[baddy])) {
        //console.log("dead");
        //baddies.splice(baddy, 1);
        //かみかぜ
        mech.hit(20);
        baddies[baddy].hit(100);
      }

      if(baddies[baddy].right() < 0) {
        baddies[baddy].die();
      }
      for(var bullet = 0; bullet < bullets.length; bullet++) {
        damage = bullets[bullet].damage;
        if(hitTest(bullets[bullet], baddies[baddy])) {
          //console.log("hit!!");
          baddies[baddy].hit(damage);
          baddies[baddy].recoil(bullets[bullet]);
          bullets[bullet].die();
        } 
        if(bullets[bullet].source != mech && hitTest(bullets[bullet], mech)) {
          bullets[bullet].die();
          mech.hit(damage);
          mech.recoil(bullets[bullet]);
        }
      }

    }
  }


  //draw
  this.renderer.render(this.stage);
  requestAnimFrame( this.animate );
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
/*
GAME.game.prototype.fireBullet = function(screen_width, screen_height) {
  //createjs.Sound.play("peow");
  var x, y, a, A, b, distance;
  var p = {};
  if(fire_next > FIRERATE){
    //console.log("peow!");

    var A = this.mech.r();
    var a = (A < 0) ? this.mech.y() : params.height - this.mech.y();
    if(A != 0) {
      //console.log(A,a);
      p = getTargetPoint(A,a);
      b = p.x; //stash x as we use it to calculate the side c, and use that to calc speed 
      p.y = (A > 0) ? screen_height+30 : 0-30;
      p.x += this.mech.x();
      distance = Math.sqrt(a*a + b*b);
    } else {
      p = {};
      p.x = screen_width + 30; //TODO remove hardcode 30

      p.y = this.mech.y();
      distance = p.x - this.mech.x(); 
    }


    bullet = new GAME.GoodyBullet({
      'x1': mech.x(),
      'y1': mech.y(),
      'x2': p.x,
      'y2': p.y,
      'source': mech,
      'damage': 25,
      'distance':distance
    });
    this.bullets.push(bullet);
    this.stage.addChild(bullet.view);
    fire_next = 0;
    //var instance = createjs.Sound.play("fire");
  }
};
*/
GAME.game.prototype.addBaddyTweened = function(params) {
  var baddy = new GAME.BaddyTweened(params); 
  this.baddies.push(baddy); //TODO: move baddies and stage to GAME.baddies and GAME.stage
  this.stage.addChild(baddy.view);
};

GAME.game.prototype.createBaddyTweenedSquad = function() {
  w = this.w();
  h = this.h();
  path = {
    x: [w + 50, w * Math.random(), w * Math.random(), -10],
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
}

GAME.game.prototype.fire = function(bullet) {
  this.bullets.push(bullet);
  this.stage.addChild(bullet.view);
}
//end bullet
