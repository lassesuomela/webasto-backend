const db = require('../configs/db');

const login = {
    getByUsername: (username, cb) => {
        return db.query("SELECT * FROM users WHERE username = ? LIMIT 1", [username], cb);
    }
}

module.exports = login;