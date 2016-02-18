//var channels = require('./channels')
var config = {}
var channels = []


module.exports = function(app, cfg, chnls) {

	config = cfg
	channels = chnls

	// List supported channels
	app.get('/channels', listChannels)

	// Allow discovering of new channels
	app.get('/discover/:channels/', discoverChannels)
	app.get('/discover/:channels/:discoveryType/:discoveryParam', discoverChannels)

	// Allow browsing of channel media objects.
	app.get('/discover/:channel', discoverMediaObjects)
	app.get('/discover/:channel/:mediaObjectType', discoverMediaObjects)
	app.get('/discover/:channel/:discoveryType/:discoveryParam', discoverMediaObjects)

	// Get more info about a particular media object.
	app.get('/info/:channel/:id', getMediaObjectInfo)

	// Search for something in particular on a given channel.
	app.get('/search/:channel', searchMediaObjects)
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

function discoverChannels(req, res) {
	/* Examples:
	 * http://media.object/discover/channels
	 * http://media.object/discover/channels/television
	 * http://media.object/discover/channels/tag/DIY
	*/
}

function discoverMediaObjects(req, res) {
	/* Examples:
	 * http://media.object/discover/primewire.ag/movies
	 * http://media.object/discover/primewire.ag/movies?tag=comedy
	 * http://media.object/discover/primewire.ag/tag/comedy
	*/


}