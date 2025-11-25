from .llm_service import get_llm_service
from .rag_service import get_rag_service

class AssistantService:
    def __init__(self):
        self.llm = get_llm_service()
        self.rag = get_rag_service()
        print("Assistant Service listo")
    
    def generate_plan_clase(self, materia, tema, duracion_minutos=50, usar_rag=True):
        system_prompt = "Eres un experto en educacion primaria de Mexico bajo la Nueva Escuela Mexicana."
        prompt = f"Crea un plan de clase de {duracion_minutos} minutos para 6to grado.\nMateria: {materia}\nTema: {tema}"
        
        if usar_rag and self.rag.count() > 0:
            context = self.rag.search(f"{materia} {tema}", n_results=2)
            context_text = "\n".join(context["documents"])
            prompt = f"Contexto de libros SEP:\n{context_text}\n\n{prompt}"
        
        return self.llm.generate(prompt, system_prompt, temperature=0.7)
    
    def generate_ejercicios(self, materia, tema, cantidad=5):
        prompt = f"Crea {cantidad} ejercicios sobre {tema} para 6to grado de {materia}. Incluye respuestas."
        return self.llm.generate(prompt, temperature=0.6)

assistant_service = None

def get_assistant_service():
    global assistant_service
    if assistant_service is None:
        assistant_service = AssistantService()
    return assistant_service
