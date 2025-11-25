import sys
sys.path.append('./app')
from services.llm_service import get_llm_service

def test_connection():
    print("PRUEBA DE CONEXION AL SERVIDOR LLM")
    try:
        print("Inicializando servicio...")
        llm = get_llm_service()
        print("Enviando prompt de prueba...")
        response = llm.generate(prompt="Explica que es una fraccion", 
system_prompt="Eres un profesor de matematicas", temperature=0.3)
        print("RESPUESTA DEL LLM:")
        print(response)
        print("PRUEBA EXITOSA")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_connection()
