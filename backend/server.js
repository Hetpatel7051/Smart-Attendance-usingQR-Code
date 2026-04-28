const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// API ENDPOINTS
// ==========================================

// 0. Login Mock
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT id, full_name, role, password_hash FROM users WHERE email = ?';
    db.get(sql, [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: "User not found" });

        if (password === user.password_hash) {
            res.json({ data: { id: user.id, full_name: user.full_name, role: user.role } });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});

// 0b. Signup
app.post('/api/signup', (req, res) => {
    const { full_name, email, password, role } = req.body;
    if (!full_name || !email || !password || !role) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const userId = role + '-' + Date.now();
    const sql = 'INSERT INTO users (id, full_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [userId, full_name, email, password, role], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ error: "Email already exists" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ success: true, data: { id: userId, full_name: full_name, role } });
    });
});

// 1. Get all students
app.get('/api/users/students', (req, res) => {
    const sql = "SELECT id, full_name, email FROM users WHERE role = 'student'";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

// 2. Get active classes and their current teacher
app.get('/api/classes', (req, res) => {
    const sql = `
        SELECT c.id, c.course_name, c.course_code, u.full_name as teacher_name 
        FROM classes c 
        JOIN users u ON c.teacher_id = u.id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

// 2b. Create a Class
app.post('/api/classes', (req, res) => {
    const { course_name, course_code, teacher_id } = req.body;
    const classId = 'class-' + Date.now();
    const sql = 'INSERT INTO classes (id, course_name, course_code, teacher_id) VALUES (?, ?, ?, ?)';
    db.run(sql, [classId, course_name, course_code, teacher_id], function(err) {
         if (err) return res.status(500).json({ error: err.message });
         res.status(201).json({ success: true, id: classId });
    });
});

// 2c. Get Active Sessions
app.get('/api/sessions/active', (req, res) => {
    const sql = `
        SELECT s.id, s.class_id, s.start_time, s.dynamic_qr_token, c.course_name 
        FROM sessions s 
        JOIN classes c ON s.class_id = c.id 
        WHERE s.is_active = TRUE
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

// 2d. Start a Session
app.post('/api/sessions', (req, res) => {
    const { class_id } = req.body;
    const sessionId = 'session-' + Date.now();
    const qrToken = 'QR-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const sql = `
        INSERT INTO sessions (id, class_id, start_time, end_time, dynamic_qr_token, is_active) 
        VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, TRUE)
    `;
    db.run(sql, [sessionId, class_id, qrToken], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ success: true, id: sessionId, qrToken: qrToken });
    });
});

// 2e. Get Attendance for a Session
app.get('/api/attendance/:sessionId', (req, res) => {
    const sql = `
        SELECT a.id, a.scan_time, a.status, u.full_name, u.email 
        FROM attendance a 
        JOIN users u ON a.student_id = u.id 
        WHERE a.session_id = ?
    `;
    db.all(sql, [req.params.sessionId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

// 2f. Get Attendance Stats
app.get('/api/stats/attendance', (req, res) => {
    const sql = `
        SELECT c.course_code as name, COUNT(a.id) as attendance 
        FROM classes c 
        LEFT JOIN sessions s ON c.id = s.class_id 
        LEFT JOIN attendance a ON s.id = a.session_id 
        GROUP BY c.course_code 
        ORDER BY c.course_code ASC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

// 3. Mark Attendance (The QR Scan Endpoint)
app.post('/api/attendance', (req, res) => {
    const { studentId, qrToken, latitude, longitude } = req.body;
    
    const findSessionSql = 'SELECT * FROM sessions WHERE dynamic_qr_token = ? AND is_active = TRUE';
    db.get(findSessionSql, [qrToken], (err, session) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!session) return res.status(404).json({ error: "Invalid or expired QR Code" });

        const attendanceId = 'att-' + Date.now();
        const insertAttSql = `
            INSERT INTO attendance (id, session_id, student_id, scan_time, status, location_lat, location_long) 
            VALUES (?, ?, ?, CURRENT_TIMESTAMP, 'Present', ?, ?)
        `;
        db.run(insertAttSql, [attendanceId, session.id, studentId, latitude, longitude], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: "Attendance already recorded" });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                success: true,
                message: "Attendance recorded successfully!",
                attendance_id: attendanceId
            });
        });
    });
});

// ==========================================
// FRONTEND SERVING (MUST BE HERE AT THE BOTTOM)
// ==========================================

const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});