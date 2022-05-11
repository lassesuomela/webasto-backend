require('dotenv').config()

let express = require('express');
let mysql = require('mysql');

let https = require('https')
let parseString = require('xml2js').parseString;
let Http2ServerRequest = require('http2');

const rateLimit = require('express-rate-limit');
const helmet = require("helmet");
const morgan = require("morgan");


let app = express();

const port = process.env.DOCKER_APP_PORT || 80;

app.set('trust proxy', '127.0.0.1');

const limiter = rateLimit({
    windowMs: 60 * 1000 * 15, // 15 minute
    max: 300, // limit each IP to 100 requests per windowMs
    headers: false,
    onLimitReached: function(req){
        let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
        console.log(`Rate limit exceeded from IP ${ip}`);
    }
});

app.use(helmet());
app.use(express.json());
app.use(morgan('tiny'));

//app.use(limiter);
// create connection to mysql server
let pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timezone: 'Europe/Helsinki'
});

app.get('/robots.txt', function (req, res) {

    // set 'Connection' header to 'Close'
    res.setHeader('Connection', 'close');

    console.log(req.path);
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /\nX-Robots-Tag: noindex, nofollow");
});

app.get('/getTimers', (req, res) => {

    // set 'Connection' header to 'Close'
    res.setHeader('Connection', 'close');

    console.log(req.path);
    
    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
    let api_key = req.query.api_key;

    let ua = req.get('user-agent');
    console.log(ua);

    if(api_key == process.env.API_KEY){
        console.log(`Authorized access from IP: '${ip}'`);
        // if one of the variables are undefined then send 400 status code to the client
        if(api_key == undefined){
            return res.sendStatus(400).send({message:"One or more variables are undefined"});
        }
            let currentDay = new Date().getDay();
            //let currentDay = 1; // for debugging on weekends
            //console.log(currentDay);
            
            if(currentDay < 1 || currentDay > 5){
                return res.sendStatus(404);
            }
            sql_query = "SELECT * FROM timers WHERE id = ?";
            inserts = [currentDay]
            sql_query = mysql.format(sql_query, inserts);
            //console.log(sql_query);
            
            // attempt to query mysql server with the sql_query 
            pool.query(sql_query, (error, result) =>{
                if (error){
                    // on error log the error to console and send 500 status code to client
                    console.log(error);
                    return res.sendStatus(500);
                };
                //console.log(result);
                if(result.length > 0){

                    let time = result[0].time;
                    let time2 = result[0].time2;
                    let enabled = result[0].enabled;
                    let enabled2 = result[0].enabled2;
                    let onTime = result[0].onTime;

                    let jsonData = JSON.stringify(
                    {
                        "time":time,
                        "time2":time2,
                        "enabled":enabled,
                        "enabled2":enabled2,
                        "onTime":onTime
                    });
                    //console.log(jsonData);
                    return res.status(200).send(jsonData);
                }else{
                    // status not found
                    console.log('Status not set');
                    return res.status(500).send({status:"Status not set"});
                }
            });
            

    }else{
      // if client sends invalid api key then send 401 status code to the client
  
      console.log(`Unauthorized access using API key '${api_key}' from IP: '${ip}'`);
      return res.sendStatus(401);
    }
})

app.post('/updateTimers', (req, res) => {

    // set 'Connection' header to 'Close'
    res.setHeader('Connection', 'close');

    console.log(req.path);
    
    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
    let {api_key} = req.body;

    let ua = req.get('user-agent');
    console.log(ua);
    console.log(req.body);

    if(api_key == process.env.API_KEY){
        console.log(`Authorized access from IP: '${ip}'`);
        // if one of the variables are undefined then send 400 status code to the client
        if(api_key == undefined){
            return res.sendStatus(400).send({message:"One or more variables are undefined"});
        }

        let time, time2, enabled, enabled2, onTime;
        for(let i = 1; i < 6; i++){
            
            time = req.body[i]['time'];
            time2 = req.body[i]['time2'];
            enabled = req.body[i]['enabled'];
            enabled2 = req.body[i]['enabled2'];
            onTime = req.body[i]['onTime'];
            
            sql_query = "UPDATE timers SET time = ?, time2 = ?, enabled = ? , enabled2 = ?, onTime = ? WHERE id = ?";
            inserts = [time, time2, enabled, enabled2, onTime, i]
            sql_query = mysql.format(sql_query, inserts);
            //console.log(sql_query);
            
            // attempt to query mysql server with the sql_query 
            pool.query(sql_query, (error, result) =>{
                if (error){
                    // on error log the error to console and send 500 status code to client
                    console.log(error);
                    return res.sendStatus(500);
                };
            });
            
        }

        return res.sendStatus(200);
            
        
    }else{
      // if client sends invalid api key then send 401 status code to the client
  
      console.log(`Unauthorized access using API key '${api_key}' from IP: '${ip}'`);
      return res.sendStatus(401);
    }
})

app.get('/getStatus/:id', (req, res) =>{

    // set 'Connection' header to 'Close'
    res.setHeader('Connection', 'close');

    console.log(req.path);
    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
    let {api_key} = req.query;
    let id = req.params.id;
    let ua = req.get('user-agent');
    console.log(ua);
    
    if(api_key == process.env.API_KEY){
        console.log(`Authorized access from IP: '${ip}'`);
        // if one of the variables are undefined then send 400 status code to the client
        if(api_key == undefined){
            return res.sendStatus(400).send({message:"One or more variables are undefined"});
        }
        
        sql_query = "SELECT * FROM statusData WHERE id = ?";

        inserts = [id]
        sql_query = mysql.format(sql_query, inserts);
        
        // attempt to query mysql server with the sql_query 
        pool.query(sql_query, (error, result) =>{
            
            if (error){
                // on error log the error to console and send 500 status code to client
                console.log(error);
                return res.sendStatus(500);
            };
            
            // if we found the card we send 200 status code
        
            if(result.length > 0){
                let currentStatus = result[0].status;
                let onTime = result[0].onTime;
                let pulseSent = result[0].pulseSent;
                let timestamp = result[0].timestamp;
                let rssi = result[0].rssi;
 
                console.log(`Status: ${currentStatus} onTime: ${onTime} timestamp: ${timestamp}`);
                return res.status(200).send({
                    "status":currentStatus,
                    "onTime":onTime,
                    "timestamp":timestamp,
                    "pulseSent":pulseSent,
                    "rssi":rssi

                });
            }else{
                // status not found
                console.log('Status not set');
                return res.status(500).send({status:"Status not set"});
            }
        });

    }else{
      // if client sends invalid api key then send 401 status code to the client
  
      console.log(`Unauthorized access using API key '${api_key}' from IP: '${ip}'`);
      return res.sendStatus(401);
    }
})

app.post('/updateStatus/:id', (req, res) =>{

    // set 'Connection' header to 'Close'
    res.setHeader('Connection', 'close');

    console.log(req.path);
    
    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
    let {api_key, newStatus, onTime, pulseSent, rssi} = req.body;
    let id = req.params.id;
    let ua = req.get('user-agent');
    console.log(ua);
    console.log(req.body);
    
    if(pulseSent == 0 && id == 1){ 
        pulseSent = new Date().getSeconds();
    }
    
    if(api_key == process.env.API_KEY){
        console.log(`Authorized access from IP: '${ip}'`);
        // if one of the variables are undefined then send 400 status code to the client
        if(api_key == undefined || newStatus == undefined){
            return res.sendStatus(400).send({message:"One or more variables are undefined"});
        }
        
        sql_query = "UPDATE statusData SET status = ?, onTime = ?, pulseSent = ? , rssi = ? WHERE id = ?";
        inserts = [newStatus, onTime, pulseSent, rssi, id]
        sql_query = mysql.format(sql_query, inserts);
        //console.log(sql_query);
        
        // attempt to query mysql server with the sql_query 
        pool.query(sql_query, (error, result) =>{
            if (error){
                // on error log the error to console and send 500 status code to client
                console.log(error);
                return res.sendStatus(500);
            };
            
            //console.log(`New status: ${newStatus}`);
            return res.sendStatus(200);
        });

    }else{
      // if client sends invalid api key then send 401 status code to the client
  
      console.log(`Unauthorized access using API key '${api_key}' from IP: '${ip}'`);
      return res.sendStatus(401);
    }
})

app.get('/getLocation', (req, res) =>{

    // set 'Connection' header to 'Close'
    res.setHeader('Connection', 'close');

    console.log(req.path);
    
    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;

    let {api_key} = req.query;

    let ua = req.get('user-agent');
    console.log(ua);
    //console.log(req.query);

    if(api_key == process.env.API_KEY){
        console.log(`Authorized access from IP: '${ip}'`);
        // if one of the variables are undefined then send 400 status code to the client
        if(api_key == undefined){
            return res.sendStatus(400).send({message:"One or more variables are undefined"});
        }
        
        sql_query = "SELECT * FROM gpsData ORDER BY id DESC";

        sql_query = mysql.format(sql_query);
        
        // attempt to query mysql server with the sql_query 
        pool.query(sql_query, (error, result) =>{
            if (error){
                // on error log the error to console and send 500 status code to client
                console.log(error);
                return res.sendStatus(500);
            };
            
            // if we found the card we send 200 status code
            //console.log(result[0]);

            if(result.length > 0){
                let lat = result[0].lat;
                let lon = result[0].lng;
                let timestamp = result[0].timestamp;
                let road, house_number, city, postcode;
                
                const options = {
                    hostname: 'nominatim.openstreetmap.org',
                    port: 443,
                    path: `/reverse?lat=${lat}&lon=${lon}`,
                    method: 'GET',
                    headers: { 'User-Agent': 'Mozilla/5.0 GSM ESP32 Tracker' }
                }

                const httpReq = https.request(options, httpRes => {
                    let statusCode = httpRes.statusCode;
                    //console.log(`statusCode: ${statusCode}`)

                    httpRes.on('data', xml => {
                        
                        parseString(xml, function (err, reqResult) {
                            let jsonString = JSON.stringify(reqResult);
                            let locationData = JSON.parse(jsonString);
                            
                            console.log(jsonString);
                            if(statusCode != 200){
                                console.log("Error on OSM reverse API");
                                return res.status(500);
                            }

                            try {
                                let country = locationData["reversegeocode"]["addressparts"][0]["country"][0];
                            } catch (error) {
                                console.log("Coordinates are invalid");
                                return res.status(500);
                            }
                            
                            try{
                                road = locationData["reversegeocode"]["addressparts"][0]["road"][0];
                                house_number = locationData["reversegeocode"]["addressparts"][0]["house_number"][0];
                            } catch (error){
                                console.log(error);
                                return res.status(500);
                            }
                            
                            try {
                                city = locationData["reversegeocode"]["addressparts"][0]["city"][0];
                            } catch (error) {
                                town = locationData["reversegeocode"]["addressparts"][0]["town"][0];
                            }
                            
                            postcode = locationData["reversegeocode"]["addressparts"][0]["postcode"][0];
                            
                            if(city == undefined){
                                city = town;
                            }
                        });

                        let datajson = JSON.stringify(
                            {
                                "road":road,
                                "house_number":house_number,
                                "city":city,
                                "postcode":postcode,
                                "timestamp":timestamp
                            });
                        
                        return res.status(200).send(datajson);
                    })
                    
                    
                })
                
                httpReq.on('error', error => {
                    console.error(error);
                    return res.status(500).send({error:"OSM API ERROR"});
                })

                httpReq.end()
                
            }else{
                // status not found
                console.log('GPS data not found');
                return res.status(500).send({"error":"GPS data not found"});
            }
        });

    }else{
      // if client sends invalid api key then send 401 status code to the client
  
      console.log(`Unauthorized access using API key '${api_key}' from IP: '${ip}'`);
      return res.sendStatus(401);
    }
})

app.post('/updateLocation', (req, res) =>{

    // set 'Connection' header to 'Close'
    res.setHeader('Connection', 'close');

    console.log(req.path);
    // get ip address
    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  
    // get variables from query
    const {api_key, lat, lng, alt, speed, sat} = req.body;
    let sql_query = "";

    let ua = req.get('user-agent');
    console.log(ua);
    console.log(req.body);
  
    // check if client provided api key matches with the servers api key
    if(api_key == process.env.API_KEY){
        // if one of the variables are undefined then send 400 status code to the client
        if(lat == undefined || lng == undefined || alt == undefined || speed == undefined || sat == undefined){
            return res.sendStatus(400);
        }
    
        console.log(req.query);
    
        sql_query = "INSERT INTO gpsData (lat, lng, alt, speed, sat) VALUES (?, ?, ?, ?, ?)";
        let inserts = [lat, lng, alt, speed, sat];
    
        // insert variables into the sql_query string
        sql_query = mysql.format(sql_query, inserts);
    
        // attempt to query mysql server with the sql_query 
        pool.query(sql_query, (error, result) =>{
            if (error){
                // on error log the error to console and send 500 status code to client
                console.log(error.code);
                return res.sendStatus(500);
            };
            // on success send client success code
            // console.log(sql_query);
            // console.log(result);
            console.log("Location data updated");
            res.sendStatus(201);
        });
      
    }else{
      // if client sends invalid api key then send 401 status code to the client
      res.sendStatus(401);
      console.log(`Unauthorized access using API key '${api_key}' from IP ${ip}.`);
    }
});

app.get('/getTemp', (req, res) =>{
    // set 'Connection' header to 'Close'
    res.setHeader('Connection', 'close');

    console.log(req.path);
    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;

    let ua = req.get('user-agent');
    console.log(ua);

    let {api_key} = req.query;
    console.log(req.query);

    if(api_key == process.env.API_KEY){
        console.log(`Authorized access from IP: '${ip}'`);
        // if one of the variables are undefined then send 400 status code to the client
        if(api_key == undefined){
            return res.sendStatus(400).send({message:"One or more variables are undefined"});
        }
        
        sql_query = "SELECT * FROM tempData ORDER BY id DESC LIMIT 1";

        sql_query = mysql.format(sql_query);
        
        // attempt to query mysql server with the sql_query 
        pool.query(sql_query, (error, result) =>{
            if (error){
                // on error log the error to console and send 500 status code to client
                console.log(error);
                return res.sendStatus(500);
            };
            
            // if we found the card we send 200 status code
        
            if(result.length > 0){
                let currentTemp = result[0].currentTemp;
                let currentHum = result[0].humidity;
                console.log(`Temp: ${currentTemp}`);
                return res.status(200).send({
                    "temperature":currentTemp,
                    "humidity":currentHum
                });

            }else{
                // status not found
                console.log('Temperature not found');
                return res.status(500).send({error:"Temperature not found"});
            }
        });

    }else{
      // if client sends invalid api key then send 401 status code to the client
  
      console.log(`Unauthorized access using API key '${api_key}' from IP: '${ip}'`);
      return res.sendStatus(401);
    }
})

app.post('/updateTemp', (req, res) =>{

    // set 'Connection' header to 'Close'
    res.setHeader('Connection', 'close');

    console.log(req.path);
    // get ip address
    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  
    // get variables from query
    const {api_key, temp, hum} = req.body;
    let sql_query = "";

    var ua = req.get('user-agent');
    console.log(ua);
  
    // check if client provided api key matches with the servers api key
    if(api_key == process.env.API_KEY){
        // if temp is undefined then send 400 status code to client client
        if(temp == undefined || hum == undefined){
            return res.sendStatus(400);
        }
    
        console.log(req.body);
    
        sql_query = "INSERT INTO tempData (currentTemp, humidity) VALUES (?, ?)";
        let inserts = [temp, hum];
    
        // insert variables into the sql_query string
        sql_query = mysql.format(sql_query, inserts);
    
        // attempt to query mysql server with the sql_query 
        pool.query(sql_query, (error, result) =>{
            if (error){
            // on error log the error to console and send 500 status code to client
            console.log(error.code);
            return res.sendStatus(500);
            };
            // on success send client success code
            // console.log(sql_query);
            console.log("Temperature and humidity data stored");
            res.sendStatus(201);
        });
      
    }else{
      // if client sends invalid api key then send 401 status code to the client
      res.sendStatus(401);
      console.log(`Unauthorized access using API key '${api_key}' from IP ${ip}.`);
    }
});

app.get('/getVoltage', (req, res) =>{

    // set 'Connection' header to 'Close'
    res.setHeader('Connection', 'close');

    console.log(req.path);
    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;

    let ua = req.get('user-agent');
    console.log(ua);
    let {api_key} = req.query;
    console.log(req.query);

    if(api_key == process.env.API_KEY){
        console.log(`Authorized access from IP: '${ip}'`);
        // if one of the variables are undefined then send 400 status code to the client
        if(api_key == undefined){
            return res.sendStatus(400).send({message:"One or more variables are undefined"});
        }
        
        sql_query = "SELECT * FROM voltageData";

        sql_query = mysql.format(sql_query);
        
        // attempt to query mysql server with the sql_query 
        pool.query(sql_query, (error, result) =>{
            if (error){
                // on error log the error to console and send 500 status code to client
                console.log(error);
                return res.sendStatus(500);
            };
            
            // if we found the card we send 200 status code
        
            if(result.length > 0){
                let currentVoltage = result[0].voltage;
                console.log(`Voltage : ${currentVoltage}`);
                return res.status(200).send({voltage:currentVoltage});
            }else{
                // status not found
                console.log('Voltage not found');
                return res.status(500).send({error:"Voltage not found"});
            }
        });

    }else{
      // if client sends invalid api key then send 401 status code to the client
  
      console.log(`Unauthorized access using API key '${api_key}' from IP: '${ip}'`);
      return res.sendStatus(401);
    }
})

app.post('/updateVoltage', (req, res) =>{

    // set 'Connection' header to 'Close'
    res.setHeader('Connection', 'close');

    console.log(req.path);
    // get ip address
    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  
    let ua = req.get('user-agent');
    console.log(ua);
    
    // get variables from query
    const {api_key, voltage} = req.body;

    let sql_query = "";
  
    // check if client provided api key matches with the servers api key
    if(api_key == process.env.API_KEY){
        // if voltage is undefined then send 400 status code to client client
        if(voltage == undefined){
            return res.sendStatus(400);
        }
    
        console.log(req.body);
    
        sql_query = "UPDATE voltageData SET voltage = ? WHERE id = 1";
        let inserts = [voltage];
    
        // insert variables into the sql_query string
        sql_query = mysql.format(sql_query, inserts);
    
        // attempt to query mysql server with the sql_query 
        pool.query(sql_query, (error, result) =>{
            if (error){
                // on error log the error to console and send 500 status code to client
                console.log(error.code);
                return res.sendStatus(500);
            };
            // on success send client success code
            // console.log(sql_query);
            console.log("Voltage data stored");
            res.sendStatus(201);
        });
      
    }else{
      // if client sends invalid api key then send 401 status code to the client
      res.sendStatus(401);
      console.log(`Unauthorized access using API key '${api_key}' from IP ${ip}.`);
    }
});

app.post('/updateLogs', (req, res) =>{

    // set 'Connection' header to 'Close'
    res.setHeader('Connection', 'close');

    console.log(req.path);
    // get ip address
    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  
    let ua = req.get('user-agent');
    console.log(ua);
    
    // get variables from query
    const {api_key, startTime, endTime, onTime} = req.body;
    let sql_query = "";
  
    // check if client provided api key matches with the servers api key
    if(api_key == process.env.API_KEY){
        // if voltage is undefined then send 400 status code to client client
        if(startTime == undefined || endTime == undefined || onTime == undefined){
            return res.sendStatus(400);
        }
    
        console.log(req.body);
    
        sql_query = "INSERT INTO logs (startTime, endTime, onTime) VALUES (?, ?, ?)";
        var inserts = [startTime, endTime, onTime];
    
        // insert variables into the sql_query string
        sql_query = mysql.format(sql_query, inserts);
    
        // attempt to query mysql server with the sql_query 
        pool.query(sql_query, (error, result) =>{
            if (error){
                // on error log the error to console and send 500 status code to client
                console.log(error);
                return res.sendStatus(500);
            };
            // on success send client success code
            // console.log(sql_query);
            console.log("Logs stored");
            res.sendStatus(201);
        });
      
    }else{
        // if client sends invalid api key then send 401 status code to the client
        res.sendStatus(401);
        console.log(`Unauthorized access using API key '${api_key}' from IP ${ip}.`);
    }
});

app.get('/refreshLogs', (req, res) =>{

    // set 'Connection' header to 'Close'
    res.setHeader('Connection', 'close');

    console.log(req.path);
    let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;

    var ua = req.get('user-agent');
    console.log(ua);
    const {api_key} = req.query;
    console.log(req.query);

    if(api_key == process.env.API_KEY){
        console.log(`Authorized access from IP: '${ip}'`);
        // if one of the variables are undefined then send 400 status code to the client
        if(api_key == undefined){
            return res.sendStatus(400).send({message:"One or more variables are undefined"});
        }
        
        sql_query = "SELECT * FROM logs ORDER BY id DESC LIMIT 1";

        sql_query = mysql.format(sql_query);
        
        // attempt to query mysql server with the sql_query 
        pool.query(sql_query, (error, result) =>{
            if (error){
                // on error log the error to console and send 500 status code to client
                console.log(error);
                return res.sendStatus(500);
            };
            
            // if we found the card we send 200 status code
        
            if(result.length > 0){
                let startTime = result[0].startTime;
                let endTime = result[0].endTime;
                let onTime = result[0].onTime;

                let payload = JSON.stringify(
                {
                    "startTime":startTime,
                    "endTime":endTime,
                    "onTime":onTime
                });
                
                console.log(payload);
                return res.status(200).send(payload);
            }else{
                // status not found
                console.log('Logs not found');
                return res.status(500).send({error:"Logs not found"});
            }
        });

    }else{
      // if client sends invalid api key then send 401 status code to the client
  
      console.log(`Unauthorized access using API key '${api_key}' from IP: '${ip}'`);
      return res.sendStatus(401);
    }
})

// start listening 

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    pool.end(function (err) {
        // all connections in the pool have ended
        console.log('Closed all pool connections');
        process.exit();
    });
});