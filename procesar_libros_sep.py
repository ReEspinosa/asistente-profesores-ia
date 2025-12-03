import os
import pdfplumber
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from dotenv import load_dotenv

load_dotenv()

RUTA_LIBROS = "./librossep"
RUTA_DB_VECTORIAL = "./data/vectorstore"

def extraer_texto_pdf(ruta_pdf):
    """Extrae texto de PDF usando pdfplumber (mejor para PDFs con imágenes)"""
    documentos = []
    
    try:
        with pdfplumber.open(ruta_pdf) as pdf:
            for i, page in enumerate(pdf.pages):
                texto = page.extract_text()
                
                if texto and len(texto.strip()) > 50:
                    doc = Document(
                        page_content=texto,
                        metadata={
                            "page": i + 1,
                            "fuente": os.path.basename(ruta_pdf)
                        }
                    )
                    documentos.append(doc)
    except Exception as e:
        print(f"    Error: {e}")
    
    return documentos

def procesar_pdfs():
    print("Iniciando procesamiento de libros...")
    
    todos_los_documentos = []
    
    archivos_pdf = [f for f in os.listdir(RUTA_LIBROS) if f.endswith('.pdf')]
    
    print(f"Se encontraron {len(archivos_pdf)} libros\n")
    
    for archivo in archivos_pdf:
        ruta_completa = os.path.join(RUTA_LIBROS, archivo)
        print(f"Procesando: {archivo}")
        
        documentos = extraer_texto_pdf(ruta_completa)
        print(f"  - Páginas con contenido extraído: {len(documentos)}")
        
        if len(documentos) > 0:
            print(f"  - Ejemplo de texto: {documentos[0].page_content[:100]}...")
        
        todos_los_documentos.extend(documentos)
    
    print(f"\nTotal de páginas con contenido: {len(todos_los_documentos)}")
    
    if len(todos_los_documentos) == 0:
        print("\nERROR: No se pudo extraer texto de ningún PDF")
        print("Los PDFs podrían ser imágenes escaneadas que requieren OCR")
        print("¿Quieres que intente con OCR? (más lento pero funciona con imágenes)")
        return
    
    print("\nDividiendo documentos en fragmentos...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    
    chunks = text_splitter.split_documents(todos_los_documentos)
    print(f"Total de fragmentos creados: {len(chunks)}")
    
    print("\nEjemplo de fragmento:")
    print(f"Fuente: {chunks[0].metadata.get('fuente', 'N/A')}")
    print(f"Página: {chunks[0].metadata.get('page', 'N/A')}")
    print(f"Contenido: {chunks[0].page_content[:200]}...\n")
    
    print("Creando embeddings locales con HuggingFace...")
    print("Primera vez: descargará el modelo (puede tardar)...")
    
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )
    
    os.makedirs(RUTA_DB_VECTORIAL, exist_ok=True)
    
    print("\nGuardando en ChromaDB (puede tardar varios minutos)...")
    
    # Procesar en lotes para evitar problemas de memoria
    batch_size = 500
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        print(f"Procesando lote {i//batch_size + 1} de {(len(chunks)//batch_size) + 1}...")
        
        if i == 0:
            vectorstore = Chroma.from_documents(
                documents=batch,
                embedding=embeddings,
                persist_directory=RUTA_DB_VECTORIAL
            )
        else:
            vectorstore.add_documents(batch)
    
    print("\nBase de datos vectorial creada exitosamente")
    print(f"Guardada en: {RUTA_DB_VECTORIAL}")
    print(f"Total de fragmentos indexados: {len(chunks)}")

if __name__ == "__main__":
    procesar_pdfs()
