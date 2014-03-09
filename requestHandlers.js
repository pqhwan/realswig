var fs = require('fs');


function front(response){
    //for root dir GET request
    console.log('front route done');
    //test page transfer
    fs.readFile('html/demopage2.html', function(err, data){
        response.writeHead(200,{'Content-Type':'text/html'});
        response.write(data);
        response.end();
    });

}

function register(response){
    //for handling form POST upload on registeration
    console.log('handling registration');

    response.writeHead(200,{'Content-Type':'text/plain'});
    response.write("thank you for registering!");
    response.end();
    

}

exports.front = front;
exports.register = register;
