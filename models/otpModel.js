const db = require('../configs/db');

const otp = {
    getSecretByUsername: (username, cb) => {
        return db.query("SELECT secret FROM users WHERE username = ? LIMIT 1", [username], cb);
    },
    setSecretByUsername: (secret, username, cb) => {
        return db.query("UPDATE users SET secret = ? WHERE username = ?", [secret, username], cb);
    }
}

module.exports = otp;