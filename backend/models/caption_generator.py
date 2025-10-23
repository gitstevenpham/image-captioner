from PIL import Image
import torch
import config
from .model_loader import ModelLoader

class CaptionGenerator:
    """Modular interface for generating image captions"""

    def __init__(self):
        self.use_gemini = config.USE_GEMINI
        if self.use_gemini:
            self._init_gemini()
        else:
            self.model_loader = ModelLoader()

    def _init_gemini(self):
        """Initialize Gemini API client"""
        try:
            import google.generativeai as genai
            genai.configure(api_key=config.GEMINI_API_KEY)
            self.gemini_model = genai.GenerativeModel('gemini-pro-vision')
        except Exception as e:
            print(f"Failed to initialize Gemini: {e}")
            print("Falling back to BLIP model")
            self.use_gemini = False
            self.model_loader = ModelLoader()

    def generate_caption(self, image: Image.Image, max_length: int = 50) -> str:
        """
        Generate a caption for the given image.

        Args:
            image: PIL Image object
            max_length: Maximum length of generated caption

        Returns:
            Generated caption string
        """
        if self.use_gemini:
            return self._generate_with_gemini(image)
        else:
            return self._generate_with_blip(image, max_length)

    def _generate_with_blip(self, image: Image.Image, max_length: int) -> str:
        """Generate caption using BLIP model"""
        try:
            model = self.model_loader.model
            processor = self.model_loader.processor

            # Preprocess image
            inputs = processor(image, return_tensors="pt")

            # Move inputs to same device as model
            device = next(model.parameters()).device
            inputs = {k: v.to(device) for k, v in inputs.items()}

            # Generate caption
            with torch.no_grad():
                output = model.generate(**inputs, max_length=max_length)

            # Decode the output
            caption = processor.decode(output[0], skip_special_tokens=True)
            return caption

        except Exception as e:
            print(f"Error generating caption with BLIP: {e}")
            return "Unable to generate caption at this time."

    def _generate_with_gemini(self, image: Image.Image) -> str:
        """Generate caption using Gemini Vision API"""
        try:
            response = self.gemini_model.generate_content([
                "Describe this image in a single, concise sentence.",
                image
            ])
            return response.text.strip()

        except Exception as e:
            print(f"Error generating caption with Gemini: {e}")
            # Fallback to BLIP
            self.use_gemini = False
            self.model_loader = ModelLoader()
            return self._generate_with_blip(image, 50)
