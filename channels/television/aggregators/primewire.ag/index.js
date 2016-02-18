var website = 'http://www.primewire.ag/';

// Helper modules
var http = require("./helpers/http")
var mediaParser = require("./mediaParser")


module.exports = {
	name: "PrimeWire",
	type: "television",
	website: website,

	channelType: "aggregator",
	
	browse: browseRequest,
	search: search,
	mediaInfo: mediaInfo
}


function browseRequest(req, res) {
	var mediaType = req.params.mediaType

	if (mediaType == "movies") {
		browseMovies(req, res)
	} else if (mediaType == "shows") {
		browseShows(req, res)
	} else if (mediaType == "music") {
		browseMusic(req, res)
	} else {
		res.status(404).json({ success: false, error: "No such media type." })
	}
}

function browseMovies(req, res) {
	var pagination = req.params.page
	if (!pagination)  pagination = 1 // Default to page 1.

	res.send("browsing primewire.ag")
}

function browseShows(req, res) {
	//var pagination = req.query.page
	//if (!pagination)  pagination = 1 // Default to page 1.

	var pagination = req.query.page || 1
	var mediaURL = website + "?tv=&page=" + pagination
	
	console.log("Load page: " + mediaURL)
	http.loadPage(mediaURL, function(body) {
		mediaParser.parseIndex(body, req, res)
	})
}

function browseMusic(req, res) {
	res.send("browsing primewire.ag music")
	// http://www.primewire.ag/?music
	// http://www.primewire.ag/song-2721849-Cardiff-online-free
}


function mediaInfo(req, res) {
	// Example use: http://localhost:8020/primewire.ag/info/watch-2738400-Danis-Castle-online-free
	
	var sourceURL = req.params.sourceURL
	var mediaURL = website + sourceURL
	console.log("Load page: " + mediaURL)

	http.loadPage(mediaURL, function(body) {
		mediaParser.parseInfoPage(body, req, res)
	})	
}

function search(req, res) {
	var searchTerm = req.query.term

	if (!searchTerm) {
		res.status(404).send({ err: true, reason: "No search term provided." })
		return
	}

	var mediaURL = website + "index.php?search_keywords=" + searchTerm
	http.loadPage(mediaURL, function(body) {
		mediaParser.parseIndex(body, req, res)
	})	
}