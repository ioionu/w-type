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
  return Fs.exists(filename, function(exists) {
    var commands, image, _i, _len;
    if (exists) {
      Fs.unlinkSync(filename);
    }
    commands = emptySprite(sheetWidth, sheetHeight);
    for (_i = 0, _len = images.length; _i < _len; _i++) {
      image = images[_i];
      addImageData(commands, image);
    }
    commands.push("PNG32:" + filename);
    return Im.convert(commands, cb);
  });
};

exports.texturePackerJson = function(blocks, sheetWidth, sheetHeight, filename, root, cb) {
  var block, fname, h, result, w, _i, _len;
  result = {
    frames: {},
    meta: {
      app: "http://www.texturepacker.com",
      version: "1.0",
      image: filename,
      format: "RGBA8888",
      size: {
        w: sheetWidth,
        h: sheetHeight
      },
      scale: 1
    }
  };
  for (_i = 0, _len = blocks.length; _i < _len; _i++) {
    block = blocks[_i];
    w = block.w;
    h = block.h;
    fname = block.filename;
    if (root && fname.indexOf(root) === 0) {
      fname = fname.slice(root.length + 1);
    }
    result.frames[fname] = {
      frame: {
        x: block.fit.x,
        y: block.fit.y,
        w: w,
        h: h
      },
      rotated: false,
      trimmed: false,
      spriteSourceSize: {
        x: 0,
        y: 0,
        w: w,
        h: h
      },
      sourceSize: {
        w: w,
        h: h
      }
    };
  }
  return process.nextTick(function() {
    return cb(null, result);
  });
};


/*
//@ sourceMappingURL=sheet.map
*/