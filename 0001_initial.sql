-- Drop tables if they exist (optional, for easier reset during dev)
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    plan TEXT DEFAULT 'gratuito' CHECK(plan IN ('gratuito', 'pago')),
    product_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    niche TEXT,
    idea_description TEXT,
    product_name TEXT,
    persuasive_description TEXT,
    main_promise TEXT,
    offer_copy TEXT,
    ad_copy_facebook TEXT,
    ad_copy_instagram TEXT,
    ad_copy_google TEXT,
    vsl_script TEXT,
    landing_page_structure TEXT,
    titles_suggestions TEXT,
    cta_suggestions TEXT,
    target_audience_suggestion TEXT,
    cover_image_placeholder TEXT,
    ad_creative_placeholder TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

