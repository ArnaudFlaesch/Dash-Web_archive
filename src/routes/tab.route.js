const express = require("express");
const tabRouter = express.Router();
const { Pool } = require('pg');
const winston = require('winston');

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

tabRouter.use((req, res, next) => {
    next();
});

tabRouter.get("/", (request, response) => {
    try {
        const pool = new Pool(loginData);
        pool.query('SELECT * FROM tabs ORDER BY "order" ASC', (error, result) => {
            response.status(200).json(result.rows);
            pool.end()
        });

    } catch (err) {
        response.status(400).send(err);
    }
});

tabRouter.post('/addTab', (request, response) => {
    try {
        const pool = new Pool(loginData);
        const sql = `INSERT INTO public.tab(label, order) VALUES (${request.body.label}, ORDER) RETURNING *`;
        pool.query(sql, (error, result) => {
            response.status(200).json(result.rows[0]);
            pool.end()
        });
    } catch (err) {
        response.status(400).send(err);
    }
});

module.exports = tabRouter;