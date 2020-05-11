const express = require('express');
const cors = require('cors')
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const { Pool } = require('pg');

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const loginData = (process.env.DATABASE_URL) ? {
    connectionString: process.env.DATABASE_URL,
    ssl: true
} : {
    database: 'dash',
    host: 'localhost',
    password: 'postgres',
    port: 5432,
    user: 'postgres'
};

app.get("/db", (request, response) => {
    try {
        const pool = new Pool(loginData);
        pool.query('SELECT * FROM widgets', (error, result) => {
            response.status(200).send(result.rows);
            pool.end()
        });

    } catch (err) {
        response.status(400).send(err);
    }
});

app.post('/db/newWidget', (request, response) => {
    try {
        const pool = new Pool(loginData);
        const type = 2;
        const sql = `INSERT INTO public.widgets(type, data) VALUES (${type}, '{ "url": "${request.body.url}" }')`;
        pool.query(sql, (error, result) => {
            response.status(200).send(result);
            pool.end()
        });

    } catch (err) {
        response.status(400).send(err);
    }
});

app.listen(process.env.PORT || 9000);


/**********
 * CORS ANYWHERE
 */

// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.CORS_PORT || 8090;

var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});