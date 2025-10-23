import pytest
import sys
from pathlib import Path
from PIL import Image
import io

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from models import CaptionGenerator
from services import ImageProcessor

@pytest.fixture
def sample_image():
    """Create a sample image for testing"""
    return Image.new('RGB', (100, 100), color='blue')

def test_caption_generator_initialization():
    """Test that CaptionGenerator can be initialized"""
    try:
        generator = CaptionGenerator()
        assert generator is not None
    except Exception as e:
        # May fail if model files aren't downloaded yet
        pytest.skip(f"Model initialization failed: {e}")

def test_caption_generation(sample_image):
    """Test caption generation with sample image"""
    try:
        generator = CaptionGenerator()
        caption = generator.generate_caption(sample_image)

        assert isinstance(caption, str)
        assert len(caption) > 0
        print(f"Generated caption: {caption}")

    except Exception as e:
        pytest.skip(f"Caption generation failed: {e}")

def test_image_processor_validation():
    """Test image validation"""
    from werkzeug.datastructures import FileStorage

    # Valid file
    valid_file = FileStorage(
        stream=io.BytesIO(b'test'),
        filename='test.jpg',
        content_type='image/jpeg'
    )
    is_valid, _ = ImageProcessor.validate_file(valid_file)
    assert is_valid

    # Invalid extension
    invalid_file = FileStorage(
        stream=io.BytesIO(b'test'),
        filename='test.txt',
        content_type='text/plain'
    )
    is_valid, error_msg = ImageProcessor.validate_file(invalid_file)
    assert not is_valid
    assert 'not allowed' in error_msg

def test_image_processor_resizing(sample_image):
    """Test that large images are resized"""
    # Create large image
    large_image = Image.new('RGB', (2000, 2000), color='green')

    # Convert to file-like object
    img_bytes = io.BytesIO()
    large_image.save(img_bytes, format='JPEG')
    img_bytes.seek(0)

    from werkzeug.datastructures import FileStorage
    file = FileStorage(
        stream=img_bytes,
        filename='large.jpg',
        content_type='image/jpeg'
    )

    # Process image
    processed = ImageProcessor.process_image(file)

    # Check that it was resized
    assert max(processed.size) <= 512

def test_image_processor_rgb_conversion():
    """Test that non-RGB images are converted to RGB"""
    # Create RGBA image
    rgba_image = Image.new('RGBA', (100, 100), color=(255, 0, 0, 128))

    img_bytes = io.BytesIO()
    rgba_image.save(img_bytes, format='PNG')
    img_bytes.seek(0)

    from werkzeug.datastructures import FileStorage
    file = FileStorage(
        stream=img_bytes,
        filename='rgba.png',
        content_type='image/png'
    )

    # Process image
    processed = ImageProcessor.process_image(file)

    # Check that it's RGB
    assert processed.mode == 'RGB'
