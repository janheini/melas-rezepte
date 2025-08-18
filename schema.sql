CREATE TABLE IF NOT EXISTS user (
    username TEXT NOT NULL PRIMARY KEY,
    hashed_password TEXT
);

CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    secret_hash BLOB NOT NULL, -- blob is a SQLite data type for raw binary
    last_verified_at INTEGER NOT NULL, -- unix (seconds)
    created_at INTEGER NOT NULL, -- unix time (seconds)
    FOREIGN KEY (username) REFERENCES user(username)
) STRICT;
