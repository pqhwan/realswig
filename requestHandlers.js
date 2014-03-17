var fs = require('fs'),
    querystring = require('querystring');


function front(response, postData){
    //for root dir GET request
    //test page transfer
    fs.readFile('html/demopage_final.html', function(err, data){
        response.writeHead(200,{'Content-Type':'text/html'});
        response.write(data);
        response.end();
    });
}

function register(response, postData){
    //for handling form POST upload on registeration
    var parsed = querystring.parse(postData);

    //TODO write into file emails.txt 
    fs.appendFile('signups.txt',JSON.stringify(parsed)+'\n',function(err){
        if (err) throw err;
    });
    fs.appendFile('emails.txt',parsed.email+'\n', function(err){
        if (err) throw err;
    });

    response.writeHead(200,{'Content-Type':'text/plain'});
    response.write("thank you for registering!");
    response.end();
}

exports.front = front;
exports.register = register;
