import os
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from dotenv import load_dotenv

load_dotenv()

RUTA_LIBROS = "../Libros SEP"
RUTA_DB_VECTORIAL = "../data/vectorstore"

def procesar_pdfs():
    print("Iniciando procesamiento de libros...")
    
    todos_los_documentos = []
    
    archivos_pdf = [f for f in os.listdir(RUTA_LIBROS) if 
f.endswith('.pdf')]
    
    print(f"Se encontraron {len(archivos_pdf)} libros")
    
    for archivo in archivos_pdf:
        ruta_completa = os.path.join(RUTA_LIBROS, archivo)
        print(f"Procesando: {archivo}")
        
        loader = PyPDFLoader(ruta_completa)
        documentos = loader.load()
        
        for doc in documentos:
            doc.metadata['fuente'] = archivo
        
        todos_los_documentos.extend(documentos)
    
    print(f"Total de páginas cargadas: {len(todos_los_documentos)}")
    
    print("Dividiendo documentos en fragmentos...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    
    chunks = text_splitter.split_documents(todos_los_documentos)
    print(f"Total de fragmentos creados: {len(chunks)}")
    
    print("Creando embeddings y guardando en ChromaDB...")
    embeddings = OpenAIEmbeddings()
    
    os.makedirs(RUTA_DB_VECTORIAL, exist_ok=True)
    
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=RUTA_DB_VECTORIAL
    )
    
    vectorstore.persist()
    print("Base de datos vectorial creada exitosamente")
    print(f"Guardada en: {RUTA_DB_VECTORIAL}")

if __name__ == "__main__":
    procesar_pdfs()
