from typing import List, Dict
import logging
from app.services.llm_service import get_llm_service

logger = logging.getLogger(__name__)

class ChatCasualService:
    """
    Servicio para chat casual y amigable con profesores.
    Sin prompts especializados, solo conversación natural.
    """

    def __init__(self):
        self.llm_service = get_llm_service()

    def chat_amigable(
            self,
            mensaje_usuario: str,
            historial: List[Dict[str, str]] = None
    ) -> str:
        """
        Chat casual y amigable para profesores.
        """
        if historial is None:
            historial = []

        # Prompt amigable y casual
        system_prompt = """Eres Cuali, un asistente amigable para profesores de 6to grado de primaria en México.

PERSONALIDAD:
- Hablas de manera casual y cercana, como un amigo que también es maestro
- Eres comprensivo con los retos del día a día en el aula
- Usas lenguaje coloquial mexicano cuando es apropiado (sin ser exagerado)
- Eres práctico y das consejos realistas
- Tienes sentido del humor ligero
- Te interesas genuinamente por cómo les va a los profes

CONOCIMIENTO:
- Conoces la Nueva Escuela Mexicana y sus libros de texto
- Entiendes los retos reales: grupos grandes, falta de material, diversidad de niveles
- Das tips prácticos que funcionan en el salón, no teoría pura

ESTILO:
- Conversacional, no formal
- Empático y motivador
- Directo pero amable
- Si te preguntan algo técnico de NEM, lo explicas simple
- Si necesitan desahogarse, los escuchas

IMPORTANTE:
- NO uses prompts especializados a menos que te pidan algo muy específico
- Si te piden generar planeaciones oficiales o documentos formales, ahí sí usa tu modo profesional
- El resto del tiempo, eres su compa profe"""

        # Construir el contexto de conversación para el prompt
        contexto_historial = ""
        if historial:
            for msg in historial[-6:]:  # Últimos 6 mensajes
                role_name = "Usuario" if msg["role"] == "user" else "Cuali"
                contexto_historial += f"{role_name}: {msg['content']}\n"

        # Construir prompt completo
        prompt_completo = f"{contexto_historial}Usuario: {mensaje_usuario}\nCuali:"

        try:
            # Generar respuesta usando el método correcto
            respuesta = self.llm_service.generate(
                prompt=prompt_completo,
                system_prompt=system_prompt,
                temperature=0.8,
                max_tokens=500
            )

            return respuesta

        except Exception as e:
            logger.error(f"Error en chat casual: {str(e)}")
            return "Uy, parece que tuve un problemita técnico. ¿Me repites eso?"

    def mensaje_inicial(self) -> str:
        """Mensaje de bienvenida de Cuali"""
        return """¡Hola! Soy Cuali, tu asistente para dar una buena educación. ¿En qué te puedo ayudar hoy?

Puedo apoyarte con:
- Platicar sobre cómo organizar tus clases
- Darte ideas para actividades
- Ayudarte con dudas de la NEM
- Generar planeaciones oficiales (cuando las necesites)
- O simplemente echarte la mano con lo que ocupes

¿Qué te trae por aquí?"""