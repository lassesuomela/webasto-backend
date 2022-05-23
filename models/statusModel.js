const db = require('../configs/db') ;

const status = {
    getById: (id, cb) => {
        return db.query("SELECT * FROM statusData WHERE id = ?", [id], cb);
    },
    update: (data, cb) => {
        return db.query("UPDATE statusData SET status = ?, onTime = ?, pulseSent = ? , rssi = ? , timestamp = DATE_FORMAT(current_timestamp(), '%d.%c.%Y %H:%i') WHERE id = ?", [data.newStatus, data.onTime, data.pulseSent, data.rssi, data.id], cb);
    }
}

module.exports = status;
