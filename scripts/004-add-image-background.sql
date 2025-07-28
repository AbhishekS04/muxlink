-- Add image background support to users table
DO $$ 
BEGIN
    -- Add background_image_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'background_image_url') THEN
        ALTER TABLE users ADD COLUMN background_image_url TEXT;
    END IF;
    
    -- Add background_overlay_opacity column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'background_overlay_opacity') THEN
        ALTER TABLE users ADD COLUMN background_overlay_opacity DECIMAL(3,2) DEFAULT 0.5;
    END IF;
END $$;

-- Update existing user with default values
UPDATE users SET 
    background_image_url = COALESCE(background_image_url, NULL),
    background_overlay_opacity = COALESCE(background_overlay_opacity, 0.5)
WHERE id = 1;
