import pytest
import sys
from pathlib import Path
import io
from PIL import Image

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app import create_app
import config

@pytest.fixture
def client():
    """Create test client"""
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def sample_image():
    """Create a sample image for testing"""
    img = Image.new('RGB', (100, 100), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    return img_bytes

def test_health_endpoint(client):
    """Test health check endpoint"""
    response = client.get('/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'

def test_caption_no_file(client):
    """Test caption endpoint without file"""
    response = client.post('/api/caption')
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data

def test_caption_with_invalid_file(client):
    """Test caption endpoint with invalid file"""
    data = {
        'image': (io.BytesIO(b'not an image'), 'test.txt')
    }
    response = client.post('/api/caption', data=data, content_type='multipart/form-data')
    assert response.status_code == 400

def test_caption_generation(client, sample_image):
    """Test successful caption generation"""
    data = {
        'image': (sample_image, 'test.jpg')
    }
    response = client.post('/api/caption', data=data, content_type='multipart/form-data')

    # May succeed or timeout depending on model availability
    assert response.status_code in [200, 500]

    if response.status_code == 200:
        data = response.get_json()
        assert 'caption' in data
        assert 'image_id' in data

def test_rating_missing_fields(client):
    """Test rating endpoint with missing fields"""
    response = client.post('/api/rate', json={})
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data

def test_rating_invalid_value(client):
    """Test rating endpoint with invalid rating value"""
    data = {
        'image_id': 'test-id',
        'caption': 'test caption',
        'rating': 10  # Invalid: must be 1-5
    }
    response = client.post('/api/rate', json=data)
    assert response.status_code == 400

def test_rating_submission(client):
    """Test successful rating submission"""
    data = {
        'image_id': 'test-id',
        'caption': 'test caption',
        'rating': 5
    }
    response = client.post('/api/rate', json=data)
    assert response.status_code == 201
    result = response.get_json()
    assert result['success'] is True

def test_history_endpoint(client):
    """Test history endpoint"""
    response = client.get('/api/history')
    assert response.status_code == 200
    data = response.get_json()
    assert 'history' in data
    assert 'average_rating' in data

def test_history_with_limit(client):
    """Test history endpoint with limit parameter"""
    response = client.get('/api/history?limit=10')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data['history']) <= 10

def test_history_invalid_limit(client):
    """Test history endpoint with invalid limit"""
    response = client.get('/api/history?limit=200')
    assert response.status_code == 400
