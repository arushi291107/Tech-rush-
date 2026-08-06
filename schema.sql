CREATE DATABASE IF NOT EXISTS cventsphere;
USE cventsphere;

-- Users
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    role ENUM('ATTENDEE', 'VOLUNTEER', 'ORGANIZER') NOT NULL,

    institution VARCHAR(150),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organizer details
CREATE TABLE organizers (
    organizer_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    organization_name VARCHAR(150) NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Volunteer details
CREATE TABLE volunteers (
    volunteer_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,

    preferred_team ENUM(
        'Technical Team',
        'Registration Desk',
        'Stage Management',
        'Hospitality & VIP',
        'Photography & Media'
    ),

    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Events
CREATE TABLE events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    organizer_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,

    category ENUM(
        'Tech',
        'Design',
        'Business',
        'Gaming',
        'Other'
    ) NOT NULL,

    description TEXT,
    venue VARCHAR(200) NOT NULL,
    event_datetime DATETIME NOT NULL,
    capacity INT NOT NULL,
    poster_url VARCHAR(500),

    status ENUM(
        'DRAFT',
        'PUBLISHED',
        'LIVE',
        'COMPLETED',
        'CANCELLED'
    ) DEFAULT 'PUBLISHED',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (organizer_id) REFERENCES organizers(organizer_id)
        ON DELETE CASCADE
);

-- Event registrations
CREATE TABLE registrations (
    registration_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    attendee_id INT NOT NULL,
    qr_code VARCHAR(100) NOT NULL UNIQUE,

    registration_status ENUM(
        'REGISTERED',
        'CANCELLED'
    ) DEFAULT 'REGISTERED',

    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (event_id) REFERENCES events(event_id)
        ON DELETE CASCADE,

    FOREIGN KEY (attendee_id) REFERENCES users(user_id)
        ON DELETE CASCADE,

    UNIQUE (event_id, attendee_id)
);

-- Attendance details
CREATE TABLE attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    registration_id INT NOT NULL UNIQUE,

    gate_status ENUM(
        'NOT_ENTERED',
        'IN_VENUE',
        'EXITED'
    ) DEFAULT 'NOT_ENTERED',

    check_in_time DATETIME,
    check_out_time DATETIME,

    FOREIGN KEY (registration_id) REFERENCES registrations(registration_id)
        ON DELETE CASCADE
);

-- Volunteer assignments
CREATE TABLE volunteer_assignments (
    assignment_id INT PRIMARY KEY AUTO_INCREMENT,
    volunteer_id INT NOT NULL,
    event_id INT NOT NULL,
    assigned_role VARCHAR(100) NOT NULL,

    assignment_status ENUM(
        'PENDING',
        'ACCEPTED',
        'REJECTED'
    ) DEFAULT 'PENDING',

    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (volunteer_id) REFERENCES volunteers(volunteer_id)
        ON DELETE CASCADE,

    FOREIGN KEY (event_id) REFERENCES events(event_id)
        ON DELETE CASCADE,

    UNIQUE (volunteer_id, event_id)
);

-- Tasks given to volunteers
CREATE TABLE volunteer_tasks (
    task_id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    task_description VARCHAR(500) NOT NULL,

    task_status ENUM(
        'PENDING',
        'COMPLETED'
    ) DEFAULT 'PENDING',

    completed_at DATETIME,

    FOREIGN KEY (assignment_id) REFERENCES volunteer_assignments(assignment_id)
        ON DELETE CASCADE
);

-- Notifications
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    message VARCHAR(500) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);
