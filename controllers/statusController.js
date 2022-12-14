const status = require('../models/statusModel');
const cache = require('../configs/cache');

const getStatus = (req, res) =>{

    // use url as key
    const key = req.originalUrl;

    let id = req.params.id;
    // if one of the variables are undefined then send 400 status code to the client
    if(id === undefined){
        return res.sendStatus(400);
    }
    
    status.getById(id, (error, result) =>{
        
        if (error){
            // on error log the error to console and send 500 status code to client
            console.log(error);
            return res.sendStatus(500);
        }
        
        if(result.length > 0){
            let currentStatus = result[0].status;
            let onTime = result[0].onTime;
            let pulseSent = result[0].pulseSent;
            let timestamp = result[0].timestamp;
            let rssi = result[0].rssi;

            let data = {
                "status":currentStatus,
                "onTime":onTime,
                "timestamp":timestamp,
                "pulseSent":pulseSent,
                "rssi":rssi
            };

            // cache data
            cache.saveCache(key, data);

            return res.json(data);
        }else{
            // status not found
            console.log('Status not set');
            return res.status(500).send({status:"Status not set"});
        }
    });
};

const modifyStatus = (req, res) =>{

    // use url as key
    const key = req.originalUrl;
    cache.deleteCache(key);

    console.log("Body: " + req.body)
    let {newStatus, onTime, pulseSent, rssi} = req.body;
    let id = req.params.id;
    
    // if one of the variables are undefined then send 400 status code to the client
    if(newStatus === undefined || onTime === undefined || pulseSent === undefined || rssi === undefined){
        return res.sendStatus(400);
    }

    if(pulseSent === "0" && id === "1"){ 
        pulseSent = new Date().getSeconds();
    }

    if(onTime > 60){
        return res.json({status:"error", message:"onTime value is too large"});
    }

    const data = {
        "newStatus": newStatus, "onTime":onTime, "pulseSent":pulseSent, "rssi":rssi, "id":id
    }

    console.log("Data: " + data)
    
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