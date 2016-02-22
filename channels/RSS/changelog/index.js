var website = 'http://changelog.com/'

module.exports = {
  name: "changelog",
  type: "RSS",
  website: website,

  channelType: "aggregator",

  discoverChannel: discoverChannel,
  discoverMediaObjects: discoverMediaObjects,
  searchMediaObjects: searchMediaObjects,
  getMediaObjectInfo: getMediaObjectInfo
}


// Helper modules
var http = require("./helpers/http")
var mediaParser = require("./mediaParser")


// http://media.object/discover/changelog/tag/javascript

function discoverChannel(params, callback) {
  var pageDiscoveries = {}

  http.loadPage(website, function(body) {
    var channelObjectType = params.channelObjectType

    if (!channelObjectType)
      channelObjectType = "default"

    switch (channelObjectType.toLowerCase()) {
    case "tags":
      pageDiscoveries = mediaParser.parseTags(body)
      break

    case "menu":
      pageDiscoveries = mediaParser.parseMenu(body)
      break

    default:
      pageDiscoveries.tags = mediaParser.parseTags(body)
      pageDiscoveries.menu = mediaParser.parseMenu(body)
      break
    }

    callback(null, pageDiscoveries)
  })
}

function discoverMediaObjects(params, callback) {
  if (!params.mediaObjectType)
    return discoverMediaObjectsOnIndex(params, callback)
}

function discoverMediaObjectsOnIndex(params, callback) {
  http.loadPage(website, function(body) {
    var mediaObjects = mediaParser.parsePage(body)
    callback(null, mediaObjects)
  })
}

function searchMediaObjects(params, callback) {
}

function getMediaObjectInfo(mediaObjectUrl, callback) {
  http.loadPage(mediaObjectUrl, function(body) {
    var mediaObjects = mediaParser.parsePage(body)
    if (!mediaObjects || mediaObjects.length <= 0)
      callback("Could not read media object")
    else
      callback(null, mediaObjects[0])
  })
}