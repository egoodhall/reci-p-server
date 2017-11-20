import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import api from './api';

const PORT = 8080;

const app = express();

app.use(bodyParser.json());

// Enable api
app.use('/api', api);

app.listen(PORT);
console.log('App listening on localhost:8080');
