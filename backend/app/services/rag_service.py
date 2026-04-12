from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
import os
from dotenv import load_dotenv

load_dotenv()

FAISS_DIR = os.getenv("FAISS_DIR", "./data/faiss_index")

class RAGService:
    def __init__(self):
        print("Cargando modelo de embeddings...")
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
        )
        print("Cargando índice FAISS...")
        self.vectorstore = FAISS.load_local(
            FAISS_DIR,
            self.embeddings,
            allow_dangerous_deserialization=True
        )
        print("RAG listo")

    def search(self, query, n_results=3):
        docs = self.vectorstore.similarity_search(query, k=n_results)
        return {
            "documents": [d.page_content for d in docs],
            "metadatas": [d.metadata for d in docs]
        }

    def count(self):
        return self.vectorstore.index.ntotal


rag_service = None

def get_rag_service():
    global rag_service
    if rag_service is None:
        rag_service = RAGService()
    return rag_service