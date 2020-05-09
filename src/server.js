const express = require('express');
const cors = require('cors')
const path = require('path');
const app = express();
const { Pool } = require('pg');

app.use(cors())
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
        const sql = `INSERT INTO public.widgets(type, data) VALUES (${type}, '{ "url": ${request.url} }')`;
        pool.query(sql, (error, result) => {
            response.status(200).send(result);
            pool.end()
        });

    } catch (err) {
        response.status(400).send(err);
    }
});

app.listen(process.env.PORT || 9000);