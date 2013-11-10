crypto = require('crypto')
fs = require('fs')

exports.file = (filename, cb) ->
  md5sum = crypto.createHash('md5')

  s = fs.ReadStream(filename)
  s.on 'data', (d) ->
    md5sum.update d

  s.on 'end', ->
    d = md5sum.digest 'hex'
    cb(null, d)

exports.array = (array) ->
  md5sum = crypto.createHash('md5')
  md5sum.update(entry, 'utf8') for entry in array
  md5sum.digest 'hex'
