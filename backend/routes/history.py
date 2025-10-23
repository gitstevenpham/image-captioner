from flask import Blueprint, request, jsonify
from database.models import CaptionHistory, Rating

history_bp = Blueprint('history', __name__)


@history_bp.route('/history', methods=['GET'])
def get_history():
    """
    Get caption history with optional limit.

    Query params:
    - limit: Number of records to return (default: 50)
    """
    limit = request.args.get('limit', 50, type=int)

    # Validate limit
    if limit < 1 or limit > 100:
        return jsonify({'error': 'Limit must be between 1 and 100'}), 400

    try:
        # Get caption history
        history = CaptionHistory.get_all(limit=limit)

        # Convert to JSON-serializable format
        history_data = [
            {
                'image_id': record.id,
                'caption': record.caption,
                'model_used': record.model_used,
                'created_at': record.created_at.isoformat()
            }
            for record in history
        ]

        # Get average rating
        avg_rating = Rating.get_average_rating()

        return jsonify({
            'success': True,
            'history': history_data,
            'total_records': len(history_data),
            'average_rating': round(avg_rating, 2)
        }), 200

    except Exception as e:
        print(f"Error fetching history: {e}")
        return jsonify({'error': 'Failed to fetch history'}), 500


@history_bp.route('/history/<image_id>/ratings', methods=['GET'])
def get_image_ratings(image_id):
    """Get all ratings for a specific image"""
    try:
        ratings = Rating.get_by_image_id(image_id)

        ratings_data = [
            {
                'rating_id': r.id,
                'caption': r.caption,
                'rating': r.rating,
                'created_at': r.created_at.isoformat()
            }
            for r in ratings
        ]

        return jsonify({
            'success': True,
            'image_id': image_id,
            'ratings': ratings_data,
            'count': len(ratings_data)
        }), 200

    except Exception as e:
        print(f"Error fetching ratings: {e}")
        return jsonify({'error': 'Failed to fetch ratings'}), 500
