from PIL import Image
import io
import config
from werkzeug.datastructures import FileStorage

class ImageProcessor:
    """Handle image validation, sanitization, and preprocessing"""

    @staticmethod
    def validate_file(file: FileStorage) -> tuple[bool, str]:
        """
        Validate uploaded file.

        Returns:
            (is_valid, error_message)
        """
        if not file:
            return False, "No file provided"

        if file.filename == '':
            return False, "Empty filename"

        # Check file extension
        if '.' not in file.filename:
            return False, "File has no extension"

        ext = file.filename.rsplit('.', 1)[1].lower()
        if ext not in config.ALLOWED_EXTENSIONS:
            return False, f"File type not allowed. Allowed types: {', '.join(config.ALLOWED_EXTENSIONS)}"

        return True, ""

    @staticmethod
    def process_image(file: FileStorage) -> Image.Image:
        """
        Process and sanitize uploaded image.

        Args:
            file: Uploaded file from request

        Returns:
            PIL Image object

        Raises:
            ValueError: If image cannot be processed
        """
        try:
            # Read image data
            image_data = file.read()

            # Open with PIL (this validates it's a real image)
            image = Image.open(io.BytesIO(image_data))

            # Convert to RGB if necessary (handles RGBA, grayscale, etc.)
            if image.mode != 'RGB':
                image = image.convert('RGB')

            # Resize if too large (optimization)
            max_dim = config.MAX_IMAGE_DIMENSION
            if max(image.size) > max_dim:
                image.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)

            return image

        except Exception as e:
            raise ValueError(f"Failed to process image: {str(e)}")

    @staticmethod
    def image_to_bytes(image: Image.Image, format: str = 'JPEG') -> bytes:
        """Convert PIL Image to bytes"""
        buffer = io.BytesIO()
        image.save(buffer, format=format)
        return buffer.getvalue()
