import chromadb
from sentence_transformers import SentenceTransformer
import os
from typing import List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()

class RAGService:
    def __init__(self):
        self.persist_dir = os.getenv("CHROMA_PERSIST_DIR", "../data/vectordb")
        os.makedirs(self.persist_dir, exist_ok=True)
        
        self.client = chromadb.PersistentClient(path=self.persist_dir)
        
        print("Cargando modelo de embeddings...")
        self.embedding_model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
        print("Modelo cargado")
        
        self.collection = self.client.get_or_create_collection(name="libros_sep")
        print(f"ChromaDB listo ({self.collection.count()} documentos)")
    
    def add_documents(self, texts, metadatas, ids):
        self.collection.add(documents=texts, metadatas=metadatas, ids=ids)
        print(f"{len(texts)} documentos agregados")
    
    def search(self, query, n_results=5, filter_metadata=None):
        kwargs = {"query_texts": [query], "n_results": n_results}
        if filter_metadata:
            kwargs["where"] = filter_metadata
        results = self.collection.query(**kwargs)
        return {"documents": results["documents"][0], "metadatas": results["metadatas"][0]}
    
    def count(self):
        return self.collection.count()

rag_service = None

def get_rag_service():
    global rag_service
    if rag_service is None:
        rag_service = RAGService()
    return rag_service
