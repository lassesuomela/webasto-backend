const timer = require('../models/timerModel');

const getCurrentDaysTimer = (req, res) => {

    let currentDay = new Date().getDay();
    //let currentDay = 1; // for debugging on weekends
    
    if(currentDay < 1 || currentDay > 5){
        return res.json({status: "error", error:"Out of scope"});
    }

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

            let jsonData = {
                "time":time,
                "time2":time2,
                "enabled":enabled,
                "enabled2":enabled2,
                "onTime":onTime
            };

            //console.log(jsonData);
            return res.json(jsonData);
        }else{
            // status not found
            return res.status(500).send({status:"error", error:"Timers not found"});
        }
    });
}

const modifyTimers = (req, res) => {

    let time, time2, enabled, enabled2, onTime;

    for(let i = 1; i < 6; i++){
        
        time = req.body[i]['time'];
        time2 = req.body[i]['time2'];
        enabled = req.body[i]['enabled'];
        enabled2 = req.body[i]['enabled2'];
        onTime = req.body[i]['onTime'];

        let tmr = {"time":time, "time2":time2, "enabled":enabled, "enabled2":enabled2, "onTime":onTime, "id":i};

        // attempt to query mysql server with the sql_query 
        timer.updateAll(tmr, (error, result) =>{

            if (error){
                // on error log the error to console and send 500 status code to client
                console.log(error);
                return res.sendStatus(500);
            }
        });
    }

    return res.sendStatus(200);
}

const displayAllTimers = (req, res) => {
    timer.getAll((error, data) => {

        if(error){
            console.log(error);
            return res.sendStatus(500);
        }

        if(data.length > 0){
            res.json(data);
        }
    })
}

module.exports = {
    getCurrentDaysTimer,
    modifyTimers,
    displayAllTimers
}