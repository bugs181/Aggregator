module.exports = {
	getVideoFile: getVideoFile
}

function getVideoFile(mediaURL, callback) {
	var videoFile = {
		type: "unknown",
		url: "http://vidzi.tv/ofzuj6ejrn1l-92ea46231b4eacbc727754edb69afe7e.m3u8?embed=",
		transcode: true // only transcodes if required.. this method uses the download method.. or whatever.
	}

	// if video is set to transcode, then the engine will provide a proxy URL to AppleTV / Client
	// Something like:
	// http://atv.towner.co/player/transcode?url=http://vidzi.tv/ofzuj6ejrn1l-92ea46231b4eacbc727754edb69afe7e.m3u8?embed=
	// Otherwise, a 302 Moved is issued?

	callback(videoFile);
}