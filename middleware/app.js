
// Requirements
var ansi = require('ansi'), cursor = ansi(process.stdout);
var bodyParser   = require('body-parser');


module.exports = function(app) {

  app.use(bodyParser.json());

  // Allow cross domain scripting.
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, x-requested-with');

    next();
  });

  // Log requests to console
  app.use(function(req, res, next) {
    cursor.hex('#2EAEBB').write("[" + req.method + "] ")
          .hex('#D35003').write(req.url + "\r\n").reset();

    next();
  })
}
