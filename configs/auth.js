require('dotenv').config()

const bcrypt = require('bcrypt');
const geoIp = require('geoip-lite');

const jwt = require('./jwt');

const apikeyModel = require('../models/apikeyModel');
const historyController = require('../controllers/historyController');

const auth = (req, res, next) => {
    let ua = req.header('user-agent');

    req.ua = ua;

    if(process.env.NODE_ENV === 'dev') {
        console.log(req.headers);
        console.log(req.body);
    }

    let ip = (req.header('x-forwarded-for') || req.socket.remoteAddress).split(', ')[0];

    let ipData = geoIp.lookup(ip);
    
    if(process.env.NODE_ENV !== 'dev') {
        if(ipData === null){
            console.log(`No GEO IP data found for IP: ${ip}`);
            return res.sendStatus(403);
        }
    }

    // get the apikey from the authorization header
    let apiKey = req.headers.authorization;
    
    if(process.env.NODE_ENV !== 'dev') {
        if(ipData.country !== 'FI') {
            console.log(`Wrong country: ${ipData.country}\nFrom IP: ${ip}`);
            console.log('Using API key = ' + apiKey);
            return res.sendStatus(403);
        }
    }

    // if one of the variables are undefined then send 400 status code to the client
    if(apiKey === undefined || apiKey.split(' ')[1] === undefined){
        console.log(`API key not found. Unauthorized request from IP: ${ip}`);
        return res.sendStatus(400);
    }

    // remove 'bearer' word from apikey and compare it to the .env api key
    let token = apiKey.split(' ')[1];

    apikeyModel.getByApikey(token, (error, result) => {

        if(error) {
            console.log(error);
        }
        // found match for the apikey in the db
        if(result.length > 0){

            historyController.createRecord('API avaimella tunnistauduttu.', ip, result[0].id, req.ua, (error, result) => {
                if(error){
                    console.log(error);
                }
    
                next();
            })

        }else{
            // if it doesnt match apikey then try to match to jwt token
            jwt.verifyToken(token, (error, result) => {

                // if token is valid then proceed
                if(result) {

                    req.jwtIp = result.ipAddress;
                    req.jwtId = result.id;
                    req.jwtUsername = result.username;
                    req.jwtOTP = result.OTP;

                    // check if ip has changed and error out

                    if (req.jwtIp !== ip){
                        return res.status(403).json({status:"error", message:"Current IP address doesn't match JWT token signed IP address"});
                    }

                    // allow all GET requests
                    if(req.method === 'GET'){
                        next();
                    }else if(req.url === "/ota/upload" || req.url === "/api/secret" || req.url === "/api/token" || req.url === "/api/secret/remove") { // allow requests to /ota/upload endpoint
                        next();
                    }else{
                        // show forbidden for other endpoints 
                        return res.status(403).json({status:"error",message:"Authentication not allowed for this type of request"});
                    }
                }else{
                    // else error out
                    console.log(`Unauthorized request from IP: ${ip}`);
                    res.sendStatus(401);
                }
            });
        }
    })
};

module.exports = auth;
