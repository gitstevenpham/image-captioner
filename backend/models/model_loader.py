from transformers import BlipProcessor, BlipForConditionalGeneration
import torch
import config

class ModelLoader:
    """Lazy loading singleton for ML models"""
    _instance = None
    _model = None
    _processor = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def load_model(self):
        """Load the BLIP model and processor (lazy initialization)"""
        if self._model is None or self._processor is None:
            print(f"Loading model: {config.MODEL_NAME}")
            self._processor = BlipProcessor.from_pretrained(config.MODEL_NAME)
            self._model = BlipForConditionalGeneration.from_pretrained(config.MODEL_NAME)

            # Use GPU if available
            device = "cuda" if torch.cuda.is_available() else "cpu"
            self._model.to(device)
            print(f"Model loaded on device: {device}")

        return self._model, self._processor

    @property
    def model(self):
        if self._model is None:
            self.load_model()
        return self._model

    @property
    def processor(self):
        if self._processor is None:
            self.load_model()
        return self._processor
