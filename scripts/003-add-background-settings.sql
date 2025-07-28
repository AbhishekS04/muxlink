-- Add background settings to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS background_color VARCHAR(7) DEFAULT '#000000';
ALTER TABLE users ADD COLUMN IF NOT EXISTS background_type VARCHAR(20) DEFAULT 'solid';

-- Update existing user with default background
UPDATE users SET background_color = '#000000', background_type = 'solid' WHERE id = 1;
