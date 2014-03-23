var colors = require('colors');

function route(handlers, pathname, query, response, postData){

    if(typeof(handlers[pathname]) == 'function'){
        //handler found
        console.log('handler found for path:'.green + pathname.green);
        var ret = handlers[pathname](query, response, postData);
    
        if (ret == 505){
            response.writeHead(505,{'Content-Type':'text/plain'});
            response.write("Oops! Something went wrong on our side. Let me get Pete to fix it up");
            response.end();
        }

        //TODO not actually a 404--invalid creds
        if (ret == 404){
            response.writeHead(404,{'Content-Type':'text/plain'});
            response.write('');
            response.end();
        }

    } else{
        //404 page not found
        console.log('no handler found for path: '.red + pathname.red );
        response.writeHead(404, {'Content-Type':'text/plain'});
        response.write('404 not found');
        response.end();
    }
}

exports.route = route
