spritesheet = require('..')

exports.project = (pm) ->
  {$} = pm
  f = pm.filters(spritesheet)

  spritesheet:
    desc: "Builds spritesheet from all icons"
    files: 'img/*.png'
    dev: [
      f.spritesheet filename: 'spritesheet.png', root: 'img', jsonStyle: 'texturePacker'
    ]

