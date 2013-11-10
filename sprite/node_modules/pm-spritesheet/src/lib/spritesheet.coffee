# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

Async = require("async")
Fs = require("fs")
Util = require("util")
_ = require('lodash')

Im = require('imagemagick')
Checksum = require('./checksum')
Sheet = require('./sheet')
Path = require('path')


module.exports = (Projmate) ->
  {FileAsset, TaskProcessor, Utils:PmUtils} = Projmate

  # Loads files based on a task's `files` property.
  #
  # This is usually invoked as the first filter of a pipeline.
  #
  class Spritesheet extends TaskProcessor

    @schema:
      title: 'Creates a spritesheet from images'
      type: 'object'
      properties:
        root:
          type: 'string'
          description: 'path to strip from filenames'

        width:
          type: 'number'
          description: 'width of output image'
        height:
          type: 'number'
          description: 'height of output image'

        outdir:
          type: 'string'
          description: 'Output directory'
      __:
        extnames: "*"
        useLoader: 'stat'
        defaults:
          dev:
            quiet: true
        examples: [
          title: 'Create documentation from dist folder'
          text:
            """
            docs: {
              files: 'src/docs',
              dev: [
                f.yuidoc({outdir: 'dist/docs'})
              ]
            }
            """
        ]

    ##
    # Directly manipulates a task such as its assets property.
    #
    process: (task, options, cb) ->
      limit = options.iteratorLimit || 5

      if options.width
        Packer = require('./packer')
        packer = new Packer(options.width, options.height)
      else
        Packer = require('./packer.growing')
        packer = new Packer()

      {assets} = task
      assets = assets.array()

      readImageMeta = (filename, cb) ->
        Checksum.file filename, (err, md5) ->
          return cb(err) if err

          Im.identify filename, (err, img) ->
            return cb(err) if err
            cb null, {md5, width: img.width, height: img.height}


      readAsset = (asset, cb) ->
        readImageMeta asset.filename, (err, img) ->
          return cb(err) if err
          asset._image = img
          cb()


      readAssetImageMeta = (cb) ->
        Async.eachSeries assets, readAsset, cb


      pack = (cb) ->
        blocks = _(assets)
          .map((asset) ->
            {filename: asset.filename, w: asset._image.width, h: asset._image.height}
          )
          .sortBy((img) -> -Math.max(img.w, img.h))
          .value()
        packer.fit blocks

        width =  0
        height = 0
        for block in blocks
          right = block.fit.x + block.w
          bottom = block.fit.y + block.h
          width = right if right > width
          height = bottom if bottom > height

        dirname = Path.dirname(Path.resolve(options.filename))
        PmUtils.$.mkdir '-p', dirname

        Sheet.toSpritesheet blocks, width, height, options.filename, (err) ->
          return cb(err) if err
          Sheet.texturePackerJson blocks, width, height, Path.basename(options.filename), options.root, (err, obj) ->
            return cb(err) if err

            Fs.writeFile PmUtils.changeExtname(options.filename, '.json'), JSON.stringify(obj, null, '  '), cb

      Async.series [readAssetImageMeta, pack], cb
