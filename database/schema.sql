-- PostgreSQL Schema for Real Estate Dashboard

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'user', -- admin, agent, user
    profile_image VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
    email_verified BOOLEAN DEFAULT FALSE
);

-- Agents Table
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    specialization VARCHAR(100),
    license_number VARCHAR(100),
    commission_rate DECIMAL(5,2),
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, on leave
    rating DECIMAL(3,1),
    total_sales INTEGER DEFAULT 0,
    total_listings INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property Types Table
CREATE TABLE property_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listing Types Table
CREATE TABLE listing_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations Table
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    country VARCHAR(100) NOT NULL DEFAULT 'Zambia',
    postal_code VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties Table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type_id INTEGER NOT NULL REFERENCES property_types(id),
    listing_type_id INTEGER NOT NULL REFERENCES listing_types(id),
    price DECIMAL(15,2) NOT NULL,
    price_type VARCHAR(20) DEFAULT 'total', -- total, month
    address VARCHAR(255) NOT NULL,
    location_id INTEGER NOT NULL REFERENCES locations(id),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    bedrooms INTEGER,
    bathrooms DECIMAL(4,1),
    square_feet DECIMAL(10,2),
    lot_size DECIMAL(10,2),
    year_built INTEGER,
    parking_spaces INTEGER,
    status VARCHAR(20) DEFAULT 'draft', -- draft, pending, published, sold, rented
    featured BOOLEAN DEFAULT FALSE,
    agent_id UUID REFERENCES agents(id),
    owner_id UUID REFERENCES users(id),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    sold_rented_at TIMESTAMP WITH TIME ZONE
);

-- Property Features Table
CREATE TABLE features (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) DEFAULT 'general', -- general, interior, exterior, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property-Features Junction Table
CREATE TABLE property_features (
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    feature_id INTEGER NOT NULL REFERENCES features(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, feature_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property Media Table
CREATE TABLE property_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    media_type VARCHAR(20) NOT NULL, -- image, video, document, floor_plan
    file_path VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inquiries Table
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new', -- new, contacted, viewing_scheduled, offer_made, closed
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
    source VARCHAR(50), -- website, phone, referral, social_media
    assigned_to UUID REFERENCES agents(id),
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE
);

-- Appointments Table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    client_id UUID REFERENCES users(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_type VARCHAR(50) NOT NULL, -- viewing, second_viewing, contract_signing, negotiation
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
    status VARCHAR(20) DEFAULT 'pending', -- not_started, in_progress, pending, completed
    category VARCHAR(50), -- client, property, marketing, administrative, legal, finance
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    related_to VARCHAR(255), -- can be property ID, client ID, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Analytics Table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    total_views INTEGER DEFAULT 0,
    total_inquiries INTEGER DEFAULT 0,
    total_appointments INTEGER DEFAULT 0,
    total_new_listings INTEGER DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property Analytics Table
CREATE TABLE property_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    inquiries INTEGER DEFAULT 0,
    appointments INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Analytics Table
CREATE TABLE agent_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    listings_added INTEGER DEFAULT 0,
    properties_sold INTEGER DEFAULT 0,
    revenue DECIMAL(15,2) DEFAULT 0,
    inquiries_handled INTEGER DEFAULT 0,
    appointments_conducted INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- inquiry, appointment, task, system
    is_read BOOLEAN DEFAULT FALSE,
    related_to VARCHAR(255), -- can be property ID, inquiry ID, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings Table
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_group VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial data

-- Property Types
INSERT INTO property_types (name, description) VALUES
('Apartment', 'Residential unit in a building with multiple units'),
('House', 'Standalone residential building'),
('Villa', 'Luxury standalone house, often with a garden'),
('Townhouse', 'Multi-floor home that shares walls with adjacent properties'),
('Land', 'Undeveloped property without buildings'),
('Commercial', 'Property for business use'),
('Office', 'Space designed for professional or business activities'),
('Retail', 'Space for selling goods or services to consumers'),
('Industrial', 'Property for manufacturing, production, or storage');

-- Listing Types
INSERT INTO listing_types (name, description) VALUES
('For Sale', 'Property available for purchase'),
('For Rent', 'Property available for long-term rental'),
('Short-term Rental', 'Property available for short-term stays'),
('Auction', 'Property to be sold through bidding process'),
('Foreclosure', 'Property being sold due to default on mortgage');

-- Features
INSERT INTO features (name, category) VALUES
('Air Conditioning', 'interior'),
('Heating', 'interior'),
('Balcony', 'exterior'),
('Pool', 'exterior'),
('Garden', 'exterior'),
('Gym', 'amenity'),
('Security System', 'security'),
('Elevator', 'building'),
('Fireplace', 'interior'),
('Storage', 'building'),
('Wheelchair Access', 'accessibility'),
('Furnished', 'interior'),
('Pets Allowed', 'policy'),
('Waterfront', 'location'),
('Mountain View', 'view'),
('City View', 'view'),
('Garage', 'parking'),
('Parking', 'parking'),
('Basement', 'interior');

-- Locations (Major cities in Zambia)
INSERT INTO locations (city, state_province, country) VALUES
('Lusaka', 'Lusaka Province', 'Zambia'),
('Ndola', 'Copperbelt Province', 'Zambia'),
('Kitwe', 'Copperbelt Province', 'Zambia'),
('Livingstone', 'Southern Province', 'Zambia'),
('Kabwe', 'Central Province', 'Zambia'),
('Chingola', 'Copperbelt Province', 'Zambia'),
('Mufulira', 'Copperbelt Province', 'Zambia'),
('Luanshya', 'Copperbelt Province', 'Zambia'),
('Chipata', 'Eastern Province', 'Zambia'),
('Kasama', 'Northern Province', 'Zambia');

-- Create indexes for performance
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_featured ON properties(featured);
CREATE INDEX idx_properties_agent_id ON properties(agent_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_assigned_to ON inquiries(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_property_media_property_id ON property_media(property_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
