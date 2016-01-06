var channels = require('../channels/load.js');
var config = require('../config')

module.exports = function(app) {

	// Aggregator info routes.
	app.get('/', serverInfo);

	// Allow browsing of channel media objects.
	app.get('/browse', browseRequest); // Selects a default channel.
	app.get('/browse/:mediaType', browseRequest); // Selects a default channel.
	app.get('/:channel/browse', browseRequest);
	app.get('/:channel/browse/:mediaType', browseRequest);

	// Get more info about a particular media object.
	app.get('/:channel/info/:id', mediaInfo); // using the search-index ID ?

	// Search for a particular media object on a given channel.
	app.get('/search', searchMedia); // Selects a default channel.
	app.get('/:channel/search', searchMedia);

	// List supported channels
	app.get('/channels', listChannels)

}

// Overview:

// Channels:
// All  should support the following methods
// browse(req, res)
// mediaInfo(req, res)
// search(req, res)
// navigationMenu()
// navigateIndex()
// NOTE: Add name, website, and type properties to allow better support/functionality.

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

	// Set a default channel if not provided.
	var channel = req.params.channel;
	if (!channel)  channel = config.defaults.channel // primewire.ag

	// Lowercase known req params to be safe
	req.params.mediaType = req.params.mediaType.toLowerCase()
	channel = channel.toLowerCase()

	// Send request to channel.
	var channelService = channels[channel]
	if (typeof channelService === "object" && typeof channelService.browse === 'function') {
		channelService.browse(req, res)
		return;
	}

	res.status(404).json({ success: false, error: "No such channel" });
}

function mediaInfo(req, res) {
	var channel = req.params.channel;
	channel = channel.toLowerCase()

	// Send request to channel.
	var channelService = channels[channel];
	if (typeof channelService === "object" && typeof channelService.mediaInfo === 'function') {
		channelService.mediaInfo(req, res)
		return;
	}

	res.status(404).json({ success: false, error: "No such channel" });
}

function searchMedia(req, res) {
	// Set a default channel if not provided.
	var channel = req.params.channel;
	if (!channel)  channel = config.defaults.channel // primewire.ag

	// Send request to channel.
	var channelService = channels[channel];
	if (typeof channelService.search === 'function')
		channelService.search(req, res)
}

function listChannels(req, res) {
	var channelsArray = Object.keys(channels).map(function(key) { return channels[key] })

	var channelList = []
	for (var channelRaw of channelsArray) {
		if (!channelRaw.name)  continue

		var channel = {
			name: channelRaw.name,
			type: channelRaw.type,
			website: channelRaw.website
		}

		channelList.push(channel)
	}

	res.status(200).send(channelList)
}