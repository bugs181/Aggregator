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
  content = contentHTML.attr('src')

  if (content)
    mediaObject.content = content

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