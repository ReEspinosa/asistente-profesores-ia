import os
import pdfplumber
from pdf2image import convert_from_path
import pytesseract
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from dotenv import load_dotenv

load_dotenv()

RUTA_LIBROS = "./librossep"
RUTA_DB_VECTORIAL = "./data/vectorstore"

def extraer_texto_con_ocr(ruta_pdf):
    """Extrae texto usando OCR para PDFs con imagenes"""
    documentos = []
    print(f"  Convirtiendo PDF a imagenes...")
    
    try:
        imagenes = convert_from_path(ruta_pdf, dpi=200)
        print(f"  Total de paginas: {len(imagenes)}")
        
        for i, imagen in enumerate(imagenes):
            print(f"  Procesando pagina {i+1}/{len(imagenes)}...", 
end="\r")
            texto = pytesseract.image_to_string(imagen, lang='spa')
            
            if texto and len(texto.strip()) > 50:
                doc = Document(
                    page_content=texto,
                    metadata={
                        "page": i + 1,
                        "fuente": os.path.basename(ruta_pdf)
                    }
                )
                documentos.append(doc)
        
        print(f"\n  Paginas procesadas con OCR: {len(documentos)}")
        
    except Exception as e:
        print(f"    Error en OCR: {e}")
    
    return documentos

def procesar_pdfs():
    print("PROCESAMIENTO DE LIBROS SEP CON OCR")
    print("NOTA: Este proceso puede tardar 30-60 minutos\n")
    
    todos_los_documentos = []
    archivos_pdf = [f for f in os.listdir(RUTA_LIBROS) if 
f.endswith('.pdf')]
    
    print(f"Se encontraron {len(archivos_pdf)} libros\n")
    
    for idx, archivo in enumerate(archivos_pdf, 1):
        ruta_completa = os.path.join(RUTA_LIBROS, archivo)
        print(f"\n[{idx}/{len(archivos_pdf)}] Procesando: {archivo}")
        
        documentos = extraer_texto_con_ocr(ruta_completa)
        
        if len(documentos) > 0:
            print(f"  Texto extraido exitosamente")
            print(f"  Ejemplo: {documentos[0].page_content[:150]}...")
        
        todos_los_documentos.extend(documentos)
    
    print(f"\nTotal de paginas procesadas: {len(todos_los_documentos)}\n")
    
    if len(todos_los_documentos) == 0:
        print("ERROR: No se pudo extraer texto")
        return
    
    print("Dividiendo en fragmentos...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    
    chunks = text_splitter.split_documents(todos_los_documentos)
    print(f"Total de fragmentos: {len(chunks)}\n")
    
    print("Creando embeddings...")
    embeddings = HuggingFaceEmbeddings(
        
model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )
    
    os.makedirs(RUTA_DB_VECTORIAL, exist_ok=True)
    
    print("Guardando en ChromaDB...")
    batch_size = 500
    
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        lote_actual = i//batch_size + 1
        total_lotes = (len(chunks)//batch_size) + 1
        print(f"  Guardando lote {lote_actual}/{total_lotes}...")
        
        if i == 0:
            vectorstore = Chroma.from_documents(
                documents=batch,
                embedding=embeddings,
                persist_directory=RUTA_DB_VECTORIAL
            )
        else:
            vectorstore.add_documents(batch)
    
    print("\nBASE DE DATOS VECTORIAL CREADA EXITOSAMENTE")
    print(f"Ubicacion: {RUTA_DB_VECTORIAL}")
    print(f"Fragmentos indexados: {len(chunks)}")

if __name__ == "__main__":
    procesar_pdfs()
