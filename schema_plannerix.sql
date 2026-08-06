CREATE DATABASE IF NOT EXISTS plannerix;
USE plannerix;

-- Users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Attendee', 'Volunteer', 'Organizer', 'Admin') NOT NULL,
    college_id VARCHAR(50),
    department VARCHAR(100),
    year VARCHAR(20),
    branch VARCHAR(100),
    phone VARCHAR(20),
    institution VARCHAR(150),
    status ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organizer_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    venue VARCHAR(200) NOT NULL,
    poster_url VARCHAR(500),
    category ENUM('Tech', 'Design', 'Business', 'Gaming', 'Other') NOT NULL DEFAULT 'Other',
    reg_limit INT NOT NULL DEFAULT 500,
    status ENUM('draft', 'published', 'upcoming', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (reg_limit > 0)
);

-- Registrations and QR passes
CREATE TABLE registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    qr_code VARCHAR(100) NOT NULL UNIQUE,
    college_id VARCHAR(50),
    department VARCHAR(100),
    year VARCHAR(20),
    branch VARCHAR(100),
    phone VARCHAR(20),
    institution VARCHAR(150),
    checked_in BOOLEAN NOT NULL DEFAULT FALSE,
    check_in_time DATETIME,
    certificate_issued BOOLEAN NOT NULL DEFAULT FALSE,
    rating TINYINT,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE (user_id, event_id),
    CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5))
);

-- Volunteer assignments
CREATE TABLE volunteer_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    volunteer_id INT NOT NULL,
    event_id INT NOT NULL,
    team_role VARCHAR(100) NOT NULL,
    status ENUM('Pending', 'Accepted', 'Rejected') NOT NULL DEFAULT 'Pending',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at DATETIME,
    FOREIGN KEY (volunteer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE (volunteer_id, event_id)
);

-- Volunteer tasks
CREATE TABLE volunteer_tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    task_name VARCHAR(500) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES volunteer_assignments(id) ON DELETE CASCADE
);

-- Notifications
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message VARCHAR(500) NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_users_role_status ON users(role, status);
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_assignments_event ON volunteer_assignments(event_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
