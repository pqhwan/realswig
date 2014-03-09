// Server.js
// Server startup code

//vanilla node version (all we need for now, plus good for foundation)
var http = require('http');
var url = require('url');
var fs = require('fs');

function startService(route, handlers){
    function onRequest(request, response){
        var pathname = url.parse(request.url).pathname;
				console.log('---new request starts'.cyan);


				//Takes care of requests for files under css/ and js/
        //if pathname looks like /js/~ or /css/~ 
				//TODO AND it does not uses any more slashes from thereon
				//AND the path it asks for is real
				if( /^\/(js|css)\//.test(pathname) && fs.existsSync(pathname.slice(1))){
					console.log('sending asset: '.green+pathname.slice(1).green)
					var mimetype = /css$/.test(pathname)? 'css':'javascript';
					response.writeHead(200,{'Content-Type':'text/'+mimetype});
					//TODO WARNING--synchronous method--possible bottlneck
					response.write(fs.readFileSync(pathname.slice(1)));
					response.end();
					return;
				}


        //it's an actual route
        console.log('Request received for path:'+ pathname);
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


