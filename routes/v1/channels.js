//var channels = require('./channels')
var config = {}
var channels = []


module.exports = function(app, cfg, chnls) {

	config = cfg
	channels = chnls

	// List supported channels
	app.get('/channels', listChannels)
	app.get('/channels/:channelType', listChannels)

	// Allow discovering of new channels
	app.get('/discover/channels/:channelType', discoverChannels)
	app.get('/discover/channels/:channelType/:discoveryType/:discoveryParam', discoverChannels)

	// Allow browsing of channel media objects.
	app.get('/discover/:channel/objects', discoverMediaObjects)
	app.get('/discover/:channel/objects/:mediaObjectType', discoverMediaObjects)
	app.get('/discover/:channel/objects/:mediaObjectType/:discoveryType/:discoveryParam', discoverMediaObjects)

	// Discover sections and other things on select channel
	app.get('/discover/:channel', discoverChannelObjects)
	app.get('/discover/:channel/:channelObjectType', discoverChannelObjects)
	// ^ This one conflicts with /objects, so defined after.

	// Get more info about a particular media object.
	app.get('/info/:channel', getMediaObjectInfo)
	app.post('/info/:channel/batch', getMediaObjectInfoBatch)

	// Search for something in particular on a given channel.
	app.get('/search/:channel', searchMediaObjects)
}



function listChannels(req, res) {
	var listChannelType = ((req.params.channelType) ? req.params.channelType.toLowerCase() : null)
	var channelsArray = Object.keys(channels).map(function(key) { return channels[key] })

	var channelList = []
	for (var channelRaw of channelsArray) {
		if (!channelRaw.name)  continue
		if (listChannelType && channelRaw.type && listChannelType != channelRaw.type.toLowerCase())  continue

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
	 * http://media.object/discover/channels/television
	 * http://media.object/discover/channels/television/tag/DIY
	*/

	// channel.discover()
	// Can output things like tags, description, sections, etc.
}

function discoverChannelObjects(req, res) {
	// Used for discovering different sections on the channel (like tags), and potentially related object sets.
	/* Examples:
	 * http://media.object/discover/primewire.ag
	 * http://media.object/discover/primewire.ag/tags
	*/

	var channelReq = req.params.channel
	var channel = findChannel(channelReq)

	if (!channel)
		return res.status(404).send({ success: false, description: "Channel not found" })

	var discoverFn = channel.discoverChannel
	if (!discoverFn)
		return res.status(500).send({ success: false, description: "Channel does not support discovery" })

	discoverFn(req.params, function(err, mediaObjects) {
		if (err)
			return res.status(404).send({ success: false, description: "No objects found" })

		res.status(200).send(mediaObjects)
	})
}

function discoverMediaObjects(req, res) {
	/* Examples:
	 * http://media.object/discover/primewire.ag/objects
	 * http://media.object/discover/primewire.ag/objects/movies
	 * http://media.object/discover/primewire.ag/objects/movies?tag=comedy
	 * http://media.object/discover/primewire.ag/objects/movies/tag/comedy
	 * http://media.object/discover/primewire.ag/objects/any/tag/comedy
	*/

	var channelReq = req.params.channel
	var channel = findChannel(channelReq)

	if (!channel)
		return res.status(404).send({ success: false, description: "Channel not found" })

	var discoverFn = channel.discoverMediaObjects
	if (!discoverFn)
		return res.status(500).send({ success: false, description: "Channel does not support discovery" })

	discoverFn(req.params, function(err, mediaObjects) {
		if (err)
			return res.status(404).send({ success: false, description: "No objects found" })

		var mediaObjectsModified = []
		for (var mediaObject of mediaObjects) {
			var mediaObjectModified = addMediaObjectInfo(channel, mediaObject)
			if (validateMediaObject(mediaObjectModified))
				mediaObjectsModified.push(mediaObjectModified)
		}

		res.status(200).send(mediaObjectsModified)
	})
}

function getMediaObjectInfo(req, res) {
	var channelReq = req.params.channel
	var channel = findChannel(channelReq)

	if (!channel)
		return res.status(404).send({ success: false, description: "Channel not found" })

	var getInfoFn = channel.getMediaObjectInfo
	if (!getInfoFn)
		return res.status(500).send({ success: false, description: "Channel does not support this operation" })

	var link = req.query.link
	getInfoFn(link, function(err, mediaObject) {
		if (err)
			return res.status(404).send({ success: false, description: "No objects found" })

		var mediaObjectModified = addMediaObjectInfo(channel, mediaObject)
		if (validateMediaObject(mediaObjectModified))
			res.status(200).send(mediaObjectModified)
		else
			res.status(404).send({ success: false, description: "Media object could not be validated" })
	})
}

function getMediaObjectInfoBatch(req, res) {
	// req.body
}

function searchMediaObjects(req, res) {
}

function findChannel(channelName) {
	var channelsArray = Object.keys(channels).map(function(key) { return channels[key] })

	for (var channel of channelsArray) {
		if (!channel.name)  continue
		if (channel.name == channelName)
			return channel
	}

	return null
}

function addMediaObjectInfo(channel, mediaObject) {
	mediaObject.channel = channel.name
	mediaObject.type = "podcast"

	return mediaObject
}

function validateMediaObject(mediaObject) {
	// todo: check to make sure media object has all of the minimum properties.

	return mediaObject
}

function channelAction(req, res) {

}