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

const updateVoltage = (req, res) => {

    const {voltage} = req.body;

    // if voltage is undefined then send 400 status code to client client
    if(voltage === undefined){
        return res.sendStatus(400);
    }

    voltageModel.updateVoltage(voltage, (error, result) =>{
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
    updateVoltage
}