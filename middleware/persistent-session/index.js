var store

var PersistentSession = function(config) {
  store = config.store
  return sessionRequest
}

PersistentSession.Store = function(config) {
  /*console.log('Store()')
  console.log('config: ')
  console.log(config)
  */
}

function sessionRequest(req, res, next) {
  req.session = {
    set: function(sessionId, session, callback) {
      store.set(sessionId, session, function(err) {
        if (err)
          callback(err)
        else
          callback()
      })
    },

    get: function(sessionId, callback) {
      store.get(sessionId, function(err, session) {
        if (err)
          return callback(err)

        callback(null, session)
      })
    },
  }

  next()
}

module.exports = PersistentSession

/*
module.exports = function(config) {

  Store: function(a,b,c) {
    console.log('Store()')
    console.log(a)
  },

  Cookie: function() {
    console.log('Cookie')
  },

  Session: function() {
    console.log('Session')
  },

  MemoryStore: function() {
    console.log('MemoryStore')
  },
}*/