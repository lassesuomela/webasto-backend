const bcrypt = require('bcrypt');

const jwt = require('../configs/jwt');

const loginModel = require('../models/loginModel');
const historyController = require('../controllers/historyController');

const login = (req, res) => {

    let ua = req.header('user-agent');

    let username = req.body.username;
    let password = req.body.password;

    let ip = (req.header('x-forwarded-for') || req.socket.remoteAddress).split(', ')[0];

    // check that the username and password exists
    if(!username || !password){
        return res.json({status:'error', message:'Täytä kaikki kentät.'})
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
                    
                    let token = jwt.genToken(username, id, ip, req.hasOTPConfigured);

                    req.user = username;
                    req.id = id;
                    req.ip = ip;

                    // create history record if success on logon

                    historyController.createRecord('Kirjautuminen onnistui.', ip, id, ua, (error, result) => {
                        if(error){
                            console.log(error);
                        }
                        return res.json({status: 'success', message: 'Kirjautuminen onnistui.', token:token});

                    })

                }else{
                    // password incorrect
                    // create history record if failed on logon

                    historyController.createRecord('Kirjautuminen epäonnistui.', ip, id, ua, (error, result) => {
                        if(error){
                            console.log(error);
                        }
                        return res.json({status: 'error', message: 'Väärä käyttäjänimi tai salasana.'});

                    })
                }
            })
        }else{
            // user not found
            return res.json({status: 'error', message: 'Väärä käyttäjänimi tai salasana.'});
        }
    })
}

module.exports = {
    login
};
