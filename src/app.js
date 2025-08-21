const express = require('express');
const indexRouter = require('./routes');

const app = express();

app.use('/', indexRouter);

module.exports = app;
