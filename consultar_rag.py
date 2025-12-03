import os
import base64
import httpx
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.llms.base import LLM
from langchain.chains import RetrievalQA
from langchain.callbacks.manager import CallbackManagerForLLMRun
from typing import Optional, List
from dotenv import load_dotenv
import openai

load_dotenv()

RUTA_DB_VECTORIAL = "./data/vectorstore"

class LMStudioLLM(LLM):
    """Wrapper para usar LM Studio como LLM en LangChain"""
    
    client: any = None
    
    def __init__(self):
        super().__init__()
        USER = os.getenv('LLM_USER')
        PASSWORD = os.getenv('LLM_PASSWORD')
        credentials = f"{USER}:{PASSWORD}"
        encoded_credentials = 
base64.b64encode(credentials.encode()).decode()
        
        BASE_URL = os.getenv('OPENAI_API_BASE')
        
        http_client = httpx.Client(verify=False)
        
        self.client = openai.OpenAI(
            base_url=BASE_URL,
            api_key="hola",
            default_headers={
                "Authorization": f"Basic {encoded_credentials}"
            },
            http_client=http_client
        )
    
    @property
    def _llm_type(self) -> str:
        return "lmstudio"
    
    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
    ) -> str:
        try:
            response = self.client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=[
                    {"role": "system", "content": "Eres un asistente 
educativo experto en los libros de texto de la SEP de 6to grado. Responde 
de forma clara y precisa basándote en el contexto proporcionado."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error al consultar el modelo: {str(e)}"

def inicializar_rag():
    print("Cargando base de datos vectorial...")
    
    embeddings = HuggingFaceEmbeddings(
        
model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )
    
    vectorstore = Chroma(
        persist_directory=RUTA_DB_VECTORIAL,
        embedding_function=embeddings
    )
    
    print("Conectando con LM Studio...")
    llm = LMStudioLLM()
    
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(
            search_kwargs={"k": 3}
        ),
        return_source_documents=True
    )
    
    return qa_chain

def hacer_consulta(qa_chain, pregunta):
    print(f"\nPregunta: {pregunta}")
    print("-" * 50)
    
    resultado = qa_chain({"query": pregunta})
    
    print(f"Respuesta: {resultado['result']}\n")
    
    print("Fuentes consultadas:")
    for i, doc in enumerate(resultado['source_documents'], 1):
        fuente = doc.metadata.get('fuente', 'Desconocida')
        pagina = doc.metadata.get('page', 'N/A')
        print(f"{i}. {fuente} - Página {pagina}")
    
    print("-" * 50)

if __name__ == "__main__":
    qa_chain = inicializar_rag()
    
    print("\nSistema RAG listo. Escribe 'salir' para terminar.\n")
    
    while True:
        pregunta = input("Tu pregunta: ")
        
        if pregunta.lower() in ['salir', 'exit', 'quit']:
            print("Hasta luego")
            break
        
        if pregunta.strip():
            hacer_consulta(qa_chain, pregunta)
