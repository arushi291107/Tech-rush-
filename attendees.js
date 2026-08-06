const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

// -------------------------------------------------------
// POST /api/attendees/register — Register for an event (Attendee)
// -------------------------------------------------------
router.post('/register', authenticate, authorize('Attendee', 'Organizer', 'Volunteer', 'Admin'), async (req, res) => {
    const { event_id, college_id, department, year, branch, phone, institution } = req.body;

    if (!event_id) {
        return res.status(400).json({ success: false, message: 'event_id is required.' });
    }

    try {
        // Check if event exists and has capacity
        const [events] = await pool.query(
            `SELECT e.*, (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) AS current_count
             FROM events e WHERE e.id = ? AND e.status != 'cancelled'`,
            [event_id]
        );

        if (events.length === 0) {
            return res.status(404).json({ success: false, message: 'Event not found or cancelled.' });
        }

        const event = events[0];

        if (event.current_count >= event.reg_limit) {
            return res.status(409).json({
                success: false,
                message: 'Event is fully booked. Registration limit reached.'
            });
        }

        // Check if already registered
        const [existing] = await pool.query(
            'SELECT id FROM registrations WHERE user_id = ? AND event_id = ?',
            [req.user.id, event_id]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'You are already registered for this event.'
            });
        }

        // Generate unique QR code
        const qr_code = `PLX-${Date.now().toString(36).toUpperCase()}-${uuidv4().split('-')[0].toUpperCase()}`;

        // Insert registration
        const [result] = await pool.query(
            `INSERT INTO registrations
            (user_id, event_id, qr_code, college_id, department, year, branch, phone, institution)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.user.id,
                event_id,
                qr_code,
                college_id || null,
                department || null,
                year || null,
                branch || null,
                phone || null,
                institution || null
            ]
        );

        // Notify user
        await pool.query(
            `INSERT INTO notifications (user_id, title, message, type)
             VALUES (?, ?, ?, ?)`,
            [
                req.user.id,
                'Registration Confirmed!',
                `You are registered for "${event.title}". Your QR Pass: ${qr_code}`,
                'success'
            ]
        );

        res.status(201).json({
            success: true,
            message: `Successfully registered for "${event.title}"!`,
            qr_code,
            registration_id: result.insertId,
            event: {
                title: event.title,
                date: event.date,
                venue: event.venue
            }
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to register for event.'
        });
    }
});


// Get user's passes
router.get('/my-passes', authenticate, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT r.*, e.title AS event_title, e.date, e.venue,
                    e.poster_url, e.status AS event_status
             FROM registrations r
             JOIN events e ON r.event_id = e.id
             WHERE r.user_id = ?
             ORDER BY r.registered_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            passes: rows
        });

    } catch (err) {
        console.error('Get passes error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch passes.'
        });
    }
});


// Get event attendee roster
router.get('/roster/:eventId', authenticate, authorize('Organizer', 'Admin'), async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT r.*, u.name, u.email
             FROM registrations r
             JOIN users u ON r.user_id = u.id
             WHERE r.event_id = ?
             ORDER BY r.registered_at ASC`,
            [req.params.eventId]
        );

        res.json({
            success: true,
            attendees: rows,
            total: rows.length
        });

    } catch (err) {
        console.error('Get roster error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch attendee roster.'
        });
    }
});


// Gate check-in
router.put('/checkin/:qrCode', authenticate, authorize('Organizer', 'Volunteer', 'Admin'), async (req, res) => {
    const { qrCode } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT r.*, u.name, u.email, e.title AS event_title
             FROM registrations r
             JOIN users u ON r.user_id = u.id
             JOIN events e ON r.event_id = e.id
             WHERE r.qr_code = ?`,
            [qrCode]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: '❌ Invalid QR code. Not found in system.'
            });
        }

        const reg = rows[0];

        if (reg.checked_in) {
            return res.status(409).json({
                success: false,
                message: `⚠️ Duplicate scan! ${reg.name} already checked in at ${new Date(reg.check_in_time).toLocaleTimeString()}.`,
                attendee: {
                    name: reg.name,
                    event: reg.event_title,
                    checked_in_at: reg.check_in_time
                }
            });
        }

        await pool.query(
            'UPDATE registrations SET checked_in = TRUE, check_in_time = NOW() WHERE qr_code = ?',
            [qrCode]
        );

        await pool.query(
            'UPDATE registrations SET certificate_issued = TRUE WHERE qr_code = ?',
            [qrCode]
        );

        await pool.query(
            `INSERT INTO notifications (user_id, title, message, type)
             VALUES (?, ?, ?, ?)`,
            [
                reg.user_id,
                'Gate Entry Confirmed!',
                `You have successfully checked in to "${reg.event_title}". Your e-certificate is now available!`,
                'success'
            ]
        );

        res.json({
            success: true,
            message: `✅ ${reg.name} checked in to "${reg.event_title}" successfully!`,
            attendee: {
                name: reg.name,
                email: reg.email,
                event: reg.event_title,
                college_id: reg.college_id,
                department: reg.department
            }
        });

    } catch (err) {
        console.error('Check-in error:', err);
        res.status(500).json({
            success: false,
            message: 'Gate check-in failed.'
        });
    }
});


// Event rating
router.post('/rate', authenticate, authorize('Attendee'), async (req, res) => {
    const { event_id, rating } = req.body;

    if (!event_id || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({
            success: false,
            message: 'event_id and rating (1–5) are required.'
        });
    }

    try {
        const [rows] = await pool.query(
            'SELECT id, checked_in FROM registrations WHERE user_id = ? AND event_id = ?',
            [req.user.id, event_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found.'
            });
        }

        if (!rows[0].checked_in) {
            return res.status(403).json({
                success: false,
                message: 'You must attend the event to rate it.'
            });
        }

        await pool.query(
            'UPDATE registrations SET rating = ? WHERE user_id = ? AND event_id = ?',
            [rating, req.user.id, event_id]
        );

        res.json({
            success: true,
            message: 'Thank you for your rating!'
        });

    } catch (err) {
        console.error('Rate event error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to submit rating.'
        });
    }
});

module.exports = router;
