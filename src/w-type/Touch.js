export default class Touch {
  constructor(game) {
    this.game = game;
    this.move_id = 0;
    this.enabled = true;
    this.state = {
      targetx: 100, // TODO: get defult from current mech pos
      targety: 240,
      touch: false,
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
  }

  getState() {
    return this.state;
  }

  resetState() {
    this.state = {};
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  update() {
    let {mech} = this.game;
    mech.moveTowards(this.state.targetx, this.state.targety, mech.speed);

    if (this.state.shoot) {
      if (mech.fire_next > this.game.firerate) {
        let bullet = mech.bullet(mech.w(), mech.h());
        if (mech.charge > mech.charged) {
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
  }

  touchStart(e) {
    if (!this.enabled) {
      this.game.enableInput(this);
    }
    this.state.touch = true;
    let id;
    for (let i = 0; i < e.touches.length; i++) {
      id = e.touches[i].identifier;
      this.current_touches[id] = e.timeStamp;
    }
  }

  touchCancel(e) {
    console.log('cancel', e, _this, this);
    this.enabled = false;
  }

  touchEnd(e) {
    // console.log('end', e, this);
    // this.touch.enabled = false;
    let id;
    var duration;
    for (let i = 0; i < e.changedTouches.length; i++) {
      id = e.changedTouches[i].identifier;
      duration = e.timeStamp - this.current_touches[id];

      if (duration < 200) {
        // console.log("touch length", id, this.current_touches[id], e.timeStamp);
        this.state.shoot = true;
      }
    }

    // clear touch controls so not to interfear with keyboard
    this.state.touch = false;
  }

  touchMove(e) {
    let offset_left = this.game.app.view.offsetLeft;
    let offset_top = this.game.app.view.offsetTop;
    let ratio = this.game.height / parseInt(this.game.app.view.style.height);
    let x = (e.touches.item(this.move_id).clientX - offset_left) * ratio;
    let y = (e.touches.item(this.move_id).clientY - offset_top) * ratio;
    this.state.targetx = x;
    this.state.targety = y;
    this.state.touch = true;
    // console.log('moveto:', x, y, ratio);
    // _this.mech.moveTowards(x, y, _this.mech.speed);
  }


  clearShoot() {
    this.state.shoot = false;
  }
}
