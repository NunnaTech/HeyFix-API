
// // Setup app dependencies
const functions = require('firebase-functions');
const express = require('express');
const app = express(); //create ExpressJS app


// Automatically allow cross-origin requests
const cors = require('cors');
app.use(cors({ origin: true }));

// Routes
app.use(require('./routes/categories'));

exports.app = functions.https.onRequest(app)