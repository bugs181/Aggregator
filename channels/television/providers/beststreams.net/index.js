module.exports = {
	getVideoFile: getVideoFile
}

function getVideoFile(mediaURL, callback) {

	var videoFile;

	var jwObj = jwplayer("flvplayer")
	if (jwObj && typeof jwObj.getPlaylistItem === 'function') {

		var playlist = jwObj.getPlaylistItem()

		var videoStream = playlist.streamer
		var url = new URL(videoStream);
		var videoHost = url.host

		var videoFileShort = playlist.file

		videoFile = "rtmp://" + videoHost + "/vod//" + videoFileShort
	}

	callback(videoFile);
}
