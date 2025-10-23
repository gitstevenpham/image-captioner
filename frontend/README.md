# Image Caption Generator - Frontend

React-based frontend application for the AI-Powered Image Caption Generator.

## Features

- Drag-and-drop image upload with validation
- Real-time caption generation using AI models (BLIP/Gemini)
- Interactive star rating system (1-5 stars)
- Caption history with statistics
- Responsive design with Tailwind CSS
- Smooth animations and transitions

## Tech Stack

- React 18
- React Router v7
- Tailwind CSS
- Axios for API calls

## Getting Started

### Prerequisites

- Node.js 18+ (recommended) or 16+
- npm or yarn
- Backend server running on `http://localhost:5001`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` if your backend runs on a different port:
```
REACT_APP_API_URL=http://localhost:5001
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

**Note:** Make sure the backend server is running on port 5001 before starting the frontend.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ImageUpload.jsx      # Drag-and-drop image upload
│   ├── CaptionDisplay.jsx   # Caption display with model info
│   ├── RatingComponent.jsx  # Star rating system
│   └── LoadingSpinner.jsx   # Loading indicator
├── pages/              # Page components
│   ├── Home.jsx            # Main page with upload/caption flow
│   └── HistoryPage.jsx     # Caption history view
├── services/           # API integration
│   └── api.js              # Backend API client
├── App.js             # Main app with routing
└── index.js           # Application entry point
```

## Usage

1. **Upload an Image**
   - Drag and drop an image or click to browse
   - Supports JPEG and PNG (max 10MB)

2. **View Caption**
   - AI generates a caption in under 5 seconds
   - View which model was used (BLIP or Gemini)

3. **Rate the Caption**
   - Click on stars to rate (1-5)
   - Ratings are saved for future model improvements

4. **View History**
   - Click "View History" to see all past captions
   - View statistics and average ratings

## API Integration

The frontend connects to the Flask backend at `http://localhost:5001`:

- `POST /api/caption` - Generate caption from image
- `POST /api/rate` - Submit caption rating
- `GET /api/history` - Retrieve caption history
- `GET /api/history/:imageId/ratings` - Get ratings for specific image

## Troubleshooting

### Backend Connection Issues

If you see "Unable to generate caption" errors:
1. Check if the backend server is running on port 5001
2. Verify `REACT_APP_API_URL` in `.env`
3. Check browser console for CORS errors

### Build Issues

If Tailwind CSS styles aren't working:
```bash
npm rebuild
npm start
```
