var fs = require('fs'),
    querystring = require('querystring'),
    pg = require('pg'),
    nodemailer = require('nodemailer');
    //hogan = require('hogan.js'); don't need it for now


/*--------------------------globals--------------------------------*/

//TODO WARNING--contains password
//detects whether we're on heroku or local
var dbconn = process.env.DATABASE_URL || "postgres://nodetest:bigswigmoney@localhost/nodetest";

//email validation regex
var emailRegex = /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/;

//precompiled registration email

//make smtp transport object
//TODO WARNING--contains critical credentials
var smtpTransport = nodemailer.createTransport('SES',{
    AWSAccessKeyID: 'AKIAIX2NFN5QVP54FWNQ',
    AWSSecretKey: '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'
});

//Default mailOption
var mailOptions = {
    //options
    generateTextFromHTML:true,
    forceEmbeddedImages:true,

    //envelope
    from:'swiggly <registration@swiggly.org>',
    //to: target email
    subject: 'Welcome to Swiggly!',

    //contents
    html: fs.readFileSync('html/registration.html').toString()
}

/*-------------------------routes---------------------------*/

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

    //parsed fields:
    //{email, courier, sender, zipcode, boston, nyc, philly, balt, dc, frequency}
    if(!validate(parsed, response)) return false;

    //store it in db
    pg.connect(dbconn,function(err,client,done){
        storeRegistration(err,client,done,parsed);
    });

    //set mail option
    mailOptions.to = parsed.email;
    //send
    smtpTransport.sendMail(mailOptions,function(error,response){
        if(error) console.error('nodemailer problem', error);
    });

    //TODO redirect users to something a bit more useful
    response.writeHead(200,{'Content-Type':'text/plain'});
    response.write("thank you for registering!");
    response.end();
}


/*------------------helper functions-----------------*/


//TODO response to invalid request needs to be more articulate than a 404
function validate(parsed, response){
    //validate email
    var email = parsed.email;
    if(!(email.length) || !emailRegex.test(email)){
        response.writeHead(404,{'Content-Type':'text/plain'});
        response.write("there was a problem with your registration.");
        response.end();
        return false;
    }
    
    //validate zipcode
    var zipcode = parsed.zipcode;
    if(!zipcode.length || zipcode.length > 9 || !(/^\d+$/.test(zipcode))){
        response.writeHead(404,{'Content-Type':'text/plain'});
        response.write("there was a problem with you registration.");
        response.end();
        return false;
    }
 
    //make sure parsed.frequency is a number 
    //TODO WARNING: execution of this code implies
    //malicious user--probably better to shut down
    //completely than partially
    if(isNaN(parseInt(parsed.frequency))){
        response.writeHead(404,{'Content-Type':'text/plain'});
        response.write("there was a problem with you registration.");
        response.end();
        //parsed.frequency='0';
        return false;
    }

    return true;
}

function storeRegistration(err,client,done,parsed){
    if(err){
        return console.error('error fetching client from pool',error);
    }

    //compute role binary-style [courier, sender]
    var role = 0;
    if(parsed.courier) role+=1;
    if(parsed.sender) role+=2;
 
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
    }, function(err,result){
        //TODO identify possible error types and take appropriate measures: 
        //violation of unique constraint on email
        //violation of not null constraint on 
        //TODO respond appropriately... do we need response passed down all the way
        //here?
        if(err)console.error('pgsql error',err);
    });
}



exports.front = front;
exports.register = register;
