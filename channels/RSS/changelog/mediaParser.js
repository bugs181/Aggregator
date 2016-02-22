// Parse HTML stuff and output MediaObjects

module.exports = {
  parsePage: parsePage,
  parseTags: parseTags,
  parseMenu: parseMenu
}


// Modules
var cheerio = require("cheerio")

// Methods
function parsePage(body) {
  // This method parses both the index page and individual media object's index page.

  $ = cheerio.load(body)

  // If we can obtain the changelog image.
  var siteImage
  var headerHTML = $("header.page-container")
  if (headerHTML) {
    var headerImage = headerHTML.find("img")
    siteImage = headerImage.attr("src")
  }
  
  var mediaObjects = []
  var mediaObjectHTML = $("article")
      .each(function(i, elem) {
        if (elem) {
          var mediaObject = parseMediaObjectHTML(elem)
          
          if (siteImage)
            mediaObject.image = siteImage

          mediaObjects.push(mediaObject)
        }
      })

  return mediaObjects
}

function parseMediaObjectHTML(elem) {
  // Parse individual HTML elements from page.

  var html = $(elem)

  var alink = html.find("a")
  var title = alink.text()
  var link = alink.attr('href')

  if (title)
    title = title.trim()

  var postContent = html.find("p")
  var description = postContent.text()

  var mediaObject = {
    name: title,
    description: description,
    link: link
  }

  // If article contains a podcast
  var contentHTML = html.find("audio")
  content = contentHTML.attr('src')

  if (content)
    mediaObject.content = content

  // var sponsorsHTML = html.find("sponsor")
  // TODO: Finish later. No easy way to grab sponsors.

  return mediaObject
}


// Supplied mediaObject formats:

// Basic
/*{
  name: 
  description:
  link:
}*/

// Extended
/*{
  name: 
  description:
  link:
  content: mp3 link
  sponsors: []
}*/


function parseTags(body) {
  $ = cheerio.load(body)

  var mediaTags = []
  var mediaTagsHTML = $("nav.nav-tags")
  
  var tags = mediaTagsHTML.find("li")
  tags.each(function(i, elem) {
    if (elem) {
      var mediaTag = parseMediaTagHTML(elem)
      mediaTags.push(mediaTag)
    }
  })

  return mediaTags
}

function parseMediaTagHTML(elem) {
  var html = $(elem)

  var tagHtml = html.find("a")
  var tagLink = tagHtml.attr("href")
  var tagName = tagHtml.text()

  return {
    name: tagName,
    link: tagLink
  }
}

function parseMenu(body) {
  // <nav class="menu-primary">
}