const db = require('../configs/db');

const voltage = {

    getVoltage: (cb) => {
        return db.query("SELECT * FROM voltageData", cb);
    },
    updateVoltage: (voltage, cb) => {
        return db.query("UPDATE voltageData SET voltage = ? WHERE id = 1", [voltage], cb);
    }
}

module.exports = voltage;