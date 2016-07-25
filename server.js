'use strict'

// Aggregator core

// Logging
let ansi = require('ansi')
let cursor = ansi(process.stdout)

// Config file
const config = require('./config/development/server')

// Express server
let express = require('express')
let app = express()

// Store ansi/cursor in app
app.cursor = cursor

// Bring in app middleware & routes
require('./middleware/app')(app, config)
require('./routes')(app, config)
require('./middleware/socket')(app, config)

// Start app
const port = config.http.port
let server = app.listen(port, function() {
	cursor.hex('#2EAEBB').write('Waiting for web requests on ')
				.hex('#D35003').write(`${port}\r\n`)
				.reset()
})