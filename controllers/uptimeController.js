const uptime = require('../models/uptimeModel');
const cache = require('../configs/cache');

const get7 = (req, res) => {

    // use url as key
    const key = req.originalUrl;

    uptime.getLast7((error, result) => {
        if(error) {
            console.log(error);
            return res.sendStatus(500);
        }

        if(result.length > 0) {

            let data = {status:"success",data:result};

            // cache data
            cache.saveCache(key, data);

            res.json(data)
        }else{
            res.json({status:"error",message:"No uptime data found."})
        }

    })
}

const add = (req, res) => {

    // use url as key
    const key = req.originalUrl;

    // delete cached data
    cache.deleteCache(key);

    let uptimeValue = req.body.uptimeValue;
    let date = req.body.date;

    if(uptimeValue === undefined || date === undefined) {
        return res.json({status:"error",message:"Incomplete body"})
    }

    uptime.add(uptimeValue, date, (error, result) => {
        if(error) {
            console.log(error);
            return res.sendStatus(500);
        }

        res.sendStatus(200);
    });
}

module.exports = {
    get7,
    add
}