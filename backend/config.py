import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent

# Flask configuration
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'

# Upload configuration
UPLOAD_FOLDER = BASE_DIR / 'uploads'
UPLOAD_FOLDER.mkdir(exist_ok=True)
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Database configuration
DATABASE_PATH = BASE_DIR / 'data.db'

# Model configuration
MODEL_NAME = os.getenv('MODEL_NAME', 'Salesforce/blip-image-captioning-base')
USE_GEMINI = os.getenv('USE_GEMINI', 'False').lower() == 'true'
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')

# Performance configuration
CACHE_ENABLED = True
INFERENCE_TIMEOUT = 30  # seconds
TARGET_INFERENCE_TIME = 5  # seconds
MAX_IMAGE_DIMENSION = 512  # pixels

# CORS configuration
CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
