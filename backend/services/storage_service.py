import uuid
from pathlib import Path
from PIL import Image
import config

class StorageService:
    """Handle file storage operations"""

    def __init__(self):
        self.upload_folder = config.UPLOAD_FOLDER
        self.upload_folder.mkdir(exist_ok=True)

    def save_image(self, image: Image.Image, original_filename: str) -> tuple[str, str]:
        """
        Save image to disk with unique filename.

        Args:
            image: PIL Image object
            original_filename: Original filename from upload

        Returns:
            (unique_id, file_path)
        """
        # Generate unique ID
        unique_id = str(uuid.uuid4())

        # Get extension from original filename
        ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else 'jpg'

        # Create filename
        filename = f"{unique_id}.{ext}"
        file_path = self.upload_folder / filename

        # Save image
        image.save(file_path, quality=95)

        return unique_id, str(file_path)

    def get_image_path(self, image_id: str) -> Path:
        """Get path for stored image"""
        # Find file with this ID (extension may vary)
        for file in self.upload_folder.glob(f"{image_id}.*"):
            return file
        return None

    def delete_image(self, image_id: str) -> bool:
        """Delete stored image"""
        image_path = self.get_image_path(image_id)
        if image_path and image_path.exists():
            image_path.unlink()
            return True
        return False
