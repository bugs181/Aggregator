// Aggregator core

// Logging
var ansi = require('ansi'), cursor = ansi(process.stdout)

// Config file
var config = require("./config")

// Express server
var express = require('express')
var app = express()

// Bring in app middleware & routes
require('./middleware/app')(app)
require('./routes')(app)

// Start app
var port = config.http.port
var server = app.listen(port, function() {
	cursor.hex('#2EAEBB').write("Waiting for web requests on ")
				.hex('#D35003').write('' + port + '\r\n')
				.reset()
})