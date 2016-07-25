'use strict'

let website = 'http://www.primewire.ag/'

module.exports = {
	name: 'PrimeWire.ag',
	type: 'television',
	website: website,

	aggregator: true,
	
  discoverChannelSections: discoverChannelSections,
  discoverMediaObjects: discoverMediaObjects,
  getMediaObjectInfo: getMediaObjectInfo,
  searchMediaObjects: searchMediaObjects,
}


// Helper modules
let http = require('./helpers/http')
let mediaParser = require('./mediaParser')


function discoverChannelSections(params, callback) {

}

function discoverMediaObjects(params, callback) {
	let mediaObjectType = params.mediaObjectType || 'default'
	let query = params.query
	let pagination = query.page || 1 // Default to page 1.

	let mediaURL

	switch (mediaObjectType.toLowerCase()) {
	case 'movies':
		mediaURL = `${website}?page=${pagination}`
		break

	case 'shows':
		mediaURL = `${website}?tv=&page=${pagination}`
		break

	case 'music':
		mediaURL = `${website}?music=&page=${pagination}`
		break

	default:
		mediaURL = `${website}?page=${pagination}`
		break
	}

	console.log(`Load ${mediaObjectType} page: ${mediaURL}`)
	http.loadPage(mediaURL, function(body) {
		mediaParser.parseIndex(body, params, callback)
	})
}

function getMediaObjectInfo(params, callback) {
	/*
	http.loadPage(mediaURL, function(body) {
		mediaParser.parseInfoPage(body, req, res)
	})*/
}

function searchMediaObjects(params, callback) {
	let query = params.query
	let searchTerm = query.term

	if (!searchTerm)
		return callback("No search term provided")

	var mediaURL = website + "index.php?search_keywords=" + searchTerm
	http.loadPage(mediaURL, function(body) {
		mediaParser.parseIndex(body, params, callback)
	})
}