const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const winston = require('winston');
const app = express();
const server = require("http").Server(app);
const defaultRouter = express.Router();
const tabRouter = require("./routes/tab.route");
const widgetRouter = require("./routes/widget.route");

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

app.use(cors());
app.use(express.static(path.join(__dirname, '../build')));
app.use(express.json())

app.use('/', defaultRouter);
app.use("/tab", tabRouter);
app.use("/widget", widgetRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

defaultRouter.use((req, res, next) => {
    next();
});

app.get("/proxy", (request, response) => {
    const url = request.query.url;
    axios.get(encodeURI(url), {
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            }
        })
        .then((result) => {
            response.status(200).send(result.data);
        })
        .catch((error) => {
            response.status(400).send(error);
        })
});

server.listen(process.env.REACT_APP_BACKEND_PORT || 80, () => {
    logger.info(`Server running on port ${process.env.REACT_APP_BACKEND_PORT || 80}`);
});