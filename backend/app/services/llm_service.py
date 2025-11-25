import openai
import base64
import httpx
import os
from dotenv import load_dotenv
from typing import List, Dict, Optional

load_dotenv()

class LLMService:
    def __init__(self):
        self.user = os.getenv("LLM_USER")
        self.password = os.getenv("LLM_PASSWORD")
        self.base_url = os.getenv("LLM_BASE_URL")
        self.model = os.getenv("LLM_MODEL", "openai/gpt-oss-20b")
        
        if not self.user or not self.password:
            raise ValueError("Credenciales no configuradas en .env")
        
        credentials = f"{self.user}:{self.password}"
        self.encoded_credentials = base64.b64encode(credentials.encode()).decode()
        http_client = httpx.Client(verify=False)
        
        self.client = openai.OpenAI(
            base_url=self.base_url,
            api_key="lm-studio",
            default_headers={"Authorization": f"Basic {self.encoded_credentials}"},
            http_client=http_client
        )
        print("Servicio LLM inicializado")
    
    def generate(self, prompt, system_prompt="Eres un asistente educativo", temperature=0.7, max_tokens=None):
        try:
            messages = [{"role": "system", "content": system_prompt}, {"role": "user", "content": prompt}]
            kwargs = {"model": self.model, "messages": messages, "temperature": temperature}
            if max_tokens:
                kwargs["max_tokens"] = max_tokens
            completion = self.client.chat.completions.create(**kwargs)
            return completion.choices[0].message.content
        except Exception as e:
            print(f"Error: {e}")
            raise

llm_service = None

def get_llm_service():
    global llm_service
    if llm_service is None:
        llm_service = LLMService()
    return llm_service
