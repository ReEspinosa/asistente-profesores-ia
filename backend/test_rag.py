import sys
sys.path.append('./app')
from services.rag_service import get_rag_service

def test_rag():
    print("PRUEBA DE SERVICIO RAG")
    print("Inicializando RAG...")
    rag = get_rag_service()
    
    print("Agregando documentos de prueba...")
    textos = [
        "Las fracciones representan partes de un todo. El numerador indica cuantas partes tomamos.",
        "Para sumar fracciones con el mismo denominador, sumamos los numeradores.",
        "La Revolucion Mexicana inicio en 1910 con el Plan de San Luis."
    ]
    metadatos = [
        {"materia": "matematicas", "tema": "fracciones", "grado": "6to"},
        {"materia": "matematicas", "tema": "fracciones", "grado": "6to"},
        {"materia": "historia", "tema": "revolucion", "grado": "6to"}
    ]
    ids = ["mate_001", "mate_002", "hist_001"]
    
    rag.add_documents(textos, metadatos, ids)
    print(f"Total documentos: {rag.count()}")
    
    print("Buscando: Que son las fracciones?")
    results = rag.search("Que son las fracciones?", n_results=2)
    print(f"Resultado: {results['documents'][0][:80]}...")
    print("PRUEBA EXITOSA")

if __name__ == "__main__":
    test_rag()
