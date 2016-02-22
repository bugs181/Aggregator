var channelModules = [ // const channelModules ?

  /* Aggregator channels */
  "television/aggregators/primewire.ag",

  /* Media file channels */
  "television/providers/vidbull.com",

  /* RSS channels */
  "RSS/hackaday.io",
  "RSS/changelog"
]

var cursor

function loadChannels() {
  var channels = []

  for (channelModule of channelModules) {
    try {

      var channel = require("../channels/" + channelModule)
      channels.push(channel)
      cursor.hex('#e522c9').write("Loaded " + channelModule + "\r\n")

    } catch (err) {

      cursor
      .hex('#D35003').write("Warning: Could not load module: " + channelModule + "\r\n")
      .hex('#FF0000').write(err + "\r\n") // #FFA500 #FF8C00

    }
  }

  cursor.reset()
  return channels
}

module.exports = function(app, config) {
  cursor = app.cursor

  var channels = loadChannels()
  Object.freeze(channels) // Don't allow channels to be modified from this point forward.

  return channels
}