/* eslint-disable no-console */
import bodyParser from 'body-parser';
import express from 'express';
import targetPort from './config.js';
import rawDataRoutes from './apis/rawDataAPI';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
app.use('/api/rawData', rawDataRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

/* eslint-disable no-unused-vars */
app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.status || 500);
    res.send({
        message: error.message || 'Internal Server Error',
        code: error.status,
    });
});

app.listen(targetPort, () => {
    console.log(`Listening on ${targetPort}...`);
});
