const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

const corsOptions = {
    origin: 'http://127.0.0.1:90',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

// Start server
const PORT =  3000;
app.listen(PORT, () => {
    console.log(`Gateway service running on port http://localhost:${PORT}`);
});