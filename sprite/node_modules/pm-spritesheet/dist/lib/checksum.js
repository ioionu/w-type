var crypto, fs;

crypto = require('crypto');

fs = require('fs');

exports.file = function(filename, cb) {
  var md5sum, s;
  md5sum = crypto.createHash('md5');
  s = fs.ReadStream(filename);
  s.on('data', function(d) {
    return md5sum.update(d);
  });
  return s.on('end', function() {
    var d;
    d = md5sum.digest('hex');
    return cb(null, d);
  });
};

exports.array = function(array) {
  var entry, md5sum, _i, _len;
  md5sum = crypto.createHash('md5');
  for (_i = 0, _len = array.length; _i < _len; _i++) {
    entry = array[_i];
    md5sum.update(entry, 'utf8');
  }
  return md5sum.digest('hex');
};


/*
//@ sourceMappingURL=checksum.map
*/