const express = require('express');
const path = require('path');
const winston = require('winston');
const app = express();
const server = require("http").Server(app);
const host = '0.0.0.0';

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.json(),
        winston.format.colorize({ all: true })
    ),
    level: 'debug',
    transports: [
        new winston.transports.Console()
    ]
});

app.use(express.static(path.join(__dirname, '../build')));
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.use((req, res, next) => {
    next();
});

app.use(function (err, req, res, next) {
    res.status(500).json({ "error": err.message });
});

server.listen(process.env.PORT || 80, host, () => {
    logger.info(`Server running on port ${process.env.PORT || 80}`);
});