const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');

// Load env vars (using default or .env file)
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = socketIo(server, {
    cors: {
        origin: '*', // For MVP, allow all origins
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    
    // Simulate real-time IoT soil data
    const interval = setInterval(() => {
        const soilData = {
            moisture: Math.floor(Math.random() * (80 - 20 + 1) + 20), // 20% to 80%
            temperature: Math.floor(Math.random() * (35 - 15 + 1) + 15), // 15C to 35C
            pH: (Math.random() * (8.0 - 5.5) + 5.5).toFixed(1) // 5.5 to 8.0
        };
        socket.emit('soilData', soilData);
        
        // Smart alerts logic
        if (soilData.moisture < 30) {
            socket.emit('smartAlert', { type: 'warning', message: 'Low soil moisture! Irrigation recommended.' });
        }
    }, 5000); // Emits every 5 seconds

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        clearInterval(interval);
    });
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Route files
const auth = require('./routes/authRoutes');

// Mount routers
app.use('/api/auth', auth);

// Add Dummy AI Chat route
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    let reply = "I am a smart farming assistant. How can I help you today?";
    
    // Primitive rule-based mock
    const lower = message.toLowerCase();
    if (lower.includes('weather') || lower.includes('rain')) {
        reply = "Based on current weather trends, expect light rain tomorrow. Avoid spraying pesticides.";
    } else if (lower.includes('disease') || lower.includes('pest')) {
        reply = "For pest control, consider neem oil or contact your local agricultural extension for specific chemical recommendations based on the pest image.";
    } else if (lower.includes('crop') || lower.includes('grow')) {
        reply = "With current soil conditions (pH 6.5) and upcoming weather, Wheat or Mustard are promising choices for the Rabi season.";
    }

    // Delay response slightly to simulate AI
    setTimeout(() => {
        res.json({ reply });
    }, 1000);
});

// Error handling basic
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
