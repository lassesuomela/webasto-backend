const db = require('../configs/db') ;

const uptime = {
    getLast7: (cb) => {
        return db.query("SELECT * FROM uptime ORDER BY id DESC LIMIT 7", cb);
    },
    add: (uptime, date, cb) => {
        return db.query("INSERT INTO uptime (uptime, date) VALUES (?, ?)", [uptime, date], cb);
    }
}

module.exports = uptime;