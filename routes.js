var express = require('express')

module.exports = function(app, config) {

	// Load channels and make it accessible to all routes
	const channels = require('./routes/channels')(app, config)

	// Server information routes
	require('./routes/v1/server')(app, config)

	// v1 of the API, supports http and socket.io streams
	var v1 = express.Router()
	require('./routes/v1/channels')(v1, config, channels)
	app.use('/api/v1', v1)

	// If we made it here - no route found, send 404 Not Found
	app.use(function(req, res) {
		res.status(404).end()
	})

}