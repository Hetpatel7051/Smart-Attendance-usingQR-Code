-- ==============================================================================
-- Smart Attendance System - SQL Database Schema (MySQL/PostgreSQL compatible)
-- ==============================================================================

-- 1. USERS TABLE
-- Stores both Teachers and Students to simplify authentication.
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,          -- UUID string
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,             -- 'admin', 'teacher', or 'student'
    qr_identifier VARCHAR(255) UNIQUE,     -- Unique hash if using static student IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CLASSES TABLE
-- Represents courses/subjects created by Teachers.
CREATE TABLE classes (
    id VARCHAR(36) PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,     -- e.g., 'Computer Security'
    course_code VARCHAR(20) NOT NULL,      -- e.g., 'CS401'
    teacher_id VARCHAR(36) NOT NULL,       -- Matches users.id (role='teacher')
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. STUDENT_CLASSES (Enrollments)
-- Maps which students are taking which classes. (Many-to-Many Relationship)
CREATE TABLE student_classes (
    student_id VARCHAR(36) NOT NULL,       -- Matches users.id (role='student')
    class_id VARCHAR(36) NOT NULL,         -- Matches classes.id
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, class_id),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- 4. SESSIONS TABLE
-- Represents an individual lecture/class day where attendance is taken.
CREATE TABLE sessions (
    id VARCHAR(36) PRIMARY KEY,
    class_id VARCHAR(36) NOT NULL,         -- Matches classes.id
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    dynamic_qr_token VARCHAR(255) UNIQUE,  -- The rotating token verified during scan
    is_active BOOLEAN DEFAULT TRUE,        -- True if currently ongoing
    latitude DECIMAL(10, 8),               -- For Teacher's geofence center point
    longitude DECIMAL(11, 8),              -- For Teacher's geofence center point
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- 5. ATTENDANCE TABLE
-- The actual historical logs of student scans.
CREATE TABLE attendance (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL,       -- Matches sessions.id
    student_id VARCHAR(36) NOT NULL,       -- Matches users.id (role='student')
    scan_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'present',  -- 'present', 'late', 'absent'
    scan_latitude DECIMAL(10, 8),          -- The student's recorded location
    scan_longitude DECIMAL(11, 8),         -- The student's recorded location
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (session_id, student_id)        -- Prevent duplicate scans per session
);

-- ==============================================================================
-- INITIAL MOCK DATA (Seeding)
-- ==============================================================================

-- Insert a Teacher
INSERT INTO users (id, full_name, email, password_hash, role) 
VALUES ('teacher-uuid-1', 'Dr. Alan Turing', 'alan@university.edu', 'hashed_pass_123', 'teacher');

-- Insert Students
INSERT INTO users (id, full_name, email, password_hash, role, qr_identifier) 
VALUES 
('student-uuid-1', 'Alice Smith', 'alice@student.edu', 'hashed_pass_456', 'student', 'static-qr-alice'),
('student-uuid-2', 'Bob Johnson', 'bob@student.edu', 'hashed_pass_789', 'student', 'static-qr-bob');

-- Insert a Class
INSERT INTO classes (id, course_name, course_code, teacher_id)
VALUES ('class-uuid-1', 'Intro to Computer Science', 'CS101', 'teacher-uuid-1');

-- Register Students to Class
INSERT INTO student_classes (student_id, class_id)
VALUES 
('student-uuid-1', 'class-uuid-1'),
('student-uuid-2', 'class-uuid-1');

-- Create an active Session on a specific day
INSERT INTO sessions (id, class_id, start_time, end_time, dynamic_qr_token, is_active, latitude, longitude)
VALUES 
('session-uuid-1', 'class-uuid-1', '2026-03-30 09:00:00', '2026-03-30 10:30:00', 'QR-TOKEN-XYZ-123', TRUE, 37.7749, -122.4194);

-- Record Alice as Present via scanning
INSERT INTO attendance (id, session_id, student_id, status, scan_latitude, scan_longitude)
VALUES ('attend-uuid-1', 'session-uuid-1', 'student-uuid-1', 'present', 37.7748, -122.4195);
