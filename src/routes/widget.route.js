const express = require("express");
const widgetRouter = express.Router();
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

widgetRouter.use((req, res, next) => {
    next();
});

widgetRouter.get("/", (request, response) => {
    try {
        const pool = new Pool(loginData);
        pool.query(`SELECT * FROM widgets WHERE tab_id = ${request.query.tabId} ORDER BY "order" ASC`, (error, result) => {
            response.status(200).json(result.rows);
            pool.end()
        });

    } catch (err) {
        response.status(400).send(err);
    }
});

widgetRouter.post('/addWidget', (request, response) => {
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

widgetRouter.post('/updateWidget', (request, response) => {
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

widgetRouter.post('/deleteWidget', (request, response) => {
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

module.exports = widgetRouter;