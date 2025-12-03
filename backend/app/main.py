from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import generation
from app.api.routes import chat_casual
from app.api.routes import diapositivas  # NUEVO
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Asistente Profesores IA",
    description="API para generar contenido educativo con IA",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generation.router, prefix="/api", tags=["generation"])
app.include_router(chat_casual.router)
app.include_router(diapositivas.router, prefix="/api", tags=["diapositivas"])  # NUEVO

@app.get("/")
def root():
    return {"message": "API Asistente Profesores", "status": "running"}

@app.get("/health")
def health():
    return {"status": "ok"}