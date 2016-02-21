var website = 'http://changelog.com/';

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
}

function discoverMediaObjects(params, callback) {
  console.log(params)

  if (!params.mediaObjectType)
    return discoverMediaObjectsOnIndex(params, callback)
}

function discoverMediaObjectsOnIndex(params, callback) {
  console.log("Load page: " + website)
  http.loadPage(website, function(body) {
    mediaParser.parseIndex(body, callback)
  })
}

function searchMediaObjects(params, callback) {
}

function getMediaObjectInfo(params, callback) {
  // Now when we request more/extended information about a particular media object, 
  // we will also add it to our database.
}