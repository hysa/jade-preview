/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , path = require('path')
  , jade = require('jade');

var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

server.listen(app.get('port'));

io.sockets.on('connection',  function (socket) {
  socket.on('changeHtml', function(jadeText) {
    emitPreview(socket, jadeText);
  });
});

/**
 * Emit preview to browser.
 *
 * @param socket
 * @param {String} jadeText
 */
function emitPreview(socket, jadeText) {
  var options = {pretty: true};
  var compiled;
  try {
    compiled = jade.compile(jadeText, options)();
  } catch (e) {
    console.error(e);
    compiled = 'Error occured. Please check sintax.\n'
               + e.toString();
  }
  socket.emit('preview', {
    jade: jadeText,
    markup: compiled
  });
}

