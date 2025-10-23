import sqlite3
from pathlib import Path
import config

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database with schema"""
    db_path = Path(config.DATABASE_PATH)

    # Create database if it doesn't exist
    conn = get_db()
    cursor = conn.cursor()

    # Create captions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS captions (
            id TEXT PRIMARY KEY,
            image_path TEXT NOT NULL,
            caption TEXT NOT NULL,
            model_used TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Create ratings table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ratings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id TEXT NOT NULL,
            caption TEXT NOT NULL,
            rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (image_id) REFERENCES captions(id)
        )
    ''')

    # Create index for faster lookups
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_ratings_image_id
        ON ratings(image_id)
    ''')

    conn.commit()
    conn.close()

    print(f"Database initialized at {db_path}")
