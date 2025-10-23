# AI-Powered Image Caption Generator

A full-stack web application that generates intelligent, descriptive captions for uploaded images using vision-language models. Users can upload images, receive AI-generated captions, rate them, and view their caption history.

## Features

- **Image Upload**: Drag-and-drop or click to upload JPEG/PNG images (max 10MB)
- **AI Caption Generation**: Uses BLIP or Gemini Vision API models (< 5 seconds)
- **Interactive Rating**: 1-5 star rating system for captions
- **Caption History**: View past captions with statistics and average ratings
- **Responsive Design**: Beautiful UI with Tailwind CSS and smooth animations
- **REST API**: Well-documented Flask backend with comprehensive endpoints

## Tech Stack

### Backend
- **Framework**: Flask (Python 3.11)
- **AI Models**:
  - Hugging Face Transformers (BLIP-image-captioning-base)
  - Google Gemini Vision API
- **Database**: SQLite
- **Storage**: Local file system (`/uploads`)

### Frontend
- **Framework**: React 18
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Build Tool**: Create React App

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+ (or 16+)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables (optional):
```bash
# Create .env file for Gemini API (optional)
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

5. Run the Flask server:
```bash
python app.py
```

Backend runs on `http://localhost:5001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

Frontend runs on `http://localhost:3000`

## API Endpoints

### POST /api/caption
Generate caption for an uploaded image
- **Request**: `multipart/form-data` with `image` file
- **Response**:
```json
{
  "success": true,
  "image_id": "uuid",
  "caption": "A scenic view of mountains...",
  "model": "blip-image-captioning-base"
}
```

### POST /api/rate
Submit rating for a caption
- **Request**:
```json
{
  "image_id": "uuid",
  "caption": "caption text",
  "rating": 5
}
```
- **Response**:
```json
{
  "success": true,
  "rating_id": "id",
  "message": "Rating submitted successfully"
}
```

### GET /api/history
Get caption history
- **Query Params**: `limit` (1-100, default: 50)
- **Response**:
```json
{
  "success": true,
  "history": [...],
  "total_records": 10,
  "average_rating": 4.2
}
```

### GET /api/history/:imageId/ratings
Get ratings for specific image

### GET /health
Health check endpoint

## Usage

1. **Start Backend**: Run Flask server on port 5001
2. **Start Frontend**: Run React app on port 3000
3. **Upload Image**: Drag and drop or click to select an image
4. **View Caption**: AI generates and displays caption with model info
5. **Rate Caption**: Click stars to rate (1-5)
6. **View History**: Click "View History" to see all past captions

## Testing

### Backend Tests
```bash
cd backend
pytest
```

Test coverage includes:
- API endpoint validation
- ML model inference
- Image validation and processing
- Database operations

### Frontend Tests
```bash
cd frontend
npm test
```

## Development

### Adding New Features

1. **Backend**:
   - Add routes in `backend/app/routes.py`
   - Create services in `backend/app/services/`
   - Update models in `backend/app/models.py`

2. **Frontend**:
   - Add components in `frontend/src/components/`
   - Add pages in `frontend/src/pages/`
   - Update API client in `frontend/src/services/api.js`

### Environment Variables

**Backend** (`.env`):
- `GEMINI_API_KEY`: Google Gemini API key (optional)

**Frontend** (`.env`):
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5001)

## Performance Optimizations

- **Lazy Model Loading**: ML models load on first request
- **Image Caching**: Duplicate images use cached captions
- **Response Validation**: Input sanitization and validation
- **Error Handling**: Graceful fallbacks for API failures

## Future Enhancements

- User authentication and personalized history
- Multiple image batch processing
- Caption style preferences (poetic, factual, witty)
- Fine-tuning with LoRA based on user ratings
- Export history to CSV/JSON
- Dark mode support
- Progressive Web App (PWA) features

## Troubleshooting

### Backend Issues

**Models not loading**:
- Check internet connection (first download)
- Verify Hugging Face cache directory permissions

**Gemini API errors**:
- Verify `GEMINI_API_KEY` in `.env`
- Check API quota and billing

### Frontend Issues

**Can't connect to backend**:
- Verify backend is running on port 5001
- Check `REACT_APP_API_URL` in `.env`
- Look for CORS errors in browser console

**Tailwind styles not working**:
```bash
npm rebuild
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

This project is for educational purposes.

## Acknowledgments

- Salesforce BLIP model via Hugging Face
- Google Gemini Vision API
- React and Tailwind CSS communities
