const db = require('../configs/db');

const history = {
    create: (action, ip, users_id, ua, cb) => {
        return db.query("DELETE FROM history WHERE timestamp < (NOW() - INTERVAL 1 DAY) AND users_id = ?; INSERT INTO history (action, ip, users_id, userAgent) VALUES (?, ?, ?, ?)", [users_id, action, ip, users_id, ua], cb);
    },
    getMaxCount: (id, cb) => {
        return db.query("SELECT COUNT(id) AS maxCount FROM history WHERE users_id = ?", [id], cb);
    },
    getNAmountOfHistory: (n, id, cb) =>{
        return db.query("SELECT * FROM history WHERE users_id = ? ORDER BY id DESC LIMIT ?, 10", [id, n], cb);
    },
}

module.exports = history;
