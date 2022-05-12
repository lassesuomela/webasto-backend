const express = require('express');
const app = express();

const auth = (req, res, next) => {

    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
    let apiKey = undefined;

    if(req.query.apiKey === undefined) {
        apiKey = req.body.apiKey;
    }else{
        apiKey = req.query.apiKey;
    }

    // if one of the variables are undefined then send 400 status code to the client
    if(apiKey === undefined){
        return res.sendStatus(400);
    }

    if(apiKey === process.env.API_KEY){
        next();
    }else{
        res.sendStatus(401);
        console.log(`Unauthorized request from IP: ${ip}`);
    }
}

module.exports = auth;