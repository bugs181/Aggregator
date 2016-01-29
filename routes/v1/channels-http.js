//var channels = require('./channels')
var config = {}
var channels = []

module.exports = function(app, cfg, chnls) {

	config = cfg
	channels = chnls

	// List supported channels
	app.get('/channels', listChannels)

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