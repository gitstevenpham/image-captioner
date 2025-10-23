from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from .db import get_db

@dataclass
class CaptionHistory:
    """Caption history model"""
    id: str
    image_path: str
    caption: str
    model_used: str
    created_at: datetime

    @staticmethod
    def create(image_id: str, image_path: str, caption: str, model_used: str) -> 'CaptionHistory':
        """Create new caption record"""
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO captions (id, image_path, caption, model_used)
            VALUES (?, ?, ?, ?)
        ''', (image_id, image_path, caption, model_used))

        conn.commit()
        conn.close()

        return CaptionHistory(
            id=image_id,
            image_path=image_path,
            caption=caption,
            model_used=model_used,
            created_at=datetime.now()
        )

    @staticmethod
    def get_all(limit: int = 50) -> list['CaptionHistory']:
        """Get all caption history records"""
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id, image_path, caption, model_used, created_at
            FROM captions
            ORDER BY created_at DESC
            LIMIT ?
        ''', (limit,))

        rows = cursor.fetchall()
        conn.close()

        return [
            CaptionHistory(
                id=row['id'],
                image_path=row['image_path'],
                caption=row['caption'],
                model_used=row['model_used'],
                created_at=datetime.fromisoformat(row['created_at'])
            )
            for row in rows
        ]


@dataclass
class Rating:
    """Rating model"""
    id: Optional[int]
    image_id: str
    caption: str
    rating: int
    created_at: datetime

    @staticmethod
    def create(image_id: str, caption: str, rating: int) -> 'Rating':
        """Create new rating record"""
        if not 1 <= rating <= 5:
            raise ValueError("Rating must be between 1 and 5")

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO ratings (image_id, caption, rating)
            VALUES (?, ?, ?)
        ''', (image_id, caption, rating))

        rating_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return Rating(
            id=rating_id,
            image_id=image_id,
            caption=caption,
            rating=rating,
            created_at=datetime.now()
        )

    @staticmethod
    def get_by_image_id(image_id: str) -> list['Rating']:
        """Get all ratings for an image"""
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id, image_id, caption, rating, created_at
            FROM ratings
            WHERE image_id = ?
            ORDER BY created_at DESC
        ''', (image_id,))

        rows = cursor.fetchall()
        conn.close()

        return [
            Rating(
                id=row['id'],
                image_id=row['image_id'],
                caption=row['caption'],
                rating=row['rating'],
                created_at=datetime.fromisoformat(row['created_at'])
            )
            for row in rows
        ]

    @staticmethod
    def get_average_rating() -> float:
        """Get average rating across all captions"""
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute('SELECT AVG(rating) as avg_rating FROM ratings')
        row = cursor.fetchone()
        conn.close()

        return row['avg_rating'] if row['avg_rating'] else 0.0
