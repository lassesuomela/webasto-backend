const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cache = require('../configs/cache');

const historyController = require('../controllers/historyController');

const storages = multer.diskStorage({

    destination: 'ota/',
    filename: function (req, file, cb) {

        // valid mimes that match valid extensions
        let mimes = {'application/octet-stream':'bin', 'text/plain':'txt'};

        // get the file extension
        let fileExt = mimes[file.mimetype];

        let finalName = file.originalname.split(fileExt)[0] + fileExt;

        cb(null, finalName)
    }
})

const upload = multer(
    {
        storage: storages,
        limits: {
            // 1MB file size limit
            fileSize: 1024 * 1024 * 1
        },
        fileFilter(req, file, cb) {
            // valid mimes that match valid extensions
            let mimes = {'application/octet-stream':'bin', 'text/plain':'txt'};

            // get the file extension
            let fileExt = mimes[file.mimetype];

            if(!fileExt){
                // return error if mimetype is not in ext list
                return cb("Filetype not allowed: " + file.mimetype, false);
            }

            // else return undefined error
            cb(undefined, true);
        }
    }
).single('file');

const uploadFile = (req, res) => {

    if(!req.jwtUsername === "demo"){

        historyController.createRecord('Demo käyttäjä yritti ladata tiedoston.', req.jwtIp, req.jwtId, req.ua, (error, result) => {
            if(error){
                console.log(error);
            }

            res.status(200).end();
        })

        return res.json({status:"error", message:"Tämä käyttäjä ei tähän toimintoon pysty"});
    }

    if(!req.jwtOTP){
        return res.json({status:"error", message:"OTP pitää olla konfiguroitu"});
    }
    
    upload(req,res, (err) => {

        // check if file is not found 

        if(!req.file){
            return res.json({status:"error", message:"File not found"});
        }
        
        // return out if multer error
        if(err){
            return res.json({status:"error", message:err});
        }

        // move .bin files to binaries folder
        if(req.file.mimetype === 'application/octet-stream'){
            fs.rename('./ota/' + req.file.filename, './ota/binaries/' + req.file.filename, (err) => {
                if(err){
                    console.log(err);
                    return res.status(500).end();
                }
            });
        }

        historyController.createRecord('Tiedosto ladattu.', req.jwtIp, req.jwtId, req.ua, (error, result) => {
            if(error){
                console.log(error);
            }

            res.status(200).end();
        })
    })
}

const getVersion = (req, res) => {

    // use url as key
    const key = req.originalUrl;

    if(!fs.existsSync('./ota/version.txt')){
        return res.json({status:"error", message:"Versio tiedostoa ei löytynyt"});
    }

    let stats = fs.statSync('./ota/version.txt');

    if(stats.size > 10) {
        return res.send({status:"error", message:"File size too large"});
    }

    fs.readFile('./ota/version.txt', (err, versionValue) => {

        if(err) return res.status(500).end();

        fs.readdir('./ota/binaries', (err, files) => {

            let fileName;
    
            if(err){
                console.log(err);
            }
    
            files.forEach(file => {
                if(path.extname(file) === '.bin'){
                    fileName = file;
                }
            })
    
            if(typeof fileName !== "undefined"){

                let payload = {
                    status:"success",
                    version:versionValue.toString(),
                    link:"/ota/" + fileName
                };

                cache.saveCache(key, payload);

                res.json(payload);
            }else{
                res.json({
                    status:"error",
                    message:"Binääri tiedostoa ei löytynyt"
                });
            }
        })
    })
}

module.exports = {
    uploadFile,
    getVersion
}
