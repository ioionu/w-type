import * as PIXI from 'pixi.js';

class LifeBar {
  constructor(param) {

    this.width = 20;
    this.x = this.width * -1;
    this.y = -20;
    this.life = param.life;
    this.life_full = param.life_full;


    this.view = new PIXI.Graphics();
    //this.draw();
  }

  update(life) {
    this.life = life;
    this.draw();
  };

  draw() {
    this.view.clear();
    this.view.lineStyle( 0, 0xFFFFFF, 1);
    this.view.beginFill(0xFFFFFF);
    this.view.drawRect(this.x,this.y,this.width,3);
    this.view.lineStyle( 0, 0xCCCCCC, 1);
    this.view.beginFill(0x333333);
    this.view.drawRect(this.x+1,this.y+1,this.life/this.life_full*this.width,1);
    //this.view.drawRect(this.x+1,this.y,this.width,3);
    this.interpolation = TWEEN.Interpolation.Bezier;
    this.tween = new TWEEN.Tween({
      a:this.view.alpha,
      view:this.view
    })
      .to({a: [1, 0]}, 1500)
      .delay(0)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate( function(){
        this.view.alpha = this.a;
      })
      .start();

  }
}

export default LifeBar;