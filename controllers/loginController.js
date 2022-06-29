const bcrypt = require('bcrypt');

const jwt = require('../configs/jwt');

const loginModel = require('../models/loginModel');

const login = (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    // check that the username and password exists
    if(!username || !password){
        return res.json({status:'error', message:'Please fill all fields.'})
    }

    loginModel.getByUsername(username, (err, result) => {

        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }

        // user found
        if(result.length > 0) {

            let orgPassword = result[0].password;
            let id = result[0].id;

            bcrypt.compare(password, orgPassword, (err, result) => {
                if(err){
                    console.log(err);
                    return res.sendStatus(500);
                }

                if(result){
                    // password correct
                    // create jwt token and send it in the response
                    
                    let token = jwt.genToken(username, id);
                    return res.json({status: 'success', message: 'Successfully logged in.', token:token});
                }else{
                    // password incorrect
                    return res.json({status: 'error', message: 'Incorrect username or password.'});
                }
            })
        }else{
            // user not found
            return res.json({status: 'error', message: 'Incorrect username or password.'});
        }
    })
}

module.exports = {
    login
};