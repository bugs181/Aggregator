var providers = require('../providers/load.js');

module.exports = function(app) {

	// todo: somehow group this into /teleivison

	app.get('/play/:sourceURL', playMedia);
	app.get('/stream/:sourceURL', playMedia);
	app.get('/transcode/:sourceURL', playMedia);
	app.get('/handoff/:sourceURL', playMedia);


	// app.get('/digest/')
	// .get('/consume')
	

}

function playMedia(req, res) {
	// todo: Handle request
}