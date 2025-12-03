from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.services.chat_casual_service import ChatCasualService

router = APIRouter(prefix="/api/chat-casual", tags=["Chat Casual"])

class MensajeChatCasual(BaseModel):
    role: str  # "user" o "assistant"
    content: str

class ChatCasualRequest(BaseModel):
    mensaje: str
    historial: Optional[List[MensajeChatCasual]] = []

class ChatCasualResponse(BaseModel):
    respuesta: str
    success: bool = True

@router.post("/mensaje", response_model=ChatCasualResponse)
async def enviar_mensaje_casual(request: ChatCasualRequest):
    """
    Endpoint para chat casual con Cuali.
    Sin prompts especializados, solo conversación amigable.
    """
    try:
        service = ChatCasualService()

        # Convertir historial a formato dict
        historial = [
            {"role": msg.role, "content": msg.content}
            for msg in request.historial
        ]

        respuesta = service.chat_amigable(
            mensaje_usuario=request.mensaje,
            historial=historial
        )

        return ChatCasualResponse(respuesta=respuesta)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/bienvenida")
async def obtener_mensaje_bienvenida():
    """Obtiene el mensaje inicial de Cuali"""
    service = ChatCasualService()
    return {"mensaje": service.mensaje_inicial()}