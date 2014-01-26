Fs = require "fs"
Im = require "imagemagick"

emptySprite = (width, height) ->
  ["-size", "#{width}x#{height}", "xc:none"]

addImageData = (commands, image) ->
  {x, y} = image.fit
  commands.push image.filename, "-geometry", "+#{x}+#{y}", "-composite"



# block =
# { filename: 'img/ico_plus_nuetral.png',
#   w: 168,
#   h: 168,
#   fit:
#    { x: 0,
#      y: 0,
#      w: 700,
#      h: 700,
#      used: true,
#      down:
#       { x: 0,
#         y: 168,
#         w: 700,
#         h: 532,
#         used: true,
#         down: [Object],
#         right: [Object] },
#      right:
#       { x: 168,
#         y: 0,
#         w: 532,
#         h: 168,
#         used: true,
#         down: [Object],
#         right: [Object] } } }


exports.toSpritesheet = (images, sheetWidth, sheetHeight, filename, cb) ->
  Fs.exists filename, (exists) ->
    if exists
      Fs.unlinkSync filename

    commands = emptySprite(sheetWidth, sheetHeight)
    addImageData(commands, image) for image in images
    commands.push "PNG32:#{filename}"
    Im.convert commands, cb


exports.texturePackerJson = (blocks, sheetWidth, sheetHeight, filename, root, cb) ->
  result =
    frames: {}
    meta:
      app: "http://www.texturepacker.com"
      version: "1.0"
      image: filename
      format: "RGBA8888"
      size: {w: sheetWidth, h: sheetHeight}
      scale: 1

  for block in blocks
    w = block.w
    h = block.h

    fname = block.filename
    if root && fname.indexOf(root) is 0
      fname = fname.slice(root.length + 1)

    result.frames[fname] =
      frame: {x: block.fit.x, y: block.fit.y, w, h}
      rotated: false
      trimmed: false
      spriteSourceSize: {x: 0, y: 0, w, h}
      sourceSize: {w, h}

  process.nextTick ->
    cb null, result

#       # @_toJson()
#       # @_cleanup()
#       # cb err

#   _cleanup: (cb = ->) ->
#     self = @
#     fs.readdir "#{@path}", (err, files) ->
#       for file in files
#         if file.match("^#{self.name}-.*\.png$") and file isnt self.filename()
#           fs.unlinkSync "#{self.path}/#{file}"
#       cb()

#   _toJson: ->
#     info =
#       name: @name
#       checksum: @checksum()
#       shortsum: @shortsum()
#       images: []

#     for image in @images
#       imageInfo =
#         name: image.name
#         filename: image.filename
#         checksum: image.checksum
#         width: image.width
#         height: image.height
#         positionX: image.positionX
#         positionY: image.positionY
#       info.images.push imageInfo

#     info = JSON.stringify(info, null, '  ')
#     fs.writeFileSync @jsonUrl(), info

#   _fromJson: ->
#     @images = []

#     try
#       info = fs.readFileSync @jsonUrl(), "UTF-8"
#     catch error
#       console.log @jsonUrl() + " not found"
#       return # no json file

#     info = JSON.parse info
#     for img in info.images
#       image = new Image(img.filename, "#{@path}/#{@name}")
#       image.width = img.width
#       image.height = img.height
#       image.checksum = img.checksum
#       image.positionX = img.positionX
#       image.positionY = img.positionY
#       @images.push image

