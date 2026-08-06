require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// -------------------------------------------------------
// Initialize Express App
// -------------------------------------------------------
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// -------------------------------------------------------
// Middleware
// -------------------------------------------------------
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// -------------------------------------------------------
// Socket.io — Real-time notifications & gate scan updates
// -------------------------------------------------------
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_ORIGIN || '*',
        methods: ['GET', 'POST']
    }
});

// Make io accessible inside routes via req.io
app.use((req, res, next) => {
    req.io = io;
    next();
});

io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join a personal room for targeted notifications
    socket.on('join', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`👤 User ${userId} joined their room`);
    });

    // Gate scan broadcast (for organizer dashboard live updates)
    socket.on('gate-scan', (data) => {
        io.emit('gate-scan-update', data); // Broadcast to all connected clients
    });

    socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });
});

// -------------------------------------------------------
// API Routes
// -------------------------------------------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/attendees', require('./routes/attendees'));
app.use('/api/admin', require('./routes/admin'));

// -------------------------------------------------------
// Health Check Route
// -------------------------------------------------------
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: '🚀 Plannerix Backend is running!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// -------------------------------------------------------
// Catch-all: Serve frontend for SPA routes
// -------------------------------------------------------
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// -------------------------------------------------------
// Global Error Handler
// -------------------------------------------------------
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'An unexpected server error occurred.'
    });
});

// -------------------------------------------------------
// Start Server
// -------------------------------------------------------
server.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║   🎯 Plannerix Backend Server                  ║');
    console.log(`║   🌐 Running at: http://localhost:${PORT}            ║`);
    console.log('║   📡 Socket.io: enabled (real-time)              ║');
    console.log('║   🗄️  Database: MySQL                             ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log('');
    console.log('📋 Available API Endpoints:');
    console.log('   POST   /api/auth/signup');
    console.log('   POST   /api/auth/login');
    console.log('   POST   /api/auth/forgot');
    console.log('   GET    /api/events');
    console.log('   POST   /api/events');
    console.log('   PUT    /api/events/:id');
    console.log('   DELETE /api/events/:id');
    console.log('   GET    /api/volunteers');
    console.log('   POST   /api/volunteers');
    console.log('   PUT    /api/volunteers/:id/respond');
    console.log('   PUT    /api/volunteers/:id/task/:taskId');
    console.log('   POST   /api/attendees/register');
    console.log('   GET    /api/attendees/my-passes');
    console.log('   PUT    /api/attendees/checkin/:qrCode');
    console.log('   GET    /api/admin/users');
    console.log('   GET    /api/admin/stats');
    console.log('');
});

module.exports = { app, server, io };
