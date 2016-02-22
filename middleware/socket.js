'use strict'

// Wrap Express routes with Socket.io

var routes = []

var logColorRed = '#FF0000' // red
var logColorBlue = '#0033CC' // blue

module.exports = function(app) {
	init(app)
}


function init(app) {
	var server = require('http').Server(app)
	var io = require('socket.io')(server)

	io.on('connection', (socket) => {
		socket.on('req', (req) => {
			parseSocketEvent(socket, req)
		})
	})

	app.server = server
	loadRoutes(app)
}

function loadRoutes(app) {
  var routerStack = app._router.stack

  for (var routeContainer of routerStack) {
    var route = routeContainer.route

    if (route && route.path) {
      var method = route.stack[0].method.toUpperCase()
      var path = route.path
      var regexp = routeContainer.regexp
      var keys = routeContainer.keys
      var handle = route.stack[0].handle

      routes.push({ path: path, method: method, regexp: regexp, keys: keys, fn: handle })
    }  	
  }
}

function parseSocketEvent(socket, reqObj) {
	var req = {
		id: reqObj.id,
		method: reqObj.method,
		url: reqObj.url,
		body: reqObj.body
	}

	parseRequest(socket, req)
}

function parseRequest(socket, req) {
	var reqId = req.id
	var method = ((req.method) ? req.method.toUpperCase() : null)
	var url = req.url
	var body = req.body

	if (!reqId)
		return socket.emit('req', { statusCode: 400, statusMessage: 'Bad Request', reason: 'No request id provided.' })

	if (!url)
		return socket.emit('req', { statusCode: 400, statusMessage: 'Bad Request', reason: 'No request url provided.' })

	if (!isValidMethod(method))
		return socket.emit('req', { statusCode: 501, statusMessage: 'Not Implemented' })

	var route = findRoute(method, url)
	if (!route)
		return logRequest(logColorRed, req)

	logRequest(logColorBlue, req)

	var req = initReq(route, method, url, body)
	var res = initRes(reqId, socket)

	var fn = route.fn
	fn.call(null, req, res)
}

function logRequest(color, req) {
	var ansi   = require('ansi')
  var cursor = ansi(process.stdout)
	cursor.hex(color).write(`[io:${req.method}] `)
        .hex('#D35003').write(`${req.url}\r\n`).reset()
}

function isValidMethod(method) {
	switch (method) {
	case 'GET': 
		return true
	case 'PUT':
		return true
	case 'POST':
		return true
	case 'DELETE':
		return true
	default:
		return false
	}
}

function findRoute(method, url) {
  for (var route of routes) {
  	if (route.method == method)
  		if (regexMatches(route.regexp, url))
  			return route
  }
}

function regexMatches(regex, string) {
	if (!regex || !string)
		return false
	else
		return regex.exec(string)
}

function initReq(route, method, url, body) {
	var query = require('querystring').parse(url)
	var params = getParams(route, decodeURI(url))

	return {
		query: query,
		params: params,
		body: body
	}
}

function initRes(reqId, socket) {
	return {
		statusCode: 200,

		status: function(code) {
			console.log(`Set status code to ${code}`)
		},

		send: function(data) {
			//console.log(data)
			socket.emit('req', { id: reqId, statusCode: this.statusCode }, data)
		},

		end: function(data) {
			//console.log(data)
			socket.emit('req', { id: reqId, statusCode: this.statusCode }, data)
		}
	}
}

function getParams(route, url) {
	url = url.split('?')[0] // Remove query params from url

	var params = route.regexp.exec(url)
	var keys = route.keys

	var reqParams = {}
	var ctr = 1

	for (var key of keys) {
		if (!key.name)
			continue

		var param = params[ctr]
		if (typeof(param) !== 'string')
			continue

		if (!param)
			continue

		reqParams[key.name] = param

		ctr++
	}

	return reqParams
}