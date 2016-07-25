'use strict'

let config = {}
let channels = []


module.exports = function(app, cfg, chnls) {

	config = cfg
	channels = chnls

	// List supported channels
	app.get('/channels', listChannels)
	app.get('/channels/:channelType', listChannels)

	// Allow discovering of new channels
	app.get('/discover/channels/:channelType', discoverChannels)
	app.get('/discover/channels/:channelType/:discoveryType/:discoveryParam', discoverChannels)

	// Allow discovery of channel media objects.
	app.get('/discover/:channel/objects', discoverMediaObjects)
	app.get('/discover/:channel/objects/:mediaObjectType', discoverMediaObjects)
	app.get('/discover/:channel/objects/:mediaObjectType/:discoveryType/:discoveryParam', discoverMediaObjects)

	// Discover sections and other things on select channel
	app.get('/discover/:channel', discoverChannelSections)
	app.get('/discover/:channel/:channelObjectType', discoverChannelSections)
	// ^ This one conflicts with /objects, so defined after.

	// Get more info about particular media objects.
	app.get('/info/:channel', getMediaObjectInfo)
	app.post('/info/:channel/batch', getMediaObjectInfoBatch)

	// Search for something in particular on a given channel.
	app.get('/search/:channel', searchMediaObjects)

	// Auth for channel
	// todo: Add stubs for auth
}



function listChannels(req, res) {
	let listChannelType = ((req.params.channelType) ? req.params.channelType.toLowerCase() : null)

	let foundChannels = []
	for (let channel of channels) {
		if (!channel.name) continue
		if (listChannelType && channel.type && listChannelType != channel.type.toLowerCase()) continue

		let channelObj = {
			name: channel.name,
			type: channel.type,
			website: channel.website,
			aggregator: channel.aggregator,
		}

		foundChannels.push(channelObj)
	}

	res.status(200).send(foundChannels)
}

function discoverChannels(req, res) {
	/* Examples:
	 * http://media.object/discover/channels/television
	 * http://media.object/discover/channels/television/tag/DIY
	*/

	// channel.discover()
	// Can output things like tags, description, sections, etc.
}

function discoverChannelSections(req, res) {
	// Used for discovering different sections on the channel (like tags), and potentially related object sets.
	/* Examples:
	 * http://media.object/discover/changelog
	 * http://media.object/discover/changelog/tags
	 * http://media.object/discover/changelog/tag/javascript
	*/

	let channelName = req.params.channel
	let channel = findChannel(channelName)

	if (!channel)
		return res.status(404).send({ description: 'Channel not found' })

	let discoverFn = channel.discoverChannelSections
	if (!discoverFn)
		return res.status(500).send({ description: 'Channel does not support discovery' })

	discoverFn(req.params, function(err, mediaObjects) {
		if (err)
			return res.status(404).send({ description: 'No objects found' })

		res.status(200).send(mediaObjects)
	})
}

function discoverMediaObjects(req, res) {
	/* Examples:
	 * http://media.object/discover/primewire.ag/objects
	 * http://media.object/discover/primewire.ag/objects/movies
	 * http://media.object/discover/primewire.ag/objects/shows
	 * http://media.object/discover/primewire.ag/objects/movies/tag/comedy
	 * http://media.object/discover/primewire.ag/objects/* or any/tag/comedy
	*/

	let channelName = req.params.channel
	let channel = findChannel(channelName)

	if (!channel)
		return res.status(404).send({ description: 'Channel not found' })

	let discoverFn = channel.discoverMediaObjects
	if (!discoverFn)
		return res.status(500).send({ description: 'Channel does not support discovery' })

	let params = req.params
	params.query = req.query

	discoverFn(params, function(err, mediaObjects) {
		if (err)
			return res.status(500).send({ description: err })

		if (typeof mediaObjects !== 'object' || mediaObjects.length <= 0)
			return res.status(404).send({ description: 'No objects found' })

		let mediaObjectsModified = []
		for (let mediaObject of mediaObjects) {
			let mediaObjectModified = addMediaObjectInfo(channel, mediaObject)
			if (validateMediaObject(mediaObjectModified))
				mediaObjectsModified.push(mediaObjectModified)
		}

		res.status(200).send(mediaObjectsModified)
	})
}

function getMediaObjectInfo(req, res) {
	let channelName = req.params.channel
	let channel = findChannel(channelName)

	if (!channel)
		return res.status(404).send({ description: 'Channel not found' })

	let getInfoFn = channel.getMediaObjectInfo
	if (!getInfoFn)
		return res.status(500).send({ description: 'Channel does not support this operation' })

	let link = req.query.link
	getInfoFn(link, function(err, mediaObject) {
		if (err)
			return res.status(404).send({ description: 'No objects found' })

		let mediaObjectModified = addMediaObjectInfo(channel, mediaObject)
		if (validateMediaObject(mediaObjectModified))
			res.status(200).send(mediaObjectModified)
		else
			res.status(404).send({ description: 'Media object could not be validated' })
	})
}

function getMediaObjectInfoBatch(req, res) {
	// req.body
}

function searchMediaObjects(req, res) {
	/* Examples:
	 * http://media.object/search/primewire.ag?q=Doctor+Who
	*/

	//handleRequest(req, res, channel.searchMediaObjects)
	// .. Channel does not support that action.

	let channelName = req.params.channel
	let channel = findChannel(channelName)

	if (!channel)
		return res.status(404).send({ description: 'Channel not found' })

	let searchFn = channel.searchMediaObjects
	if (!searchFn)
		return res.status(500).send({ description: 'Channel does not support searching' })

	let params = req.params
	params.query = req.query

	searchFn(params, function(err, mediaObjects) {
		if (err)
			return res.status(500).send({ description: err })

		if (typeof mediaObjects !== 'object' || mediaObjects.length <= 0)
			return res.status(404).send({ description: 'No objects found' })

		let mediaObjectsModified = []
		for (let mediaObject of mediaObjects) {
			let mediaObjectModified = addMediaObjectInfo(channel, mediaObject)
			if (validateMediaObject(mediaObjectModified))
				mediaObjectsModified.push(mediaObjectModified)
		}

		res.status(200).send(mediaObjectsModified)
	})
}

function findChannel(channelName) {
	let foundChannels = channels.filter(channel => { 
		return channel.name && channel.name.toLowerCase() === channelName.toLowerCase() 
	})

	return foundChannels[0]
}

function addMediaObjectInfo(channel, mediaObject) {
	mediaObject.channel = channel.name

	return mediaObject
}

function validateMediaObject(mediaObject) {
	// todo: check to make sure media object has all of the minimum properties.

	return mediaObject
}

// todo: recode to have a single discoverFn type wrapper. Will remove plenty of duplication above.
