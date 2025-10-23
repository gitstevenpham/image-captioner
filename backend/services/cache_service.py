import hashlib
from typing import Optional
import config

class CacheService:
    """Simple in-memory cache for image captions"""

    def __init__(self):
        self._cache = {}
        self.enabled = config.CACHE_ENABLED

    def _get_image_hash(self, image_bytes: bytes) -> str:
        """Generate hash for image content"""
        return hashlib.sha256(image_bytes).hexdigest()

    def get(self, image_bytes: bytes) -> Optional[str]:
        """
        Retrieve cached caption for image.

        Args:
            image_bytes: Raw image bytes

        Returns:
            Cached caption or None if not found
        """
        if not self.enabled:
            return None

        image_hash = self._get_image_hash(image_bytes)
        return self._cache.get(image_hash)

    def set(self, image_bytes: bytes, caption: str):
        """
        Store caption in cache.

        Args:
            image_bytes: Raw image bytes
            caption: Generated caption
        """
        if not self.enabled:
            return

        image_hash = self._get_image_hash(image_bytes)
        self._cache[image_hash] = caption

    def clear(self):
        """Clear all cached captions"""
        self._cache.clear()

    def size(self) -> int:
        """Get number of cached items"""
        return len(self._cache)


# Global cache instance
cache = CacheService()
