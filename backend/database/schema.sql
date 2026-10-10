CREATE TABLE IF NOT EXISTS users (
 id VARCHAR(64) PRIMARY KEY, name VARCHAR(160) NOT NULL, email VARCHAR(190) NOT NULL UNIQUE, phone VARCHAR(40) NOT NULL,
 password_hash VARCHAR(255) NOT NULL, role ENUM('customer','restaurant','delivery','admin') NOT NULL,
 avatar TEXT NULL, created_at DATETIME NOT NULL, restaurant_id VARCHAR(64) NULL, vehicle_type VARCHAR(60) NULL, vehicle_number VARCHAR(60) NULL,
 license_number VARCHAR(100) NULL, is_online TINYINT(1) DEFAULT 0, city VARCHAR(100) NULL, address TEXT NULL, alternate_phone VARCHAR(40) NULL,
 emergency_contact_json LONGTEXT NULL, saved_addresses_json LONGTEXT NULL, preferences_json LONGTEXT NULL, dietary_preference VARCHAR(20) NULL,
 upi_id VARCHAR(190) NULL, shift_preference VARCHAR(120) NULL, is_active TINYINT(1) DEFAULT 1, updated_at DATETIME NOT NULL,
 INDEX idx_users_role(role), INDEX idx_users_phone(phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS restaurants (
 id VARCHAR(64) PRIMARY KEY, name VARCHAR(180) NOT NULL, tagline TEXT, cuisine VARCHAR(180), address TEXT, city VARCHAR(100), rating DECIMAL(3,2) DEFAULT 0,
 reviews_count INT DEFAULT 0, is_open TINYINT(1) DEFAULT 1, image TEXT, fssai_number VARCHAR(80), phone VARCHAR(40), email VARCHAR(190), owner_name VARCHAR(160),
 delivery_time_range VARCHAR(80), min_order_amount DECIMAL(10,2) DEFAULT 0, is_verified TINYINT(1) DEFAULT 0, location_zone VARCHAR(120), landmark VARCHAR(180), specialty VARCHAR(180),
 pure_satvik TINYINT(1) DEFAULT 0, alternate_phone VARCHAR(40), gst_number VARCHAR(80), prep_time_minutes INT, auto_accept_orders TINYINT(1) DEFAULT 0,
 sound_alerts TINYINT(1) DEFAULT 1, payout_upi_id VARCHAR(190), coordinates_json LONGTEXT NULL, updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS menu_items (
 id VARCHAR(64) PRIMARY KEY, restaurant_id VARCHAR(64) NOT NULL, name VARCHAR(180) NOT NULL, description TEXT, price DECIMAL(10,2) NOT NULL, mrp DECIMAL(10,2) NULL,
 category VARCHAR(80), is_veg TINYINT(1) DEFAULT 1, image TEXT, rating DECIMAL(3,2) DEFAULT 0, reviews_count INT DEFAULT 0, in_stock TINYINT(1) DEFAULT 1,
 prep_time_minutes INT DEFAULT 15, updated_at DATETIME NOT NULL, INDEX idx_menu_restaurant(restaurant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS orders (
 id VARCHAR(64) PRIMARY KEY, customer_id VARCHAR(64) NOT NULL, customer_name VARCHAR(160), customer_phone VARCHAR(40), delivery_address TEXT NOT NULL,
 restaurant_id VARCHAR(64) NOT NULL, restaurant_name VARCHAR(180), subtotal DECIMAL(10,2) NOT NULL, delivery_fee DECIMAL(10,2) DEFAULT 0, tax DECIMAL(10,2) DEFAULT 0,
 discount DECIMAL(10,2) DEFAULT 0, total_amount DECIMAL(10,2) NOT NULL, status VARCHAR(40) NOT NULL, order_time DATETIME NOT NULL, estimated_delivery_time VARCHAR(80),
 payment_method VARCHAR(40), payment_status VARCHAR(40), wallet_amount_used DECIMAL(10,2) DEFAULT 0, otp_hash VARCHAR(255), rider_id VARCHAR(64) NULL, rider_name VARCHAR(160) NULL,
 rider_phone VARCHAR(40) NULL, rider_vehicle VARCHAR(100) NULL, rating INT NULL, feedback TEXT NULL, restaurant_coordinates_json LONGTEXT NULL, delivery_coordinates_json LONGTEXT NULL,
 updated_at DATETIME NOT NULL, INDEX idx_orders_customer(customer_id), INDEX idx_orders_restaurant(restaurant_id), INDEX idx_orders_status(status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS order_items (
 id BIGINT AUTO_INCREMENT PRIMARY KEY, order_id VARCHAR(64) NOT NULL, menu_item_id VARCHAR(64), name VARCHAR(180), price DECIMAL(10,2), quantity INT, is_veg TINYINT(1),
 INDEX idx_order_items_order(order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS riders (
 id VARCHAR(64) PRIMARY KEY, user_id VARCHAR(64) NOT NULL UNIQUE, name VARCHAR(160), phone VARCHAR(40), alternate_phone VARCHAR(40), emergency_contact_name VARCHAR(160), emergency_contact_phone VARCHAR(40),
 address TEXT, vehicle_type VARCHAR(80), vehicle_number VARCHAR(80), license_number VARCHAR(100), rating DECIMAL(3,2) DEFAULT 0, total_trips INT DEFAULT 0,
 today_earnings DECIMAL(10,2) DEFAULT 0, today_trips INT DEFAULT 0, is_online TINYINT(1) DEFAULT 0, current_order_id VARCHAR(64) NULL, zone VARCHAR(160), status VARCHAR(40),
 is_verified TINYINT(1) DEFAULT 0, payout_upi_id VARCHAR(190), shift_preference VARCHAR(120), navigation_app VARCHAR(80), auto_accept_radar TINYINT(1) DEFAULT 0, updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS tiffin_subscriptions (id VARCHAR(64) PRIMARY KEY, customer_id VARCHAR(64), data_json LONGTEXT NOT NULL, updated_at DATETIME NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS coupons (id VARCHAR(64) PRIMARY KEY, code VARCHAR(60) UNIQUE, data_json LONGTEXT NOT NULL, updated_at DATETIME NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS table_bookings (id VARCHAR(64) PRIMARY KEY, customer_id VARCHAR(64), restaurant_id VARCHAR(64), data_json LONGTEXT NOT NULL, updated_at DATETIME NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS wallet_transactions (id VARCHAR(64) PRIMARY KEY, customer_id VARCHAR(64), amount DECIMAL(10,2), data_json LONGTEXT NOT NULL, created_at DATETIME NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS cms_content (content_key VARCHAR(80) PRIMARY KEY, data_json LONGTEXT NOT NULL, updated_at DATETIME NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS rider_locations (rider_id VARCHAR(64) PRIMARY KEY, latitude DECIMAL(10,7) NOT NULL, longitude DECIMAL(10,7) NOT NULL, accuracy DECIMAL(10,2) NULL, updated_at DATETIME NOT NULL, INDEX idx_rider_locations_updated(updated_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS rider_telemetry (order_id VARCHAR(64) PRIMARY KEY, rider_id VARCHAR(64), data_json LONGTEXT NOT NULL, updated_at DATETIME NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS audit_logs (id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(64), action VARCHAR(120), entity_type VARCHAR(80), entity_id VARCHAR(64), payload_json LONGTEXT, created_at DATETIME NOT NULL, INDEX idx_audit_user(user_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS api_idempotency (idempotency_key VARCHAR(120) PRIMARY KEY, user_id VARCHAR(64), response_json LONGTEXT NOT NULL, created_at DATETIME NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
