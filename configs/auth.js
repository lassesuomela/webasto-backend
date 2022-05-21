require('dotenv').config()

const bcrypt = require('bcrypt');
const geoIp = require('geoip-lite');

const auth = (req, res, next) => {

    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;

    let ipData = geoIp.lookup(ip);

    if(ipData === null){
        console.log(`No GEO IP data found for IP: ${ip}`);
        return res.sendStatus(403);
    }

    if(ipData.country !== 'FI') {
        console.log(`Wrong country: ${ipData.country}`);
        console.log(`From IP: ${ip}`);
        return res.sendStatus(403);
    }

    // get the apikey from the authorization header
    let apiKey = req.headers.authorization;

    // if one of the variables are undefined then send 400 status code to the client
    if(apiKey === undefined || apiKey.split(' ')[1] === undefined){
        console.log(apiKey);
        console.log(`Unauthorized request from IP: ${ip}`);
        return res.sendStatus(400);
    }

    // remove 'bearer' word from apikey and compare it to the .env api key
    bcrypt.compare(apiKey.split(' ')[1], process.env.API_KEY).then(function(result) {
        if(result){
            next();
        }else{
            res.sendStatus(401);
            console.log(`Unauthorized request from IP: ${ip}`);
        }
    });
}

module.exports = auth;