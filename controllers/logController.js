const logs = require('../models/logModel');

const updateLogs = (req, res) => {

    // get variables from query
    const {startTime, endTime, onTime} = req.body;
  
    // if voltage is undefined then send 400 status code to client client
    if(startTime === undefined || endTime === undefined || onTime === undefined){
        return res.sendStatus(400);
    }

    let settings = {"startTime": startTime, "endTime": endTime, "onTime": onTime};

    // attempt to query mysql server with the sql_query 
    logs.create(settings, (error, result) =>{
        if (error){
            // on error log the error to console and send 500 status code to client
            console.log(error);
            return res.sendStatus(500);
        }

        // on success send client success code
        console.log("Logs created");
        res.sendStatus(201);
    });
}

const fetchLastLog = (req, res) => {

    logs.getLastLog((error, result) =>{
        if (error){
            // on error log the error to console and send 500 status code to client
            console.log(error);
            return res.sendStatus(500);
        }
        
        if(result.length > 0){
            let startTime = result[0].startTime;
            let endTime = result[0].endTime;
            let onTime = result[0].onTime;
            let timestamp = result[0].timestamp;

            let payload = {
                "startTime":startTime,
                "endTime":endTime,
                "onTime":onTime,
                "timestamp":timestamp
            };
            
            return res.json({status:"success", data:payload});
        }else{
            // status not found
            console.log('Logs not found');
            return res.json({status:"error",error:"Logs not found"});
        }
    });
}

module.exports = {
    updateLogs,
    fetchLastLog
}