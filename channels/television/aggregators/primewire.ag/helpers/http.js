// Helper functions

var unirest = require("unirest");


module.exports = {
	loadPage: loadPage
}


function loadPage(url, callback) {
	unirest.get(url)
	.header('Accept', 'application/json')
	.end(function (response) {
	  if (callback)  callback(response.body);
	});
}