const status = require('../models/statusModel');

const getStatus = (req, res) =>{

    let id = req.params.id;
    // if one of the variables are undefined then send 400 status code to the client
    if(id === undefined){
        return res.sendStatus(400);
    }
    
    // attempt to query mysql server with the sql_query 
    status.getById(id, (error, result) =>{
        
        if (error){
            // on error log the error to console and send 500 status code to client
            console.log(error);
            return res.sendStatus(500);
        }
        
        // if we found the card we send 200 status code
    
        if(result.length > 0){
            let currentStatus = result[0].status;
            let onTime = result[0].onTime;
            let pulseSent = result[0].pulseSent;
            let timestamp = result[0].timestamp;
            let rssi = result[0].rssi;

            return res.status(200).send({
                "status":currentStatus,
                "onTime":onTime,
                "timestamp":timestamp,
                "pulseSent":pulseSent,
                "rssi":rssi

            });
        }else{
            // status not found
            console.log('Status not set');
            return res.status(500).send({status:"Status not set"});
        }
    });
};

const modifyStatus = (req, res) =>{

    let {newStatus, onTime, pulseSent, rssi} = req.body;
    let id = req.params.id;
    
    // if one of the variables are undefined then send 400 status code to the client
    if(newStatus === undefined){
        return res.sendStatus(400);
    }

    if(pulseSent === "0" && id === "1"){ 
        pulseSent = new Date().getSeconds();
    }

    let data = {
        "newStatus": newStatus, "onTime":onTime, "pulseSent":pulseSent, "rssi":rssi
    }
    
    // attempt to query mysql server with the sql_query 
    status.update(data, (error, result) =>{
        if (error){
            // on error log the error to console and send 500 status code to client
            console.log(error);
            return res.sendStatus(500);
        }
        
        //console.log(`New status: ${newStatus}`);
        return res.sendStatus(200);
    });
};

module.exports = {
    getStatus,
    modifyStatus
}