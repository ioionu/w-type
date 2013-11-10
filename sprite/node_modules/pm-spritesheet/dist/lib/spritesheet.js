var Async, Checksum, Fs, Im, Path, Sheet, Util, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Async = require("async");

Fs = require("fs");

Util = require("util");

_ = require('lodash');

Im = require('imagemagick');

Checksum = require('./checksum');

Sheet = require('./sheet');

Path = require('path');

module.exports = function(Projmate) {
  var FileAsset, PmUtils, Spritesheet, TaskProcessor, _ref;
  FileAsset = Projmate.FileAsset, TaskProcessor = Projmate.TaskProcessor, PmUtils = Projmate.Utils;
  return Spritesheet = (function(_super) {
    __extends(Spritesheet, _super);

    function Spritesheet() {
      _ref = Spritesheet.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Spritesheet.schema = {
      title: 'Creates a spritesheet from images',
      type: 'object',
      properties: {
        root: {
          type: 'string',
          description: 'path to strip from filenames'
        },
        width: {
          type: 'number',
          description: 'width of output image'
        },
        height: {
          type: 'number',
          description: 'height of output image'
        },
        outdir: {
          type: 'string',
          description: 'Output directory'
        }
      },
      __: {
        extnames: "*",
        useLoader: 'stat',
        defaults: {
          dev: {
            quiet: true
          }
        },
        examples: [
          {
            title: 'Create documentation from dist folder',
            text: "docs: {\n  files: 'src/docs',\n  dev: [\n    f.yuidoc({outdir: 'dist/docs'})\n  ]\n}"
          }
        ]
      }
    };

    Spritesheet.prototype.process = function(task, options, cb) {
      var Packer, assets, limit, pack, packer, readAsset, readAssetImageMeta, readImageMeta;
      limit = options.iteratorLimit || 5;
      if (options.width) {
        Packer = require('./packer');
        packer = new Packer(options.width, options.height);
      } else {
        Packer = require('./packer.growing');
        packer = new Packer();
      }
      assets = task.assets;
      assets = assets.array();
      readImageMeta = function(filename, cb) {
        return Checksum.file(filename, function(err, md5) {
          if (err) {
            return cb(err);
          }
          return Im.identify(filename, function(err, img) {
            if (err) {
              return cb(err);
            }
            return cb(null, {
              md5: md5,
              width: img.width,
              height: img.height
            });
          });
        });
      };
      readAsset = function(asset, cb) {
        return readImageMeta(asset.filename, function(err, img) {
          if (err) {
            return cb(err);
          }
          asset._image = img;
          return cb();
        });
      };
      readAssetImageMeta = function(cb) {
        return Async.eachSeries(assets, readAsset, cb);
      };
      pack = function(cb) {
        var block, blocks, bottom, dirname, height, right, width, _i, _len;
        blocks = _(assets).map(function(asset) {
          return {
            filename: asset.filename,
            w: asset._image.width,
            h: asset._image.height
          };
        }).sortBy(function(img) {
          return -Math.max(img.w, img.h);
        }).value();
        packer.fit(blocks);
        width = 0;
        height = 0;
        for (_i = 0, _len = blocks.length; _i < _len; _i++) {
          block = blocks[_i];
          right = block.fit.x + block.w;
          bottom = block.fit.y + block.h;
          if (right > width) {
            width = right;
          }
          if (bottom > height) {
            height = bottom;
          }
        }
        dirname = Path.dirname(Path.resolve(options.filename));
        PmUtils.$.mkdir('-p', dirname);
        return Sheet.toSpritesheet(blocks, width, height, options.filename, function(err) {
          if (err) {
            return cb(err);
          }
          return Sheet.texturePackerJson(blocks, width, height, Path.basename(options.filename), options.root, function(err, obj) {
            if (err) {
              return cb(err);
            }
            return Fs.writeFile(PmUtils.changeExtname(options.filename, '.json'), JSON.stringify(obj, null, '  '), cb);
          });
        });
      };
      return Async.series([readAssetImageMeta, pack], cb);
    };

    return Spritesheet;

  })(TaskProcessor);
};


/*
//@ sourceMappingURL=spritesheet.map
*/