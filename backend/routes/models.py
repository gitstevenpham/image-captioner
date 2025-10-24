from flask import Blueprint, jsonify
import config

models_bp = Blueprint('models', __name__)


@models_bp.route('/models', methods=['GET'])
def get_available_models():
    """
    Get list of available caption generation models.

    Returns: JSON with available models and current active model
    """
    available_models = [
        {
            'id': 'blip',
            'name': 'Salesforce BLIP Image Captioning',
            'full_name': 'Salesforce/blip-image-captioning-base',
            'description': 'Model card for image captioning pretrained on COCO dataset - base architecture (with ViT large backbone). Very dry and not too creative. Initial image load takes a while to generate a caption.',
            'provider': 'Hugging Face',
            'type': 'local'
        },
        {
            'id': 'gemini',
            'name': 'Gemini 2.5 Flash',
            'full_name': 'gemini-2.5-flash',
            'description': 'Google\'s latest vision-language model with fast inference. Takes a few seconds.',
            'provider': 'Google',
            'type': 'api',
            'requires_api_key': True
        }
    ]

    # Determine current active model
    current_model = 'gemini' if config.USE_GEMINI else 'blip'

    return jsonify({
        'success': True,
        'models': available_models,
        'current_model': current_model
    }), 200