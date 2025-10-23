from flask import Blueprint, request, jsonify
from database.models import Rating

rating_bp = Blueprint('rating', __name__)


@rating_bp.route('/rate', methods=['POST'])
def rate_caption():
    """
    Submit rating for a caption.

    Expected JSON:
    {
        "image_id": "uuid",
        "caption": "the caption text",
        "rating": 1-5
    }
    """
    data = request.get_json()

    # Validate request
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    image_id = data.get('image_id')
    caption = data.get('caption')
    rating = data.get('rating')

    if not all([image_id, caption, rating]):
        return jsonify({'error': 'Missing required fields: image_id, caption, rating'}), 400

    # Validate rating value
    try:
        rating = int(rating)
        if not 1 <= rating <= 5:
            raise ValueError()
    except (ValueError, TypeError):
        return jsonify({'error': 'Rating must be an integer between 1 and 5'}), 400

    try:
        # Create rating record
        rating_record = Rating.create(
            image_id=image_id,
            caption=caption,
            rating=rating
        )

        return jsonify({
            'success': True,
            'rating_id': rating_record.id,
            'message': 'Rating submitted successfully'
        }), 201

    except Exception as e:
        print(f"Error saving rating: {e}")
        return jsonify({'error': 'Failed to save rating'}), 500
