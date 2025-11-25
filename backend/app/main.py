from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import generation
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
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generation.router, prefix="/api", tags=["generation"])

@app.get("/")
def root():
    return {"message": "API Asistente Profesores", "status": "running"}

@app.get("/health")
def health():
    return {"status": "ok"}
