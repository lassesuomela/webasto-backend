const logs = require('../models/logModel');
const cache = require('../configs/cache');

const updateLogs = (req, res) => {

    // use url as key
    const key = req.originalUrl;
    cache.deleteCache(key);

    // get variables from query
    const {onTime} = req.body;
  
    // if ontime is undefined then send 400 status code to client client
    if(onTime === undefined){
        return res.sendStatus(400);
    }

    // dont allow onTime to be 0 as there is no point on storing that data
    if(onTime === 0 || onTime === "0"){
        return res.sendStatus(400);
    }

    const endTime = new Date();
    let startTime = new Date();

    startTime.setMinutes(endTime.getMinutes() - onTime);

    const settings = {"startTime": startTime.toLocaleTimeString("fi", { hour: "2-digit", minute: "2-digit", second: "2-digit"}), "endTime": endTime.toLocaleTimeString("fi", { hour: "2-digit", minute: "2-digit", second: "2-digit"}), "onTime": onTime};

    // attempt to query mysql server with the sql_query 
    logs.create(settings, (error, result) =>{
        if (error){
            // on error log the error to console and send 500 status code to client
            console.log(error);
            return res.sendStatus(500);
        }

        // on success send client success code
        res.sendStatus(201);
    });
}

const fetchLastLog = (req, res) => {

    // use url as key
    const key = req.originalUrl;

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

            let data = {status:"success", data:payload}

            cache.saveCache(key, data);
            
            return res.json(data);
        }else{
            // status not found
            return res.json({status:"error",error:"Logs not found"});
        }
    });
}

const fetchNLog = (req, res) => {

    // use url as key
    const key = req.originalUrl;

    if(!req.params.page){
        return res.json({status:"error",message:"Please fill all fields."});
    }

    // how many logs per page we want to show in the exe
    let perPageCount = 10; 
    let maxLogCount = 0;
    let currentPage = 0;
    let maxPage = 0;

    logs.getLogCount((error, result) => {
        if(error) {
            console.log(error);
            return res.sendStatus(500);
        }

        if(result.length === 0) {
            res.json({status:"error",message:"No logs found."});
        }

        maxLogCount = result[0].maxCount;

        maxPage = Math.ceil(maxLogCount/perPageCount); 

        if(req.params.page <= 0 || req.params.page > maxPage){
            return res.json({status:"error",message:"Page number out of scope"});
        }

        currentPage = (req.params.page - 1) * perPageCount;
                
        logs.getNAmountOfLogs(currentPage, (error, result) =>{
            if(error){
                return res.json(error);
            }

            if(result.length > 0){
                let data = {status:"success", maxPageAmount: maxPage, data:result}
                
                cache.saveCache(key, data);
                
                res.json(data);
            }else{
                res.json({status:"error",message:"No logs found."});
            }
        })
    })
}

module.exports = {
    updateLogs,
    fetchLastLog,
    fetchNLog
}