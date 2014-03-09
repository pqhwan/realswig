// Server.js
// Server startup code

//vanilla node version (all we need for now, plus good for foundation)
var http = require('http');
var url = require('url');

function startService(route, handlers){
    function onRequest(request, response){
        var pathname = url.parse(request.url).pathname;

        //TODO is this for a CSS, JS dependency file?
        //(match pathnames starting with /css or /js)

        //it's an actual route
        console.log('Request received for path: '+ pathname);
        route(handlers, pathname, response);
    }

    port = Number(process.env.PORT || 9001);
    http.createServer(onRequest).listen(port);
    console.log('listening to ' + port);
}

exports.startService = startService;



/* express version
var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());

app.get('/', function(req, res){
	res.send('Hello World!');
});

var port = Number(process.env.PORT || 9001);

app.listen(port, function(){
	console.log("listening on " + port);
}); */


