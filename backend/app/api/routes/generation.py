from fastapi import APIRouter, HTTPException
from app.models.schemas import PlanClaseRequest, EjerciciosRequest, GeneracionResponse
from app.services.assistant_service import get_assistant_service

router = APIRouter()

@router.post("/generar-plan-clase", response_model=GeneracionResponse)
async def generar_plan_clase(request: PlanClaseRequest):
    try:
        assistant = get_assistant_service()
        contenido = assistant.generate_plan_clase(
            materia=request.materia,
            tema=request.tema,
            duracion_minutos=request.duracion_minutos,
            usar_rag=request.usar_rag
        )
        return GeneracionResponse(
            contenido=contenido,
            metadata={"materia": request.materia, "tema": request.tema}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generar-ejercicios", response_model=GeneracionResponse)
async def generar_ejercicios(request: EjerciciosRequest):
    try:
        assistant = get_assistant_service()
        contenido = assistant.generate_ejercicios(
            materia=request.materia,
            tema=request.tema,
            cantidad=request.cantidad
        )
        return GeneracionResponse(contenido=contenido)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/materias")
async def listar_materias():
    return {
        "materias": [
            "matematicas",
            "espanol",
            "ciencias_naturales",
            "geografia",
            "historia",
            "formacion_civica"
        ]
    }
