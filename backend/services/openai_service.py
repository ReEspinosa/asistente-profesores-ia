"""
Servicio para interactuar con LLM (LMStudio personalizado)
"""
import openai
import base64
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

# --- Configuración de autenticación ---
USER = os.getenv("LLM_USER", "rag_user")
PASSWORD = os.getenv("LLM_PASSWORD", "PASSWORD")
BASE_URL = os.getenv("LLM_BASE_URL", 
"https://dinamica1.fciencias.unam.mx/lmstudio/v1/")
MODEL = os.getenv("LLM_MODEL", "openai/gpt-oss-20b")

# Codificar credenciales en Base64
credentials = f"{USER}:{PASSWORD}"
encoded_credentials = base64.b64encode(credentials.encode()).decode()

# Cliente HTTP sin verificación SSL
http_client = httpx.Client(verify=False)

# Inicializar cliente OpenAI con configuración personalizada
client = openai.OpenAI(
    base_url=BASE_URL,
    api_key="api_key",  # Requerido pero no se usa realmente
    default_headers={
        "Authorization": f"Basic {encoded_credentials}"
    },
    http_client=http_client
)

print("✅ Cliente LLM conectado")

def generar_planeacion(system_prompt, user_prompt, temperature=0.7, 
max_tokens=4000):
    """
    Genera una planeación usando el LLM configurado
    
    Args:
        system_prompt: Instrucciones del sistema
        user_prompt: Petición del usuario
        temperature: Creatividad (0.0-1.0)
        max_tokens: Máximo de tokens en respuesta
    
    Returns:
        str: La planeación generada
    """
    try:
        print(f"🤖 Generando con modelo: {MODEL}")
        
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        return response.choices[0].message.content
    
    except openai.AuthenticationError as e:
        print(f"❌ Error de autenticación: {e}")
        raise Exception("Error de autenticación con el servidor LLM")
    
    except openai.APIConnectionError as e:
        print(f"❌ Error de conexión: {e}")
        raise Exception("No se pudo conectar al servidor LLM")
    
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        raise

def generar_planeacion_con_rag(system_prompt, user_prompt, contexto_rag, 
temperature=0.7, max_tokens=4000):
    """
    Genera una planeación incluyendo contexto del RAG
    
    Args:
        system_prompt: Instrucciones del sistema
        user_prompt: Petición del usuario con placeholder para RAG
        contexto_rag: Información extraída del RAG
        temperature: Creatividad
        max_tokens: Máximo de tokens
    
    Returns:
        str: La planeación generada
    """
    # Insertar contexto RAG en el user_prompt
    user_prompt_completo = user_prompt.replace(
        "[Aquí se insertará la info del RAG]",
        contexto_rag
    )
    
    print(f"📝 Prompt completo preparado (longitud: 
{len(user_prompt_completo)} caracteres)")
    
    return generar_planeacion(system_prompt, user_prompt_completo, 
temperature, max_tokens)

def test_conexion():
    """
    Prueba la conexión con el servidor LLM
    """
    try:
        print("🔍 Probando conexión con LLM...")
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "user", "content": "Di 'Conexión exitosa' en una 
palabra"}
            ],
            temperature=0.1,
            max_tokens=10
        )
        print(f"✅ Respuesta del servidor: 
{response.choices[0].message.content}")
        return True
    except Exception as e:
        print(f"❌ Error en test de conexión: {e}")
        return False
