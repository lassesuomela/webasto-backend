const jwt = require('jsonwebtoken');

const genToken = (username, id, ip) =>  {
    return jwt.sign({username:username, id:id, ipAddress:ip}, process.env.TOKEN, {expiresIn: '15min'});
}

const verifyToken = (token, cb) => {

    jwt.verify(token, process.env.TOKEN, (err, result) => {

        cb(err, result);
    })
}

module.exports = {genToken, verifyToken};