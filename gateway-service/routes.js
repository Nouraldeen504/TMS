const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = 'dev_secret_key_change_in_production';

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        
        req.userId = decoded.sub;
        next();
    });
}

// Authentication Routes
router.post('/auth/register', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:5000/auth/register', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Gateway error' });
    }
});

router.post('/auth/login', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:5000/auth/login', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Gateway error' });
    }
});

// Task Routes
router.post('/tasks', verifyToken, async (req, res) => {
    try {
        const response = await axios.post('http://localhost:8080/tasks', req.body, {
            headers: { 'Authorization': req.headers['authorization'] }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Gateway error' });
    }
});

router.get('/tasks', verifyToken, async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8080/tasks', {
            headers: { 'Authorization': req.headers['authorization'] }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Gateway error' });
    }
});

router.put('/tasks/:id/complete', verifyToken, async (req, res) => {
    try {
        const response = await axios.put(`http://localhost:8080/tasks/${req.params.id}/complete`, {}, {
            headers: { 'Authorization': req.headers['authorization'] }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Gateway error' });
    }
});

module.exports = router;