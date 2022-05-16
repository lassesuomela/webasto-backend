const db = require('../configs/db');

const temp = {
    getLastUpdated: (cb) => {
        return db.query("SELECT * FROM tempData WHERE id = 1", cb);
    },
    updateTemp: (temp, humidity, cb) => {
        return db.query("UPDATE tempData SET temperature = ?, humidity = ? WHERE id = 1", [temp, humidity], cb);
    }
}

module.exports = temp;