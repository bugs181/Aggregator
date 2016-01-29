// Aggregator core

// Logging
var ansi = require('ansi'), cursor = ansi(process.stdout)

// Config file
const config = require("./config/development/server")

// Express server
var express = require('express')
var app = express()

// Store ansi/cursor in app
app.cursor = cursor

// Bring in app middleware & routes
require('./middleware/app')(app, config)
require('./routes')(app, config)

// Start app
const port = config.http.port
var server = app.listen(port, function() {
	cursor.hex('#2EAEBB').write("Waiting for web requests on ")
				.hex('#D35003').write('' + port + '\r\n')
				.reset()
})