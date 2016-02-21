// Parse HTML stuff and output MediaObjects

module.exports = {
  parseIndex: parseIndex
}


// Modules
var cheerio = require("cheerio");


// Media object parsing methods.
function parseIndex(body, callback) {
  $ = cheerio.load(body);
  
  var mediaObjects = []

  var mediaObjectHTML = $("article")
      .each(function(i, elem) {
        if (elem) {
          var mediaObject = parseMediaObjectHTML(elem)
          mediaObjects.push(mediaObject);
        }
      })

  callback(null, mediaObjects)
}

function parseMediaObjectHTML(elem) {
  var html = $(elem)

  var alink = html.find("a")
  
  var title = alink.text()
  var link = alink.attr('href')

  if (title)
    title = title.trim()

  var postContent = html.find("p")
  var description = postContent.text()

  return {
    name: title,
    description: description,
    link: link
  }
}

/*
{
  name: title,
  description,

  link:
  content: mp3 link
  sponsors: []
}
*/