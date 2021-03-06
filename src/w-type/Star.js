import * as PIXI from 'pixi.js';
import TWEEN from '@tweenjs/tween.js';
import GameElement from './GameElement';

/**
 * @class Star
 * @constructor
 * {'x': this.x()-50, 'y': this.y()};
 * */
export default class Star extends GameElement {
  constructor(x, y) {
    super();
    this.view = new PIXI.Graphics();
    this.view.beginFill(0xFFFFFF);
    // set a fill and line style
    this.view.beginFill(0xFFFFFF);
    this.view.lineStyle(1, 0xFFFFFF, 1);
    //this.view.lineStyle(2, 0x0000FF, 1);
    this.view.drawRect(0,0,1,1);
    //this.view.anchor.x = this.view.anchor.y = 0.5;
    this.view.endFill();
    /*
    var star_id = Math.floor( Math.random() * 3 ) + 1;
    var star_name = 'star0' + star_id + '.png';
    console.log(star_name);

    this.view = new PIXI.Sprite( PIXI.Texture.fromImage(star_name) );
    this.view.width = 10;
    this.view.height = 11;
    this.view.rotation = Math.random() * 360;
  */
    this.view.position.x = x;
    this.view.position.y = y;


    const coords = {x: 805};
    const star = this;
    this.tween = new TWEEN.Tween(coords)
      .to({x:-2}, Math.random() * 9000 + 1000)
      .delay(Math.random() * 10000)
      .repeat(Infinity)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        //console.log(this.x, this.star.view.position.y, this.star.x());
        star.x(coords.x);
      })
      .start();

  }
}