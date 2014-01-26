var Fs, Im, addImageData, emptySprite;

Fs = require("fs");

Im = require("imagemagick");

emptySprite = function(width, height) {
  return ["-size", "" + width + "x" + height, "xc:none"];
};

addImageData = function(commands, image) {
  var x, y, _ref;
  _ref = image.fit, x = _ref.x, y = _ref.y;
  return commands.push(image.filename, "-geometry", "+" + x + "+" + y, "-composite");
};

exports.toSpritesheet = function(images, sheetWidth, sheetHeight, filename, cb) {
  return fs.exists(filename, function(exists) {
    var commands, image, _i, _len;
    if (exists) {
      return cb('Output file exists: ' + filename);
    }
    commands = emptySprite(sheetWidth, sheetHeight);
    for (_i = 0, _len = images.length; _i < _len; _i++) {
      image = images[_i];
      addImageData(commands, image);
    }
    commands.push(filename);
    return im.convert(commands, cb);
  });
};


/*
//@ sourceMappingURL=sprite.map
*/