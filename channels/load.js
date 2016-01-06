var fs = require('fs')
var path = require('path')

loadModulesInDirectory(__dirname)


function loadModulesInDirectory(directory, recurseLevel) {
  fs.readdirSync(directory)

  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'load.js')
  })

  .filter(function(file) {
    file = directory + '/' + file

    if (fs.statSync(file).isDirectory()) {
      if (recurseLevel > 1) return true

      loadModulesInDirectory(file, 2)
      return false
    }

    return true
  })

  .forEach(function(file) {
    try {

      file = directory + '/' + file
      module.exports[path.basename(file)] = require(file + '/index.js')
      console.log('Loaded ' + path.basename(file))
      
    } catch (err) {
      // Warn that could not open file.
      // console.log(err)
    }
  })
}