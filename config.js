
module.exports = {
	http: {
		port:  8020
	},

	defaults: {
		mediaType: "movies", // todo: rename to television. TV encompasses movies, shows, etc.
		portal: "primewire.ag"
	},

	defaultsTodo:
		[
			{
				mediaType: "television",
				portal: "primewire.ag"
			},
			{
				mediaType: "events/tv", // Things like tv calendars, showtimes, etc.
				portal: "sidereel.com"
			},
			{
				mediaType: "events/social",
				portal: "towner.com"
			}
		]
}
