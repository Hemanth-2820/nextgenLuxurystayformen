-- backend/schema.sql
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    room_id INT NOT NULL,
    joining_date DATE NOT NULL,
    advance_paid DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    monthly_rent DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status ENUM('Active', 'Vacated') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT
);
