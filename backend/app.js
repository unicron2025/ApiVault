require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./src/config/db');
const apiroutes = require('./src/routes/api.routes');
const authroutes = require('./src/routes/auth.routes');

connectDB();

const app = express();      // ← FIRST create the app

app.use(cors({
    origin: "http://localhost:5174",
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', authroutes);
app.use('/api/apis', apiroutes);

module.exports = app;