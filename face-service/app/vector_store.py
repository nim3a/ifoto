"""
Vector Store using Qdrant
Self-hosted vector database for face embedding storage and similarity search
"""
import os
import logging
from typing import List, Dict, Any
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue

logger = logging.getLogger(__name__)


class VectorStore:
    """
    Vector database interface using Qdrant.
    Stores face embeddings and performs similarity search.
    """
    
    def __init__(self):
        """
        Initialize connection to Qdrant vector database.
        """
        logger.info("Initializing VectorStore")
        
        qdrant_host = os.getenv('QDRANT_HOST', 'localhost')
        qdrant_port = int(os.getenv('QDRANT_PORT', 6333))
        collection_name = os.getenv('QDRANT_COLLECTION', 'face_embeddings')
        
        self.collection_name = collection_name
        
        try:
            self.client = QdrantClient(host=qdrant_host, port=qdrant_port)
            self._ensure_collection()
            logger.info(f"VectorStore initialized with collection: {collection_name}")
        
        except Exception as e:
            logger.error(f"Failed to initialize VectorStore: {str(e)}")
            raise
    
    def _ensure_collection(self):
        """
        Ensure the collection exists, create if not.
        """
        try:
            collections = self.client.get_collections().collections
            collection_names = [col.name for col in collections]
            
            if self.collection_name not in collection_names:
                logger.info(f"Creating collection: {self.collection_name}")
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=512,  # InsightFace ArcFace embedding size
                        distance=Distance.COSINE
                    )
                )
                logger.info("Collection created successfully")
            else:
                logger.info(f"Collection {self.collection_name} already exists")
        
        except Exception as e:
            logger.error(f"Failed to ensure collection: {str(e)}")
            raise
    
    def insert_embedding(self, vector_id: str, embedding: Any, metadata: Dict[str, Any]):
        """
        Insert a face embedding into the vector database.
        
        Args:
            vector_id: Unique identifier for the embedding
            embedding: Face embedding vector (512-dim numpy array)
            metadata: Additional metadata (photo_id, event_id, bbox, etc.)
        """
        try:
            point = PointStruct(
                id=vector_id,
                vector=embedding.tolist() if hasattr(embedding, 'tolist') else embedding,
                payload=metadata
            )
            
            self.client.upsert(
                collection_name=self.collection_name,
                points=[point]
            )
            
            logger.debug(f"Inserted embedding: {vector_id}")
        
        except Exception as e:
            logger.error(f"Failed to insert embedding: {str(e)}")
            raise
    
    def search_similar(
        self,
        query_embedding: Any,
        event_id: int,
        limit: int = 50,
        threshold: float = 0.6
    ) -> List[Dict[str, Any]]:
        """
        Search for similar face embeddings.
        
        Args:
            query_embedding: Query face embedding
            event_id: Filter by event ID
            limit: Maximum number of results
            threshold: Minimum similarity threshold
            
        Returns:
            List of matching faces with metadata and similarity scores
        """
        try:
            search_result = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding.tolist() if hasattr(query_embedding, 'tolist') else query_embedding,
                query_filter=Filter(
                    must=[
                        FieldCondition(
                            key="event_id",
                            match=MatchValue(value=event_id)
                        )
                    ]
                ),
                limit=limit,
                score_threshold=threshold
            )
            
            matches = []
            for hit in search_result:
                matches.append({
                    'vector_id': hit.id,
                    'similarity': float(hit.score),
                    'photo_id': hit.payload.get('photo_id'),
                    'event_id': hit.payload.get('event_id'),
                    'face_index': hit.payload.get('face_index'),
                    'bbox': hit.payload.get('bbox'),
                    'confidence': hit.payload.get('confidence')
                })
            
            logger.info(f"Found {len(matches)} similar faces for event {event_id}")
            return matches
        
        except Exception as e:
            logger.error(f"Search failed: {str(e)}")
            raise
    
    def delete_by_event(self, event_id: int):
        """
        Delete all embeddings for a specific event.
        
        Args:
            event_id: Event ID to delete
        """
        try:
            self.client.delete(
                collection_name=self.collection_name,
                points_selector=Filter(
                    must=[
                        FieldCondition(
                            key="event_id",
                            match=MatchValue(value=event_id)
                        )
                    ]
                )
            )
            logger.info(f"Deleted embeddings for event {event_id}")
        
        except Exception as e:
            logger.error(f"Failed to delete embeddings: {str(e)}")
            raise
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get collection statistics.
        
        Returns:
            Dictionary with collection stats
        """
        try:
            info = self.client.get_collection(collection_name=self.collection_name)
            return {
                'vectors_count': info.vectors_count,
                'points_count': info.points_count,
                'status': info.status
            }
        
        except Exception as e:
            logger.error(f"Failed to get stats: {str(e)}")
            raise
