
module.exports = function(app) {

	require("./routes/portals")(app)
	require("./routes/providers")(app)

}