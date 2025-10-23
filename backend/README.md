# Image Captioner Backend

Flask-based API for generating image captions using AI models.

## Setup

1. Create virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your settings
```

## Running

```bash
python app.py
```

Server runs on `http://localhost:5001`

**Note:** Port 5001 is used instead of 5000 to avoid conflicts with macOS AirPlay Receiver.

## API Endpoints

### POST /api/caption
Generate caption for uploaded image.

**Request:** multipart/form-data with `image` file

**Response:**
```json
{
  "success": true,
  "image_id": "uuid",
  "caption": "Generated caption text",
  "model": "model-name"
}
```

### POST /api/rate
Submit rating for a caption.

**Request:**
```json
{
  "image_id": "uuid",
  "caption": "caption text",
  "rating": 5
}
```

### GET /api/history
Get caption history (limit: 1-100, default: 50).

**Response:**
```json
{
  "success": true,
  "history": [...],
  "average_rating": 4.2
}
```

### GET /health
Health check endpoint.

## Testing

```bash
pytest
pytest tests/test_caption_generation.py -v
```

## Project Structure

```
backend/
├── app.py              # Flask application
├── config.py           # Configuration
├── models/             # ML models
├── routes/             # API endpoints
├── services/           # Business logic
├── database/           # Database layer
└── tests/              # Test suite
```
