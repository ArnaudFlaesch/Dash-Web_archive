const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const winston = require('winston');
const app = express();

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

app.get("/db", (request, response) => {
    try {
        const pool = new Pool(loginData);
        pool.query('SELECT * FROM widgets', (error, result) => {
            response.status(200).json(result.rows);
            pool.end()
        });

    } catch (err) {
        response.status(400).send(err);
    }
});

app.post('/db/addWidget', (request, response) => {
    try {
        const pool = new Pool(loginData);
        const sql = `INSERT INTO public.widgets(type) VALUES (${request.body.type}) RETURNING *`;
        pool.query(sql, (error, result) => {
            response.status(200).json(result.rows[0]);
            pool.end()
        });
    } catch (err) {
        response.status(400).send(err);
    }
});

app.post('/db/newWidget', (request, response) => {
    try {
        const pool = new Pool(loginData);
        const sql = `INSERT INTO public.widgets(type, data) VALUES (${request.body.type}, to_json('${JSON.stringify(request.body.data)}'::json))`;
        pool.query(sql, (error, result) => {
            response.status(200).json(result);
            pool.end()
        });
    } catch (err) {
        response.status(400).send(err);
    }
});

app.post('/db/updateWidget', (request, response) => {
    try {
        const pool = new Pool(loginData);
        const sql = `UPDATE public.widgets SET data=to_json('${JSON.stringify(request.body.data)}'::json) WHERE id = ${request.body.id}`;
        pool.query(sql, (error, result) => {
            response.status(200).json(result);
            pool.end()
        });
    } catch (err) {
        response.status(400).send(err);
    }
});

app.post('/db/deleteWidget', (request, response) => {
    try {
        const pool = new Pool(loginData);
        const sql = `DELETE FROM public.widgets WHERE id = ${request.body.id}`;
        pool.query(sql, (error, result) => {
            response.status(200).json(result);
            pool.end()
        });
    } catch (err) {
        response.status(400).send(err);
    }
});

app.listen(process.env.PORT || 80, () => {
    logger.info(`Server running on port ${process.env.PORT || 80}`);
});