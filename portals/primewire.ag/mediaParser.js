
// Modules
var cheerio = require("cheerio");

// Variables
var portal = "Primewire.ag"


module.exports = {

	parseIndex: parseIndex,
	parseInfoPage: parseInfoPage

}

// Overview:
// parseIndex() + parseMediaObjectHTML() - Parses media objects from the directory/index type pages.
// parseEpisodeList() + parseMediaListHTML() - Parses episode list for TV Shows into URLs
// parseInfoPage() + parseMediaInfoHTML() - Parses media information like synopsis, imdb, sources, etc.

// todo: navigationMenu()
// todo: navigateIndex()


// Media object parsing methods.
function parseIndex(body, req, res) {
	$ = cheerio.load(body);
	
	var mediaObjects = []

	var mediaObjectHTML = $("div.index_container").find("div.index_item")
			.each(function(i, elem) {

				if (elem) {
					
					// Set up a new media object
					var mediaObject = new mediaObjectShowClass();
					mediaObject.type = parseMediaType(req.params.mediaType)
					mediaObject.portal = portal // Kind of important. ;)

					// Meda object in, media object out. xD
					mediaObject = parseMediaObjectHTML(elem, mediaObject)
					mediaObjects.push(mediaObject);
				}

			})

	res.json(mediaObjects)
}

function parseMediaObjectHTML(mediaObjectHTML, mediaObject) {
	// This function returns a mediaObject formatted JSON object.

	var html = $(mediaObjectHTML)

	var alink = html.find("a")
	var img = alink.find("img")
	
	// Get the title, remove the 'Watch ' from 'Watch $showName'
	mediaObject.title = img.attr("alt")
	//if (mediaObject.type == "show")  mediaObject.title = mediaObject.title.replace("Watch ", '')
	// why looking for type?? replace 'Watch' anyway.. becuase it will always be the first..
	mediaObject.title = mediaObject.title.replace("Watch ", '')

	// Poster image
	mediaObject.images = new mediaObjectImages()
	mediaObject.images.poster = "http:" + img.attr("src")

	// Example info page URL: /watch-2717625-How-the-Universe-Works-online-free
	mediaObject.info = alink.attr("href")

	// Genres
	mediaObject.genres = []
	var genresHTML = html.find("div.item_categories")
	genresHTML.find("a").each(function(i, el) {
		if (el) {
			var genre = new mediaObjectGenre()
			genre.title = $(el).text()
			mediaObject.genres.push( genre )
		}
	})

	// rating is based on the width of the pixels
	// example: width: 20px;
	var ratingsHTML = html.find("div.index_ratings")
	var ratingStyle = ratingsHTML.find(".current-rating").attr("style")
	var rating = ratingStyle.replace(/[^0-9]/g, '');
	mediaObject.rating = rating

	// Get year from title
	var title = alink.attr("title")
	var regexYear = /(\d\d\d\d)/g
	var yearMatch = title.match(regexYear)

	if (yearMatch)  mediaObject.year = yearMatch[0]

	return mediaObject
}

function parseMediaType(browsingMediaType) {
	switch (browsingMediaType) {
		case "movies": return "movie"
		case "shows": return "show"
		case "music": return "music"
		default: return "unknown"
	}
}


function parseInfoPage(body, req, res) {
	// <div class="movie_info">
	// <span class="movie_info_genres">

	// take released label (Released:	June 05, 2011) and use Date.parse()
	// Take that for the year.
	// Also create "first_aired":1429491600,

	// if episode list, then recurse into this function by way of parseEpisdeList.


	// Set up a new media object
	var mediaObject = new mediaObjectShowClass();
	mediaObject.portal = portal // Kind of important. ;)
	
	mediaObject = parseInfoPageHTML(body, mediaObject)

	res.json(mediaObject)
}

function parseInfoPageHTML(mediaInfoHTML, mediaObject) {
	$ = cheerio.load(mediaInfoHTML);
	
	// Get title
	var titleHTML = $("div.movie_navigation").find(".titles").find("a")
	var title = titleHTML.text()
	
	// Remove year from title. IE ( 2015 ), and clean it up
	var regexYear = /(\(\ \d\d\d\d\ \))/g
	title = title.replace(regexYear, '')
	mediaObject.title = title.trim()

	mediaObject.images = new mediaObjectImages()
	mediaObject.images.poster = "http:" + $("div.movie_thumb").find("img").attr("src")

	// Parse genre
	//parseInfoPageGenresHTML

	// Parse release date (for year and maybe airdate?)

	// Parse synopsis
	var movieInfoHTML = $("div.movie_info").find("p")
	var movieSynopsis = movieInfoHTML.text()
	mediaObject.synopsis = movieSynopsis.trim()

	// Parse rating


	// Season stuff
	var episodeContainer = $("div.tv_container")
	var seasonContainers = episodeContainer.find("div.show_season")
	
	var seasonCount = seasonContainers.length
	if (seasonCount <= 0)  return mediaObject

	// Get season information
	mediaObject.seasons = seasonCount

	return mediaObject
}

function parseEpisodeList(body, req, res) {
	// If the episode list HTML exists, parse it.
	// <div data-id="1" class="show_season">
	//  <div class="tv_episode_item">
}

function parseMediaListHTML(mediaInfoHTML, mediaObject, callback) {

}


// todo: store these somewhere else.. they are generic and can/should be used across all of Aggregator
function mediaObjectShowClass() { // Works for Movie and Series
	this.title = undefined // String
	this.type = undefined // String

	this.images = undefined // Single instance of mediaObjectImages()

	this.info = undefined // String (URL to info page)

	this.genres = undefined // Array of mediaObjectGenre()
	this.country = undefined // String
	this.rating = undefined // Number
	this.year = undefined // String

	this.synopsis = undefined // String

	this.seasons = undefined // Number
	this.episodes = undefined // Array of mediaObjectEpisodeClass()

	this.actors = undefined // Array of mediaObjectActor()
}

function mediaObjectEpisodeClass() {
	this.title = undefined // String
	this.season = undefined // Number
	this.episode = undefined // Number

	this.images = undefined // Single instance of mediaObjectImages()

	this.info = undefined // String (URL to info page)

	this.rating = undefined // Number

	this.overview = undefined // String
	this.files = undefined // Array of mediaObjectSource [sources loaded from the info page.]
	this.health = undefined // String - Health is based upon source count and how many of those are DVD, etc..
}


function mediaObjectSource() {
	this.source = undefined // Example: "vidbull.com"
	this.url = undefined // String
}

function mediaObjectActor() {
	this.name = undefined // String
	this.URL = undefined // String
}

function mediaObjectGenre() {
	this.title = undefined // String
	this.URL = undefined // String
}

function mediaObjectImages() {
	this.poster = undefined // String
}