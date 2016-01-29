var config = {}

module.exports = function(app, cfg) {

	config = cfg

	// Aggregator info routes.
	app.get('/info', serverInfo)

}

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