const history = require('../models/historyModel');

const createRecord = (action, ip, id, ua, cb) => {

    history.create(action, ip, id, ua, (err, result) => {
        cb(err, result);
    })
}

const fetchNHistoryRecord = (req, res) => {

    if(!req.params.page){
        return res.json({status:"error",message:"Please fill all fields."});
    }

    // how many logs per page we want to show in the exe
    let perPageCount = 10; 
    let maxRecordCount = 0;
    let currentPage = 0;
    let maxPage = 0;

    history.getMaxCount(req.jwtId, (error, result) => {
        if(error) {
            console.log(error);
            return res.sendStatus(500);
        }

        if(result.length === 0) {
            res.json({status:"error",message:"No history records found for this account."});
        }

        maxRecordCount = result[0].maxCount;

        maxPage = Math.ceil(maxRecordCount/perPageCount); 

        if(req.params.page <= 0 || req.params.page > maxPage){
            return res.json({status:"error",message:"Page number out of scope"});
        }

        currentPage = (req.params.page - 1) * perPageCount;
                
        history.getNAmountOfHistory(currentPage, req.jwtId, (error, result) =>{
            if(error){
                return res.json(error);
            }

            if(result.length > 0){
                let data = {status:"success", maxPageAmount: maxPage, data:result}
                
                res.json(data);
            }else{
                res.json({status:"error",message:"No history records found for this account."});
            }
        })
    })
}

module.exports = {
    createRecord,
    fetchNHistoryRecord
}
