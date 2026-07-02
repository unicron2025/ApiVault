require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./src/config/db');
const apiroutes = require('./src/routes/api.routes');
const authroutes = require('./src/routes/auth.routes');

connectDB();

const app = express();      // ← FIRST create the app

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', authroutes);
app.use('/api/apis', apiroutes);

module.exports = app;