'use strict'

// Parse HTML stuff and output MediaObjects

module.exports = {
  parsePage: parsePage,
  parseTags: parseTags,
  parseMenu: parseMenu
}


// Modules
let cheerio = require('cheerio')

// Methods
function parsePage(body) {
  // This method parses both the index page and individual media object's index page.

  if (!body)
    return []

  let $ = cheerio.load(body)

  // If we can obtain the changelog image.
  let siteImage
  let headerHTML = $('header.page-container')
  if (headerHTML) {
    let headerImage = headerHTML.find('img')
    siteImage = headerImage.attr('src')
  }
  
  let mediaObjects = []
  let mediaObjectHTML = $('article')
      .each(function(i, elem) {
        if (elem) {
          let mediaObject = parseMediaObjectHTML(elem)
          
          if (siteImage)
            mediaObject.image = siteImage

          mediaObjects.push(mediaObject)
        }
      })

  return mediaObjects
}

function parseMediaObjectHTML(elem) {
  // Parse individual HTML elements from page.

  let $ = cheerio.load(elem)
  let html = $(elem)

  let alink = html.find('a')
  let title = alink.text()
  let link = alink.attr('href')

  if (title)
    title = title.trim()

  let postContent = html.find('p')
  let description = postContent.text()

  let mediaObject = {
    name: title,
    description: description,
    link: link,
    type: 'podcast',
  }

  // If article contains a podcast (only available when parsing single media object page)
  let contentHTML = html.find('audio')
  let content = contentHTML.attr('src')

  if (content) {
    mediaObject.content = content
  } else
    mediaObject.reference = true // Tell MediaChannel that this is only a reference to the actual Media Object.

  // I don't know if .reference is the correct way of doing this.. since technically EVERYTHING in MC is Media Object.
  // Instead, we should consider changing the 'type' to reference.. but that might throw some clients off, rather than
  // having a similar 'type' and using a 'reference' flag. Which 'ref' flag makes more sense.
  // Then we can do cleanups on dead references..
  // The more I think about it; the more I like the reference flag.
  // We can do post processing on detection of that flag.

/*
MediaChannel aids in helping you find dead or broken links, especially prominent across domains!
For example, if you find a dead link on one website, just mark it as such and it will be marked across all websites.
*/

  // let sponsorsHTML = html.find("sponsor")
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
  let $ = cheerio.load(body)

  let mediaTags = []
  let mediaTagsHTML = $('nav.nav-tags')
  
  let tags = mediaTagsHTML.find('li')
  tags.each(function(i, elem) {
    if (elem) {
      let mediaTag = parseMediaTagHTML(elem)
      mediaTags.push(mediaTag)
    }
  })

  return mediaTags
}

function parseMediaTagHTML(elem) {
  let $ = cheerio.load(elem)

  let html = $(elem)

  let tagHtml = html.find('a')
  let tagLink = tagHtml.attr('href')
  let tagName = tagHtml.text()

  return {
    name: tagName,
    link: tagLink,
    type: 'tag',
  }
}

function parseMenu(body) {
  // <nav class="menu-primary">
}