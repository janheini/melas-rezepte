CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS user_key (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    hashed_password TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id)
);
CREATE TABLE IF NOT EXISTS user_session (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    active_expires INTEGER NOT NULL,
    idle_expires INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);
CREATE TABLE IF NOT EXISTS recipe (
    slug TEXT PRIMARY KEY,
    title TEXT,
    tags TEXT,
    ingredients TEXT,
    body TEXT
);
