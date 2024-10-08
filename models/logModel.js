const db = require('../configs/db');

const logs = {
    create: (settings, cb) => {
        return db.query("INSERT INTO logs (startTime, endTime, onTime) VALUES (?, ?, ?)", [settings.startTime, settings.endTime, settings.onTime], cb);
    },
    getLastLog: (cb) => {
        return db.query("SELECT * FROM logs ORDER BY id DESC LIMIT 1", cb);
    },
    getLogCount: (cb) => {
        return db.query("SELECT COUNT(id) AS maxCount FROM logs", cb);
    },
    getNAmountOfLogs: function(n, callback){
        return db.query("SELECT * FROM logs ORDER BY id DESC LIMIT ?, 10", [n], callback);
    },
}

module.exports = logs;