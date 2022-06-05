const fs = require('fs');
const path = require('path');

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

const getVersion = (req, res) => {
    fs.readFile('./ota/version.txt', (err, value) => {

        if(err) return res.status(500).end();
        
        res.send(value);
    })
}

module.exports = {
    downloadFile,
    getVersion
}