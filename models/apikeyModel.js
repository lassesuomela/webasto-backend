const db = require('../configs/db');

const apikey = {
    getByApikey: (key, cb) => {
        return db.query("SELECT * FROM users WHERE apikey = ? LIMIT 1", [key], cb);
    },
    updateApikey: (newKey, oldKey, cb) => {
        return db.query("UPDATE users SET apikey = ? WHERE apikey = ?", [newKey, oldKey], cb);
    }
}

module.exports = apikey;