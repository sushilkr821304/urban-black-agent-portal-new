-- Urban Black Agent Portal PostgreSQL Schema

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) DEFAULT 'ROLE_AGENT'
);

-- Agents table
CREATE TABLE agent (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100),
    email VARCHAR(100),
    agency_name VARCHAR(100),
    profile_photo VARCHAR(255),
    rating DECIMAL(2,1) DEFAULT 4.8,
    total_bookings INT DEFAULT 0,
    completed_jobs INT DEFAULT 0,
    pending_requests INT DEFAULT 0,
    monthly_earnings DECIMAL(10,2) DEFAULT 0.0
);

-- KYC table
CREATE TABLE kyc (
    id SERIAL PRIMARY KEY,
    agent_id INT REFERENCES agent(id) ON DELETE CASCADE,
    agency_name VARCHAR(100),
    email VARCHAR(100),
    aadhar_number VARCHAR(12),
    pan_number VARCHAR(10),
    pin_code VARCHAR(6),
    city VARCHAR(50),
    state VARCHAR(50),
    aadhar_front_image VARCHAR(255),
    aadhar_back_image VARCHAR(255),
    pan_image VARCHAR(255),
    kyc_status VARCHAR(20) DEFAULT 'Pending'
);

-- Wallet table
CREATE TABLE wallet (
    id SERIAL PRIMARY KEY,
    agent_id INT REFERENCES agent(id) ON DELETE CASCADE,
    balance DECIMAL(12,2) DEFAULT 0.0
);

-- Bookings table
CREATE TABLE booking (
    id SERIAL PRIMARY KEY,
    agent_id INT REFERENCES agent(id) ON DELETE SET NULL,
    booking_id VARCHAR(20) UNIQUE,
    customer_name VARCHAR(100),
    service_type VARCHAR(100),
    status VARCHAR(20),
    amount DECIMAL(10,2),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
