var fs = require('fs'),
    querystring = require('querystring'),
    pg = require('pg');

//TODO WARNING--keep this out
var dbconn = process.env.DATABASE_URL || "postgres://nodetest:bigswigmoney@localhost/nodetest";

var emailRegex = /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/;

function front(response, postData){
    //for root dir GET request
    //test page transfer
    fs.readFile('html/demopage_responsive.html', function(err, data){
        response.writeHead(200,{'Content-Type':'text/html'});
        response.write(data);
        response.end();
    });
}

function register(response, postData){
    //for handling form POST upload on registeration
    var parsed = querystring.parse(postData);
    //{email, courier, sender, zipcode, (boston, nyc, philly, balt, dc), frequency}
    console.log(parsed);
    parsed.frequuncy

    //validate email
    var email = parsed.email;
    if(!(email.length) || !emailRegex.test(email)){
        response.writeHead(404,{'Content-Type':'text/plain'});
        response.write("there was a problem with your registration!");
        response.end();
        return;
    }
    
    //validate zipcode
    var zipcode = parsed.zipcode;
    if(!zipcode.length || zipcode.length > 9 || !(/^\d+$/.test(zipcode))){
        response.writeHead(404,{'Content-Type':'text/plain'});
        response.write("there was a problem with you registration!");
        response.end();
        return;
    }
    
    //compute role binary-style [courier, sender]
    var role = 0;
    if(parsed.courier) role+=1;
    if(parsed.sender) role+=2;
  
    //make sure parsed.frequency is a number 
    if(isNaN(parseInt(parsed.frequency))){
        parsed.frequency='0';
    }
 
    //store it  in db
    pg.connect(dbconn,function(err,client,done){
        if(err){
            return console.error('error fetching client from pool',error);
        }

        //connection good!
        client.query({
            text:'insert into emails values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
            values:[parsed.email,
                    parsed.zipcode,
                    role,
                    parsed.boston? true:false,
                    parsed.nyc? true:false,
                    parsed.philly? true:false,
                    parsed.balt? true:false,
                    parsed.dc? true:false,
                    parseInt(parsed.frequency),
                    false
            ]
        });
    });

    response.writeHead(200,{'Content-Type':'text/plain'});
    response.write("thank you for registering!");
    response.end();
}

exports.front = front;
exports.register = register;
