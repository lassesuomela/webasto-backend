require('dotenv').config()

const express = require('express');

const db = require('./configs/db');
const auth = require('./configs/auth');
const cors = require('cors');

const rateLimit = require('express-rate-limit');
const helmet = require("helmet");
const morgan = require("morgan");

const timerRouter = require('./routes/timerRoutes');
const logRouter = require('./routes/logRoutes');
const statusRouter = require('./routes/statusRoutes');
const tempRouter = require('./routes/tempRoutes');
const voltageRouter = require('./routes/voltageRoutes');
const otaRoutes = require('./routes/otaRoutes');
const loginRoutes = require('./routes/loginRoutes');

const port = process.env.DOCKER_APP_PORT || 8081;

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

app.use(cors());
app.options('*', cors());

app.set('trust proxy', '127.0.0.1');

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(limiter);

app.use(express.static('public'));

app.use('/api', loginRoutes);

app.use(auth);

app.use(express.static('ota/binaries'));

app.use('/api', timerRouter);
app.use('/api', logRouter);
app.use('/api', statusRouter);
app.use('/api', tempRouter);
app.use('/api', voltageRouter);
app.use('/ota', otaRoutes);

// start the server
app.listen(port, "0.0.0.0", () => {
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