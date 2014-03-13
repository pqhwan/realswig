// Server.js
// Server startup code

//vanilla node version (all we need for now, plus good for foundation)
var http = require('http');
var url = require('url');
var fs = require('fs');

function startService(route, handlers){

    //first responder to request
    function onRequest(request, response){
        var pathname = url.parse(request.url).pathname;
				console.log('---new request'.rainbow);

				//Takes care of requests for files under css/ and js/
                //if pathname looks like /js/~ or /css/~ 
				//TODO AND it does not uses any more slashes from thereon
				//AND the path it asks for is real
				if( /^\/(img|js|css)\//.test(pathname) && fs.existsSync(pathname.slice(1))){
					console.log('sending asset: '.green+pathname.slice(1).green);

                    var mimetype = pathname.match(/(img|js|css)/)[0];
					//var mimetype = /css$/.test(pathname)? 'css':'javascript';
					response.writeHead(200,{'Content-Type':'text/'+mimetype});
					//TODO WARNING--synchronous method--possible bottlneck
					response.write(fs.readFileSync(pathname.slice(1)));
					response.end();
					return;
				} 
                 

        //for requests not for CSS & JS dependency files
        route(handlers, pathname, response);
    }

    port = Number(process.env.PORT || 9001);
    http.createServer(onRequest).listen(port);
    console.log('listening to ' + port);
}

exports.startService = startService;
