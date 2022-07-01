const voltageModel = require('../models/voltageModel');

const getVoltage = (req, res) => {

    voltageModel.getVoltage((error, result) =>{
        if (error){
            // on error log the error to console and send 500 status code to client
            console.log(error);
            return res.sendStatus(500);
        }
        
        if(result.length > 0){
            let currentVoltage = result[0].voltage;
            return res.json({status:"success",voltage:currentVoltage});
        }else{
            // voltage data not found
            console.log('Voltage not found');
            return res.json({status:"error",error:"Voltage not found"});
        }
    });
}

const getVoltageLastHour = (req, res) => {

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

            return res.json({
                status:"success",
                voltages:voltage,
                timestamps:timestamps
            });

        }else{
            // voltage data not found
            console.log('Temperature not found');
            return res.status(500).send({status:"error",error:"Voltage not found"});
        }
    });
}

const addVoltage = (req, res) => {

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