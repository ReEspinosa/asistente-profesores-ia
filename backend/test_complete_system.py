import sys
sys.path.append('./app')
from services.assistant_service import get_assistant_service

print("PRUEBA COMPLETA DEL SISTEMA")
assistant = get_assistant_service()

print("\n1. PLAN DE CLASE CON RAG")
plan = assistant.generate_plan_clase("matematicas", "fracciones", usar_rag=True)
print(plan[:200] + "...")

print("\n2. EJERCICIOS")
ejercicios = assistant.generate_ejercicios("matematicas", "suma de fracciones", cantidad=3)
print(ejercicios[:200] + "...")

print("\nSISTEMA COMPLETO FUNCIONANDO")
