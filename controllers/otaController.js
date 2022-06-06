const fs = require('fs');
const path = require('path');
const multer = require('multer');

const downloadFile = (req, res) => {
    
    res.setHeader('Connection', 'Close');

    fs.readdir('./ota', (err, files) => {

        let fileName;

        if(err){
            console.log(err);
        }

        files.forEach(file => {
            if(path.extname(file) === '.bin'){
                fileName = file;
            }
        })

        if(fileName !== undefined){
            return res.download('./ota/' + fileName);
        }else{
            res.status(500).end();
        }
    })
}

const storage = multer.diskStorage({

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
        storage: storage,
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

    upload(req,res, (err) => {

        // check if file is not found 

        if(!req.file){
            return res.json({status:"error", message:"File not found"});
        }
        
        // return out if multer error
        if(err){
            return res.json({status:"error", message:err});
        }

        res.status(200).end();
    })
}

const getVersion = (req, res) => {

    let stats = fs.statSync('./ota/version.txt');

    if(stats.size > 10) {
        return res.send({status:"error", message:"File size too large"});
    }
    fs.readFile('./ota/version.txt', (err, value) => {

        if(err) return res.status(500).end();
        
        res.json({status:"success",version:value.toString()});
    })
}

module.exports = {
    downloadFile,
    uploadFile,
    getVersion
}