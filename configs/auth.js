require('dotenv').config()

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

const auth = (req, res, next) => {

    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
    let apiKey;

    if(req.query.apiKey === undefined) {
        apiKey = req.body.apiKey;
    }else{
        apiKey = req.query.apiKey;
    }

    // if one of the variables are undefined then send 400 status code to the client
    if(apiKey === undefined){
        console.log(`Unauthorized request from IP: ${ip}`);
        return res.sendStatus(400);
    }

    bcrypt.compare(apiKey, process.env.API_KEY).then(function(result) {
        if(result){
            next();
        }else{
            res.sendStatus(401);
            console.log(`Unauthorized request from IP: ${ip}`);
        }
    });
}

module.exports = auth;