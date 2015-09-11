var portals = require('../portals/load.js');
var config = require('../config')

module.exports = function(app) {

	app.get('/', serverInfo);

	// todo: search-index search media objects
	// /search/portals // searches the index to find media objects from all portals

	// todo: better api standard;
	// something like;

	// :portal/:action
	// :portal/:action/:subAction

	// or reverse them and do;

	// :action/:portal
	// So that we can seperate them out into individual route helper modules.

	// todo: create a function timeout, with res.json error.
	// The function timeout will work similar to res.chunk, but added at the portals.js layer.

	// todo: seperate portals out into sections
	// Aggregator/portals/television/primewire.ag
	// Aggregator/portals/books/iBookWebsite.com

	// todo: add some sort of userbase mechanism, for authentication and so-forth.
	// That way premium services will use the user's account.
	// This should support things like revokable user tokens, ie; facebook, google apps, etc.

	// ./userbase/google
	// ./userbase/facebook/index.js
	// etc


	// Allow browsing of portal media objects.
	app.get('/browse', browseRequest); // Selects a default portal.
	app.get('/browse/:mediaType', browseRequest); // Selects a default portal.
	app.get('/:portal/browse', browseRequest);
	app.get('/:portal/browse/:mediaType', browseRequest);

	// Get more info about a particular media object.
	app.get('/:portal/info/:sourceURL', mediaInfo); // Use the source URL as an identifier.
	app.get('/:portal/info/:id', mediaInfo); // using the search-index ID ?

	// Search for a particular media object on a given portal.
	app.get('/search', searchMedia); // Selects a default portal.
	app.get('/:portal/search', searchMedia);

}

// Overview:

// Portals:
// All portals should support the following methods
// browse(req, res)
// mediaInfo(req, res)
// search(req, res)
// navigationMenu()
// navigateIndex()

// Providers
// All service providers should support the following methods
// play(req, res) || download(req, res) || fetch
// Not sure on naming convention yet.


function serverInfo(req, res) {
	res.json({
		// Generic server info properties.
		status: 'online', 
		uptime: process.uptime() | 0, 

		// Added a few more bits of info
		version: "08112015", // Month/Day/Year
		service: "Media4All"
	});
}

function browseRequest(req, res) {
	// Default browse index, can be a variety of types of media for a "Quick Glance" type of view.

	// Set a default media type if not provided.
	if (!req.params.mediaType)  req.params.mediaType = config.defaults.mediaType // movies

	// Set a default portal if not provided.
	var portal = req.params.portal;
	if (!portal)  portal = config.defaults.portal // primewire.ag

	// Lowercase known req params to be safe
	req.params.mediaType = req.params.mediaType.toLowerCase()
	portal = portal.toLowerCase()

	// Send request to portal.
	var portalService = portals[portal];
	if (typeof portalService === "object" && typeof portalService.browse === 'function') {
		portalService.browse(req, res)
		return;
	}

	res.status(404).json({ success: false, error: "No such portal" });
}

function mediaInfo(req, res) {
	var portal = req.params.portal;
	portal = portal.toLowerCase()

	// Send request to portal.
	var portalService = portals[portal];
	if (typeof portalService === "object" && typeof portalService.mediaInfo === 'function') {
		portalService.mediaInfo(req, res)
		return;
	}

	res.status(404).json({ success: false, error: "No such portal" });
}

function searchMedia(req, res) {
	// Set a default portal if not provided.
	var portal = req.params.portal;
	if (!portal)  portal = config.defaults.portal // primewire.ag

	// Send request to portal.
	var portalService = portals[portal];
	if (typeof portalService.search === 'function')
		portalService.search(req, res)
}
