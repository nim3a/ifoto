"""
ifoto Face Recognition Service

Production-ready face recognition microservice using InsightFace (ArcFace).
Supports CPU and GPU execution with high accuracy face detection and embedding extraction.
"""
import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import numpy as np
from app.face_processor import FaceProcessor
from app.vector_store import VectorStore

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', '/var/ifoto/uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True, mode=0o750)

# Initialize services
face_processor = FaceProcessor()
vector_store = VectorStore()

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'ifoto-face-service',
        'version': '1.0.0',
        'gpu_available': face_processor.gpu_available
    })


@app.route('/api/face/detect', methods=['POST'])
def detect_faces():
    """
    Detect faces in an image
    Returns face count and bounding boxes
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file'}), 400
    
    try:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        faces = face_processor.detect_faces(filepath)
        
        os.remove(filepath)
        
        return jsonify({
            'face_count': len(faces),
            'faces': [
                {
                    'bbox': face.bbox.tolist(),
                    'confidence': float(face.det_score),
                    'landmarks': face.landmark.tolist() if hasattr(face, 'landmark') and face.landmark is not None else None
                }
                for face in faces
            ]
        })
    
    except Exception as e:
        logger.error(f"Error detecting faces: {str(e)}", exc_info=True)
        return jsonify({'error': 'Face detection failed'}), 500


@app.route('/api/face/extract', methods=['POST'])
def extract_embeddings():
    """
    Extract face embeddings from an image
    Returns embeddings for all detected faces
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    photo_id = request.form.get('photo_id')
    event_id = request.form.get('event_id')
    
    if not photo_id or not event_id:
        return jsonify({'error': 'photo_id and event_id are required'}), 400
    
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file'}), 400
    
    try:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        results = face_processor.extract_embeddings(filepath)
        
        embeddings_data = []
        for idx, result in enumerate(results):
            vector_id = f"photo_{photo_id}_face_{idx}"
            
            # Store in vector database
            vector_store.insert_embedding(
                vector_id=vector_id,
                embedding=result['embedding'],
                metadata={
                    'photo_id': int(photo_id),
                    'event_id': int(event_id),
                    'face_index': idx,
                    'bbox': result['bbox'].tolist(),
                    'confidence': float(result['det_score'])
                }
            )
            
            embeddings_data.append({
                'vector_id': vector_id,
                'face_index': idx,
                'bbox': result['bbox'].tolist(),
                'confidence': float(result['det_score'])
            })
        
        os.remove(filepath)
        
        return jsonify({
            'face_count': len(embeddings_data),
            'embeddings': embeddings_data
        })
    
    except Exception as e:
        logger.error(f"Error extracting embeddings: {str(e)}", exc_info=True)
        return jsonify({'error': 'Embedding extraction failed'}), 500


@app.route('/api/face/search', methods=['POST'])
def search_faces():
    """
    Search for similar faces using a query image
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    event_id = request.form.get('event_id')
    limit = int(request.form.get('limit', 50))
    threshold = float(request.form.get('threshold', 0.6))
    
    if not event_id:
        return jsonify({'error': 'event_id is required'}), 400
    
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file'}), 400
    
    try:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Extract embedding from query image
        results = face_processor.extract_embeddings(filepath)
        
        if len(results) == 0:
            os.remove(filepath)
            return jsonify({'error': 'No face detected in query image'}), 400
        
        # Use the first detected face for searching
        query_embedding = results[0]['embedding']
        
        # Search in vector database
        matches = vector_store.search_similar(
            query_embedding=query_embedding,
            event_id=int(event_id),
            limit=limit,
            threshold=threshold
        )
        
        os.remove(filepath)
        
        return jsonify({
            'matches': matches,
            'total_matches': len(matches)
        })
    
    except Exception as e:
        logger.error(f"Error searching faces: {str(e)}", exc_info=True)
        return jsonify({'error': 'Face search failed'}), 500


@app.route('/api/face/delete-event', methods=['DELETE'])
def delete_event_embeddings():
    """
    Delete all embeddings for an event
    """
    event_id = request.json.get('event_id')
    
    if not event_id:
        return jsonify({'error': 'event_id is required'}), 400
    
    try:
        vector_store.delete_by_event(int(event_id))
        return jsonify({'message': 'Event embeddings deleted successfully'})
    
    except Exception as e:
        logger.error(f"Error deleting event embeddings: {str(e)}", exc_info=True)
        return jsonify({'error': 'Failed to delete embeddings'}), 500


if __name__ == '__main__':
    logger.info("Starting ifoto Face Recognition Service")
    logger.info(f"GPU Available: {face_processor.gpu_available}")
    app.run(host='0.0.0.0', port=5000, debug=False)
