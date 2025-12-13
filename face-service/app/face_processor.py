"""
Face Processor using InsightFace (ArcFace)
High-accuracy face detection and embedding extraction
"""
import os
import logging
import numpy as np
import cv2
from insightface.app import FaceAnalysis

logger = logging.getLogger(__name__)


class FaceProcessor:
    """
    Face detection and embedding extraction using InsightFace.
    Supports both CPU and GPU execution.
    """
    
    def __init__(self):
        """
        Initialize the face analysis model.
        Uses ArcFace (ResNet100) for high-quality embeddings.
        """
        logger.info("Initializing FaceProcessor")
        
        # Check GPU availability
        self.gpu_available = self._check_gpu()
        ctx_id = 0 if self.gpu_available else -1
        
        logger.info(f"Using {'GPU' if self.gpu_available else 'CPU'} for inference")
        
        try:
            # Initialize FaceAnalysis with buffalo_l model (high accuracy)
            self.app = FaceAnalysis(
                name='buffalo_l',
                providers=['CUDAExecutionProvider', 'CPUExecutionProvider'] if self.gpu_available else ['CPUExecutionProvider']
            )
            self.app.prepare(ctx_id=ctx_id, det_size=(640, 640))
            logger.info("FaceProcessor initialized successfully")
        
        except Exception as e:
            logger.error(f"Failed to initialize FaceProcessor: {str(e)}")
            raise
    
    def _check_gpu(self):
        """Check if GPU is available for ONNX runtime"""
        try:
            import onnxruntime as ort
            providers = ort.get_available_providers()
            return 'CUDAExecutionProvider' in providers
        except Exception as e:
            logger.warning(f"GPU check failed: {str(e)}")
            return False
    
    def detect_faces(self, image_path):
        """
        Detect faces in an image.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            List of detected faces with bounding boxes and landmarks
        """
        try:
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError(f"Failed to read image: {image_path}")
            
            faces = self.app.get(img)
            logger.info(f"Detected {len(faces)} faces in {image_path}")
            
            return faces
        
        except Exception as e:
            logger.error(f"Face detection failed: {str(e)}")
            raise
    
    def extract_embeddings(self, image_path):
        """
        Extract face embeddings from an image.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            List of dictionaries containing embeddings and metadata for each face
        """
        try:
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError(f"Failed to read image: {image_path}")
            
            faces = self.app.get(img)
            
            results = []
            for face in faces:
                results.append({
                    'embedding': face.embedding,  # 512-dimensional vector
                    'bbox': face.bbox,
                    'det_score': face.det_score,
                    'landmark': face.landmark if hasattr(face, 'landmark') else None
                })
            
            logger.info(f"Extracted {len(results)} face embeddings from {image_path}")
            return results
        
        except Exception as e:
            logger.error(f"Embedding extraction failed: {str(e)}")
            raise
    
    def calculate_similarity(self, embedding1, embedding2):
        """
        Calculate cosine similarity between two embeddings.
        
        Args:
            embedding1: First face embedding (numpy array)
            embedding2: Second face embedding (numpy array)
            
        Returns:
            Similarity score (0-1, higher is more similar)
        """
        # Normalize embeddings
        embedding1 = embedding1 / np.linalg.norm(embedding1)
        embedding2 = embedding2 / np.linalg.norm(embedding2)
        
        # Calculate cosine similarity
        similarity = np.dot(embedding1, embedding2)
        
        return float(similarity)
