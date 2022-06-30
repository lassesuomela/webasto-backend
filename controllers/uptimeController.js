const uptime = require('../models/uptimeModel');

const get7 = (req, res) => {
    uptime.getLast7((error, result) => {
        if(error) {
            console.log(error);
            return res.sendStatus(500);
        }

        if(result.length > 0) {
            res.json({status:"success",data:result})
        }else{
            res.json({status:"error",message:"No uptime data found."})
        }

    })
}

const add = (req, res) => {

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