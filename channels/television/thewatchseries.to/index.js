// NOTE: This provider only has tv shows.
var website = 'http://thewatchseries.to/';

// Helper modules
var http = require("./helpers/http")
var mediaParser = require("./mediaParser")


module.exports = {
	name: "TheWatchSeries",
	website: website,
	
	browse: browseRequest,
	search: search,
	mediaInfo: mediaInfo
}


function browseRequest(req, res) {
	var mediaType = req.params.mediaType

	if (mediaType == "shows") {
		browseShows(req, res)
	} else {
		res.status(404).json({ success: false, error: "No such media type." })
	}
}

function browseShows(req, res) {
	var pagination = req.query.page || 1
	var mediaURL = website + "series/" + pagination
	
	console.log("Load page: " + mediaURL)
	http.loadPage(mediaURL, function(body) {
		mediaParser.parseIndex(body, req, res)
	})
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

	// todo: urlencode searchTerm
	var mediaURL = website + "search/" + searchTerm
	http.loadPage(mediaURL, function(body) {
		mediaParser.parseIndex(body, req, res)
	})	
}