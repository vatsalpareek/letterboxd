-- 1. users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username varchar(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW()  
);

-- 2. songs table
CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(100) NOT NULL,
    source_platform VARCHAR(50) NOT NULL, -- (apple, youtube, soundcloud)
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album_name VARCHAR(255),
    cover_url TEXT,
    duration_ms INT,
    cached_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(external_id, source_platform) -- prevents duplicates per platform
);

-- 3. albums table
CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(100) NOT NULL,
    source_platform VARCHAR(50) NOT NULL, 
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    cover_url TEXT,
    release_date DATE,
    cached_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(external_id, source_platform)
);

-- 4. reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    song_id INT REFERENCES songs(id) ON DELETE CASCADE,
    album_id INT REFERENCES albums(id) ON DELETE CASCADE,
    rating NUMERIC(3,1) CHECK (rating >= 0 AND rating <= 5),
    body TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. lists (playlist/favs)
CREATE TABLE lists (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6. list items (many to many bridge lists and songs)
CREATE TABLE list_items (
    id SERIAL PRIMARY KEY,
    list_id INT REFERENCES lists(id) ON DELETE CASCADE,
    song_id INT REFERENCES songs(id) ON DELETE CASCADE,
    position INT NOT NULL
);
