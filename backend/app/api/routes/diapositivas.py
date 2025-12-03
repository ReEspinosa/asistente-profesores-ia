from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import anthropic
import os
import json

router = APIRouter()

class DiapositivasRequest(BaseModel):
    template: str
    tema: str
    num_diapositivas: int

@router.post("/generar-diapositivas")
async def generar_diapositivas(request: DiapositivasRequest):
    try:
        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

        prompt = f"""Eres un experto en educación y diseño de presentaciones. 

Tu tarea es crear el contenido para una presentación de {request.num_diapositivas} diapositivas sobre el tema: "{request.tema}".

Para cada diapositiva, proporciona:
1. Título de la diapositiva
2. Contenido principal (3-5 puntos clave)
3. Notas del presentador (opcional)

Formato de respuesta JSON:
{{
  "titulo_presentacion": "Título principal",
  "autor": "Generado por IA",
  "fecha": "2025",
  "diapositivas": [
    {{
      "numero": 1,
      "titulo": "Título de la diapositiva",
      "contenido": ["Punto 1", "Punto 2", "Punto 3"],
      "notas": "Notas para el presentador"
    }}
  ]
}}

IMPORTANTE: Responde SOLO con el JSON válido, sin texto adicional antes o después."""

        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        contenido_texto = message.content[0].text

        # Limpiar el texto para extraer solo el JSON
        contenido_texto = contenido_texto.strip()
        if contenido_texto.startswith("```json"):
            contenido_texto = contenido_texto[7:]
        if contenido_texto.startswith("```"):
            contenido_texto = contenido_texto[3:]
        if contenido_texto.endswith("```"):
            contenido_texto = contenido_texto[:-3]
        contenido_texto = contenido_texto.strip()

        # Parsear el JSON para validarlo
        try:
            contenido_json = json.loads(contenido_texto)
        except json.JSONDecodeError:
            # Si falla, devolver como texto
            contenido_json = {"raw_text": contenido_texto}

        return {
            "success": True,
            "contenido": contenido_json,
            "template": request.template,
            "message": "Contenido generado exitosamente"
        }

    except Exception as e:
        print(f"Error en generar_diapositivas: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))