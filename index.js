var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

var handlers = {}; //handler object

handlers['/'] = requestHandlers.front;
handlers['/signup'] = requestHandlers.front;
handlers['/register'] = requestHandlers.register;
handlers['/thanks'] = requestHandlers.thanks;
handlers['/confirmed'] = requestHandlers.confirmed;

server.startService(router.route, handlers);
