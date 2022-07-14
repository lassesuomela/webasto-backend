const voltageModel = require('../models/voltageModel');
const cache = require('../configs/cache');

const getVoltage = (req, res) => {

    // use url as key
    const key = req.originalUrl;

    voltageModel.getVoltage((error, result) =>{
        if (error){
            // on error log the error to console and send 500 status code to client
            console.log(error);
            return res.sendStatus(500);
        }
        
        if(result.length > 0){
            let currentVoltage = result[0].voltage;

            let data = {status:"success",voltage:currentVoltage};
            // cache data
            cache.saveCache(key, data);

            return res.json(data);
        }else{
            // voltage data not found
            console.log('Voltage not found');
            return res.json({status:"error",error:"Voltage not found"});
        }
    });
}

const getVoltageLastHour = (req, res) => {

    // use url as key
    const key = req.originalUrl;

    voltageModel.getVoltageHour((error, result) =>{
        if (error){
            // on error log the error to console and send 500 status code to client
            console.log(error);
            return res.sendStatus(500);
        }
        
        if(result.length > 0){

            let voltage = [];
            let timestamps = [];

            for (let i = 0; i < result.length; i++){
                voltage.push(result[i].voltage);
                timestamps.push(result[i].timestamp);
            }

            let data = {
                status:"success",
                voltages:voltage,
                timestamps:timestamps
            };

            // cache data
            cache.saveCache(key, jsonData);

            return res.json(data);

        }else{
            // voltage data not found
            console.log('Temperature not found');
            return res.status(500).send({status:"error",error:"Voltage not found"});
        }
    });
}

const addVoltage = (req, res) => {

    // use url as key
    const key = req.originalUrl;

    // delete cached data
    cache.deleteCache(key);

    const {voltage} = req.body;

    // if voltage is undefined then send 400 status code to client client
    if(voltage === undefined){
        return res.sendStatus(400);
    }

    voltageModel.addVoltage(voltage, (error, result) =>{
        if (error){
            // on error log the error to console and send 500 status code to client
            console.log(error);
            return res.sendStatus(500);
        }

        res.sendStatus(201);
    });
}

module.exports = {
    getVoltage,
    getVoltageLastHour,
    addVoltage
}