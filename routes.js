
module.exports = function(app) {

	require("./routes/channels")(app)
	require("./routes/providers")(app)

}