const db = require('../configs/db');

const temp = {
    getLastUpdated: (cb) => {
        return db.query("SELECT * FROM tempData ORDER BY id DESC LIMIT 1", cb);
    },
    getLastHour: (cb) => {
        return db.query("SELECT * FROM tempData WHERE id%5=0 ORDER BY id DESC LIMIT 12", cb);
    },
    addTemp: (temp, humidity, cb) => {
        return db.query("INSERT INTO tempData (temperature, humidity) VALUES (?, ?)", [temp, humidity], cb);
    }
}

module.exports = temp;