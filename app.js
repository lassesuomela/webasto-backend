require('dotenv').config()

const express = require('express');

const db = require('./configs/db');
const auth = require('./configs/auth');

const rateLimit = require('express-rate-limit');
const helmet = require("helmet");
const morgan = require("morgan");

const timerRouter = require('./routes/timerRoutes');
const logRouter = require('./routes/logRoutes');
const statusRouter = require('./routes/statusRoutes');

const port = process.env.DOCKER_APP_PORT || 80;

const limiter = rateLimit({
    windowMs: 60 * 1000 * 15, // 15 minutes
    max: 300, // limit each IP to 300 requests per 15 minutes
    headers: false,
    onLimitReached: function(req){
        let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
        console.log(`Rate limit exceeded from IP ${ip}`);
    }
});

let app = express();

app.set('trust proxy', '127.0.0.1');

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(limiter);

app.use(express.static('public'));

app.use(auth);

app.use('/api', timerRouter);
app.use('/api', logRouter);
app.use('/api', statusRouter);

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

// start the server
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

// handle ctrl + c
process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    db.end(function (err) {
        // all connections in the pool have ended
        console.log('Closed all pool connections');
        process.exit();
    });
});