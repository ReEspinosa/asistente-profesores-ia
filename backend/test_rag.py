import sys
sys.path.append('./app')
from services.rag_service import get_rag_service

def test_rag():
    print("PRUEBA DE SERVICIO RAG")
    print("Inicializando RAG...")
    rag = get_rag_service()
    
    print(f"Total documentos en índice: {rag.count()}")
    
    print("\nBuscando: Que son las fracciones?")
    results = rag.search("Que son las fracciones?", n_results=2)
    for i, doc in enumerate(results['documents']):
        print(f"\nResultado {i+1}: {doc[:150]}...")
        print(f"Fuente: {results['metadatas'][i]}")
    
    print("\nBuscando: La Revolucion Mexicana")
    results2 = rag.search("La Revolucion Mexicana", n_results=2)
    for i, doc in enumerate(results2['documents']):
        print(f"\nResultado {i+1}: {doc[:150]}...")

    print("\nPRUEBA EXITOSA")

if __name__ == "__main__":
    test_rag()