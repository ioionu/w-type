exports.project = (pm) ->
  {f, $} = pm

  dist:
    files: 'src/**/*.{coffee,js}'
    dev: [
      f.coffee bare:true, sourceMap: true
      f.tap (asset) -> asset.dirname = asset.dirname.replace('src', 'dist')
      f.writeFile
    ]

