const tempModel = require('../models/tempModel');

const getTemperature = (req, res) => {

    tempModel.getLastUpdated((error, result) =>{
        if (error){
            // on error log the error to console and send 500 status code to client
            console.log(error);
            return res.sendStatus(500);
        }
        
        if(result.length > 0){
            let temp = result[0].temperature;
            let humi = result[0].humidity;

            return res.json({
                status:"success",
                temperature:temp,
                humidity:humi
            });

        }else{
            // status not found
            console.log('Temperature not found');
            return res.status(500).send({status:"error",error:"Temperature not found"});
        }
    });
}

const updateTemperature = (req, res) => {
    const {temp, hum} = req.body;

    // if temp is undefined then send 400 status code to client client
    if(temp === undefined || hum === undefined){
        return res.sendStatus(400);
    }

    tempModel.updateTemp(temp, hum, (error, result) =>{
        if (error){
            // on error log the error to console and send 500 status code to client
            console.log(error);
            return res.sendStatus(500);
        }

        console.log("Temperature and humidity data stored");
        res.sendStatus(201);
    });
}

module.exports = {
    getTemperature,
    updateTemperature
}