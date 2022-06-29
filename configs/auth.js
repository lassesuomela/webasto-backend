require('dotenv').config()

const bcrypt = require('bcrypt');
const geoIp = require('geoip-lite');

const jwt = require('./jwt');

const auth = (req, res, next) => {

    if(process.env.ENV === 'dev') {
        console.log(req.headers);
    }

    let ip = (req.header('x-forwarded-for') || req.socket.remoteAddress).split(', ')[0];

    let ipData = geoIp.lookup(ip);
    
    if(ipData === null){
        console.log(`No GEO IP data found for IP: ${ip}`);
        return res.sendStatus(403);
    }

    // get the apikey from the authorization header
    let apiKey = req.headers.authorization;
    
    
    if(ipData.country !== 'FI') {
        console.log(`Wrong country: ${ipData.country}\nFrom IP: ${ip}`);
        console.log('Using API key = ' + apiKey);
        return res.sendStatus(403);
    }

    // if one of the variables are undefined then send 400 status code to the client
    if(apiKey === undefined || apiKey.split(' ')[1] === undefined){
        console.log(`API key not found. Unauthorized request from IP: ${ip}`);
        return res.sendStatus(400);
    }

    // remove 'bearer' word from apikey and compare it to the .env api key
    let token = apiKey.split(' ')[1];

    bcrypt.compare(token, process.env.API_KEY).then(function(result) {

        // check if token matches to apikey
        if(result){
            next();
        }else{
            // if it doesnt mathc apikey then try to match to jwt token
            jwt.verifyToken(token, (error, result) => {
                
                // if token matches then go forwards
                if(result) {
                    next();
                }else{
                    // else error out
                    console.log(`Unauthorized request from IP: ${ip}`);
                    res.sendStatus(401);
                }
            });
        }
    });
};

module.exports = auth;
