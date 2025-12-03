import os
import fitz  # PyMuPDF
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document

RUTA_LIBROS = "./librossep"
RUTA_DB_VECTORIAL = "./data/vectorstore"

def extraer_texto_pymupdf(ruta_pdf):
    documentos = []
    try:
        doc = fitz.open(ruta_pdf)
        for i, page in enumerate(doc):
            texto = page.get_text()
            if texto and len(texto.strip()) > 50:
                documentos.append(Document(
                    page_content=texto,
                    metadata={"page": i + 1, "fuente": os.path.basename(ruta_pdf)}
                ))
        doc.close()
    except Exception as e:
        print(f"Error: {e}")
    return documentos

def procesar():
    print("Procesando libros SEP...\n")
    todos_docs = []
    archivos = [f for f in os.listdir(RUTA_LIBROS) if f.endswith('.pdf')]
    
    for idx, archivo in enumerate(archivos, 1):
        print(f"[{idx}/{len(archivos)}] {archivo}")
        docs = extraer_texto_pymupdf(os.path.join(RUTA_LIBROS, archivo))
        print(f"  Paginas: {len(docs)}")
        todos_docs.extend(docs)
    
    if not todos_docs:
        print("\nERROR: PDFs son imagenes, necesitan OCR")
        return
    
    print(f"\nTotal: {len(todos_docs)} paginas")
    print("Dividiendo en chunks...")
    
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(todos_docs)
    
    print(f"Chunks: {len(chunks)}")
    print("Creando embeddings...")
    
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )
    
    os.makedirs(RUTA_DB_VECTORIAL, exist_ok=True)
    
    print("Guardando en ChromaDB...")
    Chroma.from_documents(chunks, embeddings, persist_directory=RUTA_DB_VECTORIAL)
    
    print("\nLISTO!")
    print(f"Vectores guardados en: {RUTA_DB_VECTORIAL}")

if __name__ == "__main__":
    procesar()
