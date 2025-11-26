CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name, color) VALUES 
    ('Work', '#EF4444'),
    ('Personal', '#10B981'),
    ('Shopping', '#F59E0B'),
    ('Health', '#8B5CF6')
ON CONFLICT (name) DO NOTHING;
