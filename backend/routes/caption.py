from flask import Blueprint, request, jsonify
from models import CaptionGenerator
from services import ImageProcessor, StorageService
from services.cache_service import cache
from database.models import CaptionHistory
import config

caption_bp = Blueprint('caption', __name__)

# Initialize services (lazy loading for model)
image_processor = ImageProcessor()
storage_service = StorageService()
caption_generator = None  # Will be initialized on first request


def get_caption_generator():
    """Lazy initialization of caption generator"""
    global caption_generator
    if caption_generator is None:
        caption_generator = CaptionGenerator()
    return caption_generator


@caption_bp.route('/caption', methods=['POST'])
def generate_caption():
    """
    Generate caption for uploaded image.

    Expected: multipart/form-data with 'image' file
    Returns: JSON with caption and image_id
    """
    # Check if file is in request
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']

    # Validate file
    is_valid, error_msg = image_processor.validate_file(file)
    if not is_valid:
        return jsonify({'error': error_msg}), 400

    try:
        # Process image
        image = image_processor.process_image(file)

        # Check cache
        image_bytes = image_processor.image_to_bytes(image)
        cached_caption = cache.get(image_bytes)

        if cached_caption:
            print("Cache hit - returning cached caption")
            caption = cached_caption
        else:
            # Generate caption
            generator = get_caption_generator()
            caption = generator.generate_caption(image)

            # Store in cache
            cache.set(image_bytes, caption)

        # Save image and record to database
        image_id, image_path = storage_service.save_image(image, file.filename)
        model_used = 'gemini' if config.USE_GEMINI else config.MODEL_NAME

        CaptionHistory.create(
            image_id=image_id,
            image_path=image_path,
            caption=caption,
            model_used=model_used
        )

        return jsonify({
            'success': True,
            'image_id': image_id,
            'caption': caption,
            'model': model_used
        }), 200

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Error generating caption: {e}")
        return jsonify({'error': 'Failed to generate caption'}), 500
