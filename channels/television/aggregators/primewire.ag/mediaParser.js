'use strict'

// Modules
let cheerio = require('cheerio');

// Variables
let portal = 'Primewire.ag'
let website = 'http://www.primewire.ag'


module.exports = {

	parseIndex: parseIndex,
	parseInfoPage: parseInfoPage

}

// Overview:
// parseIndex() > parseMediaObjectHTML() - Parses media objects from the directory/index type pages.
// parseEpisodeList() + parseMediaListHTML() - Parses episode list for TV Shows into URLs
// parseInfoPage() + parseMediaInfoHTML() - Parses media information like synopsis, imdb, sources, etc.

// todo: navigationMenu()
// todo: navigateIndex()


// Media object parsing methods.
function parseIndex(body, params, callback) {
	if (!body)
		return callback('No body found')

	let $ = cheerio.load(body)
	
	let mediaObjects = []

	let mediaObjectHTML = $('div.index_container').find('div.index_item')
			.each(function(i, elem) {

				if (elem) {
					
					// Set up a new media object
					let mediaObject = new mediaObjectShowClass()
					mediaObject.type = parseMediaType(params.mediaObjectType)

					parseMediaObjectHTML(elem, mediaObject)
					mediaObjects.push(mediaObject)
				}

			})

	callback(null, mediaObjects)
}

function parseMediaObjectHTML(mediaObjectHTML, mediaObject) {
	let $ = cheerio.load(mediaObjectHTML)
	let html = $(mediaObjectHTML)

	let alink = html.find('a')
	let img = alink.find('img')
	
	// Get the title, remove the 'Watch ' from 'Watch $showName'
	mediaObject.title = img.attr('alt') || ''
	mediaObject.title = mediaObject.title.replace('Watch ', '')

	// Poster image
	mediaObject.images = new mediaObjectImages()
	mediaObject.images.poster = 'http:' + img.attr('src')

	// Example info page URL: /watch-2717625-How-the-Universe-Works-online-free
	// .link is always the absolute URL of the media object.
	mediaObject.link = website + alink.attr('href')

	// Genres
	mediaObject.genres = []
	let genresHTML = html.find('div.item_categories')
	genresHTML.find('a').each(function(i, el) {
		if (el) {
			let genre = new mediaObjectGenre()
			genre.title = $(el).text()
			mediaObject.genres.push( genre )
		}
	})

	// rating is based on the width of the pixels
	// example: width: 20px;
	let ratingsHTML = html.find('div.index_ratings')
	let ratingStyle = ratingsHTML.find('.current-rating').attr('style')
	let rating = ratingStyle.replace(/[^0-9]/g, '');
	mediaObject.rating = rating

	// Get year from title
	let title = alink.attr('title')
	let regexYear = /(\d\d\d\d)/g
	let yearMatch = title.match(regexYear)

	if (yearMatch)  mediaObject.year = yearMatch[0]
}

function parseMediaType(browsingMediaType) {
	switch (browsingMediaType) {
		case 'movies': 
			return 'movie'

		case 'shows': 
			return 'show'

		case 'music': 
			return 'music'

		default: 
			return 'movie'
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
	let mediaObject = new mediaObjectShowClass();
	//mediaObject.portal = portal // Kind of important. ;)
	
	parseInfoPageHTML(body, mediaObject)

	res.json(mediaObject)
}

function parseInfoPageHTML(mediaInfoHTML, mediaObject) {
	let $ = cheerio.load(mediaInfoHTML);
	
	// Get title
	let title = $('div.movie_navigation').find('.titles').find('a').text()
	
	// Remove year from title. IE ( 2015 ), and clean it up
	let regexYear = /(\(\ \d\d\d\d\ \))/g
	title = title.replace(regexYear, '')
	mediaObject.title = title.trim()

	// Retrieve poster art
	mediaObject.images = new mediaObjectImages()
	mediaObject.images.poster = 'http:' + $('div.movie_thumb').find('img').attr('src')

	// Parse genre
	//parseInfoPageGenresHTML

	// Parse release date (for year and maybe airdate?)

	// Parse synopsis
	let movieInfoHTML = $('div.movie_info').find('p')
	let movieSynopsis = movieInfoHTML.text()
	mediaObject.synopsis = movieSynopsis.trim()

	// Parse rating


	// Season stuff
	let episodeContainer = $('div.tv_container')
	let seasonContainers = episodeContainer.find('div.show_season')
	
	let seasonCount = seasonContainers.length
	if (seasonCount <= 0)  return mediaObject

	// Get season information
	mediaObject.seasons = seasonCount
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

	this.link = undefined // String (URL to info page)

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

	this.link = undefined // String (URL to info page)

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