from pydantic import BaseModel
from typing import Optional

class PlanClaseRequest(BaseModel):
    materia: str
    tema: str
    duracion_minutos: int = 50
    usar_rag: bool = True

class EjerciciosRequest(BaseModel):
    materia: str
    tema: str
    cantidad: int = 5
    tipo: str = "mixto"
    dificultad: str = "media"

class EstrategiaNEERequest(BaseModel):
    tipo_necesidad: str
    materia: str
    tema: str

class GeneracionResponse(BaseModel):
    contenido: str
    metadata: Optional[dict] = None
