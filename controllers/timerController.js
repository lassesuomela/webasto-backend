const timer = require('../models/timerModel');

const getCurrentDaysTimer = (req, res) => {
    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
    let apiKey = req.query.api_key;

    // if one of the variables are undefined then send 400 status code to the client
    if(apiKey === undefined){
        return res.sendStatus(400).send({message:"One or more variables are undefined"});
    }

    if(apiKey === process.env.API_KEY){
        
        let currentDay = new Date().getDay();
        //let currentDay = 1; // for debugging on weekends
        //console.log(currentDay);
        
        if(currentDay < 1 || currentDay > 5){
            return res.sendStatus(404);
        }

        // attempt to query mysql server with the sql_query 
        timer.getById(currentDay, (error, result) =>{
            if (error){
                // on error log the error to console and send 500 status code to client
                console.log(error);
                return res.sendStatus(500);
            }

            //console.log(result);
            if(result.length > 0){

                let time = result[0].time;
                let time2 = result[0].time2;
                let enabled = result[0].enabled;
                let enabled2 = result[0].enabled2;
                let onTime = result[0].onTime;

                let jsonData = JSON.stringify(
                {
                    "time":time,
                    "time2":time2,
                    "enabled":enabled,
                    "enabled2":enabled2,
                    "onTime":onTime
                });

                //console.log(jsonData);
                return res.status(200).send(jsonData);
            }else{
                // status not found
                console.log('Status not set');
                return res.status(500).send({status:"Status not set"});
            }
        });

    }else{
        // if client sends invalid api key then send 401 status code to the client

        console.log(`Unauthorized access using API key '${apiKey}' from IP: '${ip}'`);
        return res.sendStatus(401);
    }
}

const modifyTimers = (req, res) => {
    
    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
    let {apiKey} = req.body;

    // if one of the variables are undefined then send 400 status code to the client
    if(apiKey === undefined){
        return res.sendStatus(400).send({message:"One or more variables are undefined"});
    }

    if(apiKey === process.env.API_KEY){
        console.log(`Authorized access from IP: '${ip}'`);

        let time, time2, enabled, enabled2, onTime;
        for(let i = 1; i < 6; i++){
            
            time = req.body[i]['time'];
            time2 = req.body[i]['time2'];
            enabled = req.body[i]['enabled'];
            enabled2 = req.body[i]['enabled2'];
            onTime = req.body[i]['onTime'];

            let tmr = {"time":time, "time2":time2, "enabled":enabled, "enabled2":enabled2, "onTime":onTime, "id":i};
            console.log(tmr);
            // attempt to query mysql server with the sql_query 
            timer.updateAll(tmr, (error, result) =>{
                if (error){
                    // on error log the error to console and send 500 status code to client
                    console.log(error);
                    return res.sendStatus(500);
                };
            });
        }

        return res.sendStatus(200);
        
    }else{
        // if client sends invalid api key then send 401 status code to the client

        console.log(`Unauthorized access using API key '${apiKey}' from IP: '${ip}'`);
        return res.sendStatus(401);
    }
}

module.exports = {
    getCurrentDaysTimer,
    modifyTimers
}