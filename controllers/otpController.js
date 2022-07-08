const twofactor = require("node-2fa");
const otp = require("../models/otpModel");

const createSecret = (req, res) => {

    // gen new secret
    const newSecret = twofactor.generateSecret({name: "Webaston ohjain", account: req.jwtUsername});

    // save secret to db
    otp.setSecretByUsername(newSecret.secret, req.jwtUsername, (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500);
        }

        res.json({secret: newSecret})
    })
}

const deleteSecret = (req, res) => {

    let otpCode = req.body.otp;

    // fetch secret based on username
    otp.getSecretByUsername(req.jwtUsername, (err, result) => {

        if(err) {
            console.log(err);
            return res.status(500);
        }

        let verify = twofactor.verifyToken(result[0].secret, otpCode);

        if(verify === null){
            return res.status(401).json({status:"error",message:"Väärä OTP koodi"});
        }else if(verify.delta === 0){

            // save null as secret to db
            otp.setSecretByUsername(null, req.jwtUsername, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(500);
                }

                res.json({status:"success",message:"OTP poistettu käytöstä"});
            })

            return res.json({status:"success",message:"OTP koodi hyväksytty"});
        }else{
            return res.status(401).json({status:"error",message:"Vanha OTP koodi"});
        }
    })
}

const createOTPCode = (req, res) => {

    // fetch secret from db based on username
    otp.getSecretByUsername(req.jwtUsername, (err, result) => {

        if(err) {
            console.log(err);
            return res.status(500);
        }

        if(result.length > 0){
            res.json({status:"success",message:"OTP koodi generoitu onnistuneesti"})
        }else{
            res.json({status:"error",message:"OTP:tä ei ole alustettu"})
        }
    })
}

const verifyToken = (req, res) => {
    let otpCode = req.body.otp;

    // fetch secret based on username
    otp.getSecretByUsername(req.jwtUsername, (err, result) => {

        if(err) {
            console.log(err);
            return res.status(500);
        }

        let verify = twofactor.verifyToken(result[0].secret, otpCode);

        if(verify === null){
            return res.status(401).json({status:"error",message:"Väärä OTP koodi"});
        }else if(verify.delta === 0){
            return res.json({status:"success",message:"OTP koodi hyväksytty"});
        }else{
            return res.status(401).json({status:"error",message:"Vanha OTP koodi"});
        }
    })
}

module.exports = {
    createSecret,
    deleteSecret,
    createOTPCode,
    verifyToken
}