exports.project = function(pm) {
  var f = pm.filters(require('pm-spritesheet'));

  return {
    spritesheet: {
      files: 'assets/sprite/*.png',
      dev: [
        f.spritesheet({filename: 'img/SpriteSheet.png', root: 'img', jsonStyle:'texturePacker'})
      ]
    }
  };
};
