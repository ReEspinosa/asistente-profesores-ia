import openai
import base64
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

USER = os.getenv("LLM_USER", "rag_user").strip("'")
PASSWORD = os.getenv("LLM_PASSWORD", "").strip("'")
BASE_URL = os.getenv("OPENAI_BASE_URL")

credentials = f"{USER}:{PASSWORD}"
encoded_credentials = base64.b64encode(credentials.encode()).decode()

http_client = httpx.Client(verify=False, timeout=300.0)

client = openai.OpenAI(
    base_url=BASE_URL,
    api_key="api_key",
    default_headers={
        "Authorization": f"Basic {encoded_credentials}"
    },
    http_client=http_client
)

print("Enviando petición al LLM...")
try:
    completion = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {"role": "user", "content": "Hola, responde con una palabra"}
        ],
        temperature=0.2,
    )
    print("Respuesta:", completion.choices[0].message.content)
except Exception as e:
    print("Error:", e)
