# 🎓 Asistente de Profesores IA - Nueva Escuela Mexicana

Sistema basado en LLMs y RAG para asistir a profesores de 6to grado de primaria.

## 🚀 Tecnologías

- **Backend:** Python + FastAPI
- **LLM:** Servidor UNAM (GPT-OSS-20B)
- **RAG:** ChromaDB + sentence-transformers
- **Frontend:** React + Tailwind (en desarrollo)

## 📦 Instalación Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configurar .env con credenciales
cp .env.example .env

# Iniciar API
uvicorn app.main:app --reload --port 8000
```

## 📖 API Docs

http://localhost:8000/docs

## 👤 Autor

Rebeca - UNAM Ciencias de la Computación
