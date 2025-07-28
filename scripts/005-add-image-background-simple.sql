-- Add image background columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS background_image_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS background_overlay_opacity DECIMAL(3,2) DEFAULT 0.5;

-- Update existing records to have default values
UPDATE users 
SET background_overlay_opacity = 0.5 
WHERE background_overlay_opacity IS NULL;

-- Insert default user if doesn't exist
INSERT INTO users (id, name, profile_image_url, bio, background_color, background_type, background_image_url, background_overlay_opacity) 
VALUES (1, 'Your Name', '/placeholder.svg?height=120&width=120', 'Welcome to my links!', '#000000', 'solid', NULL, 0.5)
ON CONFLICT (id) DO NOTHING;
