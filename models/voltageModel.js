const db = require('../configs/db');

const voltage = {

    getVoltage: (cb) => {
        return db.query("SELECT * FROM voltageData ORDER BY id DESC LIMIT 1", cb);
    },
    getVoltageHour: (cb) => {
        return db.query("SELECT * FROM voltageData WHERE id%5=0 ORDER BY id DESC LIMIT 288", cb);
    },
    addVoltage: (voltage, cb) => {
        return db.query("INSERT INTO voltageData (voltage) VALUES (?)", [voltage], cb);
    }
}

module.exports = voltage;