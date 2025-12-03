from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Agregar paths
sys.path.append(os.path.dirname(__file__))

from prompts.planeacion_prompt import SYSTEM_PROMPT, crear_prompt_usuario
from services.openai_service import generar_planeacion_con_rag

app = Flask(__name__)
CORS(app)

# Importar tu función RAG existente
try:
    from consultar_rag import buscar_en_libros
except ImportError:
    print("⚠️  Warning: consultar_rag no encontrado. Usando función 
mock.")
    def buscar_en_libros(query, top_k=5):
        return []

@app.route('/api/generar-planeacion', methods=['POST'])
def generar_planeacion_endpoint():
    """
    Endpoint para generar planeaciones
    """
    try:
        data = request.json
        
        # Validar datos requeridos
        if not data.get('campo_formativo'):
            return jsonify({'error': 'Falta campo_formativo'}), 400
        if not data.get('contenido'):
            return jsonify({'error': 'Falta contenido'}), 400
        if not data.get('pda'):
            return jsonify({'error': 'Falta pda'}), 400
        
        print(f"📝 Generando planeación para: {data['contenido']}")
        
        # Crear el prompt del usuario
        user_prompt = crear_prompt_usuario(
            campo_formativo=data['campo_formativo'],
            contenido=data['contenido'],
            pda=data['pda'],
            tiempo=data.get('tiempo', '2 sesiones de 50 minutos'),
            contexto_grupo=data.get('contexto_grupo', '')
        )
        
        # Buscar información en el RAG
        query_rag = f"{data['campo_formativo']} {data['contenido']} sexto 
grado"
        print(f"🔍 Buscando en RAG: {query_rag}")
        
        contexto_rag_docs = buscar_en_libros(query_rag, top_k=5)
        
        # Formatear contexto RAG
        if contexto_rag_docs:
            contexto_formateado = "\n\n".join([
                f"📖 {doc.get('metadata', {}).get('fuente', 'Libro')} - 
Página {doc.get('metadata', {}).get('pagina', 
'N/A')}:\n{doc.get('contenido', '')}"
                for doc in contexto_rag_docs
            ])
        else:
            contexto_formateado = "No se encontró información específica 
en los libros. Genera la planeación basándote en los PDA proporcionados."
        
        print(f"📚 Documentos RAG encontrados: {len(contexto_rag_docs)}")
        
        # Generar la planeación
        print("🤖 Llamando a OpenAI...")
        planeacion = generar_planeacion_con_rag(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
            contexto_rag=contexto_formateado
        )
        
        print("✅ Planeación generada exitosamente")
        
        return jsonify({
            'success': True,
            'planeacion': planeacion,
            'fuentes_rag': [doc.get('metadata', {}) for doc in 
contexto_rag_docs] if contexto_rag_docs else []
        })
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Endpoint de salud"""
    return jsonify({
        'status': 'ok',
        'message': 'API de planeaciones funcionando'
    })

@app.route('/', methods=['GET'])
def home():
    """Página de inicio"""
    return jsonify({
        'message': '¡Bienvenido a la API de Planeaciones Didácticas!',
        'endpoints': {
            'health': '/api/health',
            'generar': '/api/generar-planeacion (POST)'
        }
    })

if __name__ == '__main__':
    print("🚀 Iniciando servidor...")
    print("📍 URL: http://localhost:5000")
    app.run(debug=True, port=5000, host='0.0.0.0')
