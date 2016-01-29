var express = require('express')

module.exports = function(app, config) {

	// Load channels and make it accessible to all routes
	const channels = require('./routes/v1/channels')(app, config)

	// Server information routes
	require("./routes/v1/server")(app, config)

	// v1 of the API, supports http and socket.io streams
	var v1 = express.Router()
	app.use('/api/v1', v1)
	require("./routes/v1/channels-http")(v1, config, channels)
	require("./routes/v1/channels-streams")(v1, config, channels)

	// If we made it here - no route found, send 404 Not Found
	app.use(function(req, res) {
		res.status(404).end()
	})

}