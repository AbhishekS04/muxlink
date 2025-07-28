-- Insert sample buttons
INSERT INTO buttons (user_id, label, url, order_index) VALUES
(1, 'My Portfolio', 'https://example.com/portfolio', 1),
(1, 'Contact Me', 'mailto:hello@example.com', 2)
ON CONFLICT DO NOTHING;

-- Insert sample links
INSERT INTO links (user_id, title, url, icon_url, order_index) VALUES
(1, 'GitHub', 'https://github.com', 'https://github.com/favicon.ico', 1),
(1, 'Twitter', 'https://twitter.com', 'https://twitter.com/favicon.ico', 2),
(1, 'LinkedIn', 'https://linkedin.com', 'https://linkedin.com/favicon.ico', 3)
ON CONFLICT DO NOTHING;
