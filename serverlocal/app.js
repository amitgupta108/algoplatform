var https  = require('https');
var express = require('express');
var session = require('express-session');
const fs = require('fs');
const path = require('path');
const { Server } = require("socket.io");

require('console-stamp')(console, '[HH:MM:ss.l]');
var port = 443;

const es = session({secret: '72r5N3K05754+43ek796960QT96Hc8e1', 
        resave: true,
        saveUninitialized: true,});

const app = express();
app.use(express.static('web/'));
app.use(express.json());
app.use(es);

const options = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
};

const httpsServer = https.createServer(options, app);
httpsServer.listen(port, () => {
    console.log(`Server running at https://localhost:${port}/`);
});

const io = new Server(httpsServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    pingInterval: 30000,
    pingTimeout: 30000
});

io.engine.use(es);