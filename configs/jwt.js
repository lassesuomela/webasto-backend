const jwt = require('jsonwebtoken');

const genToken = (username, id) =>  {
    return jwt.sign({username:username, id:id}, process.env.TOKEN, {expiresIn: '15min'});
}

const verifyToken = (token, cb) => {

    jwt.verify(token, process.env.TOKEN, (err, result) => {

        cb(err, result);
    })
}

module.exports = {genToken, verifyToken};