var fs = require('fs'),
    querystring = require('querystring'),
    pg = require('pg'),
    nodemailer = require('nodemailer');
    hogan = require('hogan.js'),
    crypto = require('crypto');


/*--------------------------globals--------------------------------*/

//TODO WARNING--contains password
//detects whether we're on heroku or local
var dbconn = process.env.DATABASE_URL || "postgres://nodetest:bigswigmoney@localhost/nodetest";

//email validation regex
var emailRegex = /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/;

//precompiled registration email
var confirmationEmail = hogan.compile(fs.readFileSync('html/confirmation_email.html').toString());

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
}

/*-------------------------routes---------------------------*/

function front(query, response, postData){
    //for root dir GET request
    //test page transfer
    fs.readFile('html/demopage_responsive.html', function(err, data){
        response.writeHead(200,{'Content-Type':'text/html'});
        response.write(data);
        response.end();
    });
}

function thanks(query, response, postData){
    fs.readFile('html/thank_you.html', function(err,data){
        response.writeHead(200,{'Content-Type':'text/html'});
        response.write(data);
        response.end();
    });
}

function confirmed(query, response, postData){
    //you can hash their email address and put it in the confirmation email
    //TODO is there any security threats?
    var hash = querystring.parse(query).id;
   
    //TODO must check if hash is valid

    //TODO actually mark it confirmed in the DB
    pg.connect(dbconn,function(err,client,done){
        if(err) return console.err('postgresql err',err);
        confirmRegistration(client, hash);
    });

    //respond
    fs.readFile('html/confirmed.html', function(err,data){
        response.writeHead(200,{'Content-Type':'text/html'});
        response.write(data);
        response.end();
    });
}

function register(query, response, postData){
    //for handling form POST upload on registeration
    var parsed = querystring.parse(postData);

    //validate fields
    if(!validate(parsed)){
        //TODO not actually a 404
        return 404;
    }

    //hash email + zipcode with md5
    parsed.hash = crypto.createHash('md5').update(parsed.email+parsed.zipcode).digest('hex');

    //store it in db
    pg.connect(dbconn,function(err,client,done){
        if(err){
            console.error('error fetching client from pool',error);
            return 505;
        }
        storeRegistration(client,parsed);
    });

    //set mail option
    mailOptions.to = parsed.email;
    mailOptions.html = confirmationEmail.render({hash:parsed.hash});

    //TODO don't assume that the transport is open
    smtpTransport.sendMail(mailOptions,function(err,response){
        if(err){
            console.error('nodemailer error', err);
            return 505;
        }
    });

    //TODO redirect users to something a bit more useful
    response.writeHead(302,{'Location':'thanks'});
    response.write("Thank you for registering!");
    response.end();
    return 200;
}


/*------------------helper functions-----------------*/


//TODO response to invalid request needs to be more articulate than a 404
function validate(parsed){
    //validate email
    var email = parsed.email;
    
    if(!(email.length) || !emailRegex.test(email)){
       return false;
    }
    
    //validate zipcode
    var zipcode = parsed.zipcode;
    if(!zipcode.length || zipcode.length > 9 || !(/^\d+$/.test(zipcode))){
       return false;
    }
 
    //make sure parsed.frequency is a number 
    //TODO WARNING: execution of this code implies
    //malicious user--probably better to shut down
    //completely than partially
    if(isNaN(parseInt(parsed.frequency))){
       //parsed.frequency='0';
        return false;
    }

    return true;
}


function confirmRegistration(client, hash){
    console.log(hash);
    client.query({
        text:'UPDATE emails SET confirmed=true WHERE hash=$1',
        values:[hash]
    }, function(err,result){
        //TODO what could go wrong?    
        //no such entry
        //already confirmed
        if(err) console.error('postgresql error', err);
    });
}

function storeRegistration(client,parsed){
    //compute role binary-style [courier, sender]
    var role = 0;
    if(parsed.courier) role+=1;
    if(parsed.sender) role+=2;
 
    //connection good!
    client.query({
        text:'insert into emails values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
        values:[parsed.email,
                parsed.zipcode,
                parsed.hash,
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
exports.thanks = thanks;
exports.confirmed = confirmed;
