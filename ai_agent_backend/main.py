from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
import google.generativeai as genai
from dotenv import load_dotenv

# --- Load .env ---
load_dotenv()

# --- Configure Gemini API key ---
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# --- Memory file setup ---
MEMORY_FILE = "memory.json"
if not os.path.exists(MEMORY_FILE):
    with open(MEMORY_FILE, "w") as f:
        f.write("[]")

# --- FastAPI app ---
app = FastAPI(title="AI Knowledge Continuity Agent (Gemini)")

# --- Allow frontend to connect ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic models ---
class MemoryItem(BaseModel):
    issue: str
    solution: str

class Query(BaseModel):
    question: str

# --- Add memory endpoint ---
@app.post("/add_memory")
def add_memory_entry(item: MemoryItem):
    try:
        with open(MEMORY_FILE, "r") as f:
            memory = json.load(f)
        memory.append({"issue": item.issue, "solution": item.solution})
        with open(MEMORY_FILE, "w") as f:
            json.dump(memory, f, indent=4)
        return {"message": "Memory added successfully"}
    except Exception as e:
        print("Add memory error:", e)
        return {"error": str(e)}

# --- Query endpoint ---
# --- Query endpoint (with auto-learning) ---
@app.post("/query")
def query_agent(q: Query):
    try:
        with open(MEMORY_FILE, "r") as f:
            memory = json.load(f)

        # Check memory first
        for entry in reversed(memory):
            if entry["issue"].lower() in q.question.lower():
                return {
                    "response": entry["solution"],
                    "context": f"Found in memory: {entry['issue']}"
                }

        # If not found — ask Gemini
        model = genai.GenerativeModel("gemini-2.5-pro")
        response = model.generate_content(
            f"You are an IT troubleshooting assistant.\nUser: {q.question}\nAssistant:"
        )

        # Auto-learn new Q&A
        new_entry = {"issue": q.question, "solution": response.text}
        memory.append(new_entry)

        with open(MEMORY_FILE, "w") as f:
            json.dump(memory, f, indent=4)

        return {
            "response": response.text,
            "context": "Generated and learned from Gemini"
        }

    except Exception as e:
        print("Query error:", e)
        return {"error": str(e)}

# --- Root endpoint ---
@app.get("/")
def root():
    return {"message": "AI Knowledge Continuity Agent (Gemini) is running 🚀"}