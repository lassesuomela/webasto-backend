const tempModel = require('../models/tempModel');
const cache = require('../configs/cache');

const getTemperature = (req, res) => {

    // use url as key
    const key = req.originalUrl;

    tempModel.getLastUpdated((error, result) =>{
        if (error){
            // on error log the error to console and send 500 status code to client
            console.log(error);
            return res.sendStatus(500);
        }
        
        if(result.length > 0){
            let temp = result[0].temperature;
            let humi = result[0].humidity;

            let data = {
                status:"success",
                temperature:temp,
                humidity:humi
            }

            // cache data
            cache.saveCache(key, payload);

            return res.json();

        }else{
            // status not found
            console.log('Temperature not found');
            return res.status(500).send({status:"error",error:"Temperature not found"});
        }
    });
}

const getLastHour = (req, res) => {

    // use url as key
    const key = req.originalUrl;

    tempModel.getLastHour((error, result) =>{
        if (error){
            // on error log the error to console and send 500 status code to client
            console.log(error);
            return res.sendStatus(500);
        }
        
        if(result.length > 0){

            let temp = [];
            let humi = [];
            let timestamps = [];

            for (let i = 0; i < result.length; i++){
                temp.push(result[i].temperature);
                humi.push(result[i].humidity);
                timestamps.push(result[i].timestamp);
            }

            let data = {
                status:"success",
                temperatures:temp,
                humidities:humi,
                timestamps:timestamps
            };

            // cache data
            cache.saveCache(key, data);

            return res.json(data);

        }else{
            // temp not found
            console.log('Temperature not found');
            return res.status(500).send({status:"error",error:"Temperature not found"});
        }
    });
}

const addTemperature = (req, res) => {

    // use url as key
    const key = req.originalUrl;

    // remove data from cache
    cache.deleteCache(key);

    const {temp, hum} = req.body;

    // if temp is undefined then send 400 status code to client client
    if(temp === undefined || hum === undefined){
        return res.sendStatus(400);
    }

    tempModel.addTemp(temp, hum, (error, result) =>{
        if (error){
            // on error log the error to console and send 500 status code to client
            console.log(error);
            return res.sendStatus(500);
        }

        // console.log("Temperature and humidity data stored");
        res.sendStatus(201);
    });
}

module.exports = {
    getTemperature,
    getLastHour,
    addTemperature
}