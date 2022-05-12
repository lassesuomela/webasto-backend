const db = require('../configs/db') ;

const timers = {
    getById: (id, cb) => {
        return db.query("SELECT * FROM timers WHERE id = ?", [id], cb);
    },
    updateAll: (timer, cb) => {
        return db.query("UPDATE timers SET time = ?, time2 = ?, enabled = ? , enabled2 = ?, onTime = ? WHERE id = ?", [timer.time, timer.time2, timer.enabled, timer.enabled2, timer.onTime, timer.id], cb);
    }
}

module.exports = timers;