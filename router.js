var colors = require('colors');

function route(handlers, pathname, response){
    console.log('about to route a reqeust for ' + pathname);
    if(typeof(handlers[pathname]) == 'function'){
        //handler found
        handlers[pathname](response);

    } else{
        //404 page not found
        console.log('no handler found for path: '.red + pathname.red );
        response.writeHead(404, {'Content-Type':'text/plain'});
        response.write('404 not found');
        response.end();
    }
}

exports.route = route
