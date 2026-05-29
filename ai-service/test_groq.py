import sys
sys.path.insert(0, ".")
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from app.config import get_settings

model = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.7,
    max_tokens=2000,
    api_key=get_settings().groq_api_key,
)
response = model.bind(response_format={"type": "json_object"}).invoke([
    SystemMessage(content="You are a test. Return valid JSON only. Return a JSON object with a single key 'test' set to 'hello'."),
    HumanMessage(content="Return JSON."),
])
print("TYPE:", type(response.content))
print("CONTENT:", repr(response.content))
