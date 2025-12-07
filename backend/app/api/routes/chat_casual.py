from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import openai
import base64
import httpx
import os
from typing import List, Dict

router = APIRouter()

class MensajeRequest(BaseModel):
    mensaje: str
    historial: List[Dict[str, str]] = []

def get_openai_client():
    USER = os.getenv("LLM_USER", "rag_user").strip("'")
    PASSWORD = os.getenv("LLM_PASSWORD", "").strip("'")
    BASE_URL = os.getenv("OPENAI_BASE_URL")

    credentials = f"{USER}:{PASSWORD}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()

    http_client = httpx.Client(verify=False, timeout=60.0)

    client = openai.OpenAI(
        base_url=BASE_URL,
        api_key=os.getenv("OPENAI_API_KEY", "api_key"),
        default_headers={
            "Authorization": f"Basic {encoded_credentials}"
        },
        http_client=http_client
    )

    return client

@router.post("/chat-casual/mensaje")
async def enviar_mensaje(request: MensajeRequest):
    try:
        client = get_openai_client()

        messages = [
            {"role": "system", "content": "Eres Cuali, un asistente educativo amigable para profesores de primaria en Mexico. Ayudas con planeaciones, actividades y recursos educativos de la Nueva Escuela Mexicana. Responde de manera conversacional, amigable y util."}
        ]

        for msg in request.historial:
            messages.append({"role": msg["role"], "content": msg["content"]})

        messages.append({"role": "user", "content": request.mensaje})

        completion = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "openai/gpt-oss-20b"),
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )

        respuesta = completion.choices[0].message.content

        return {
            "respuesta": respuesta,
            "mensaje_usuario": request.mensaje
        }

    except httpx.ReadTimeout:
        return {
            "respuesta": "Lo siento, el servidor esta tardando mucho. Intenta de nuevo.",
            "mensaje_usuario": request.mensaje
        }
    except Exception as e:
        print(f"Error en chat: {str(e)}")
        return {
            "respuesta": "Hola, soy Cuali. Estoy teniendo problemas de conexion. Como puedo ayudarte?",
            "mensaje_usuario": request.mensaje
        }