# AI Knowledge Continuity Agent

**AI-powered knowledge continuity assistant for IT teams**. This system helps IT teams store, retrieve, and generate solutions to common issues, ensuring that knowledge is preserved and easily accessible.

This project combines a memory-based knowledge system with AI-powered responses using **Google Gemini 2.5 Pro**, providing context-aware solutions and reducing repetitive problem-solving.

---

### Features

- **Automated Learning:** Stores solved issues and their solutions automatically.  
- **AI-Generated Responses:** Uses Gemini AI to generate answers for new issues.  
- **Context Awareness:** Provides relevant answers based on the specific problem.  
- **Team Continuity:** Ensures all IT knowledge is centralized and accessible.  

---

### Architecture & Workflow

1. **Backend (FastAPI)** handles storing issues/solutions in a JSON-based memory, processes AI queries, and exposes endpoints `/query` and `/add_memory`.  
2. **Frontend (React + TailwindCSS)** provides the user interface for interacting with the AI agent, displaying chat, memory addition, and settings.  
3. When a user asks a question, the agent first checks stored memory. If no match is found, it generates a response using Gemini AI.

---

### Technologies Used

- **Backend:** Python, FastAPI, Pydantic  
- **Frontend:** React, TypeScript, TailwindCSS, Lucide Icons  
- **AI:** Google Gemini 2.5 Pro  
- **Database:** JSON file-based memory (prototype)  
- **Other:** CORS support, environment variables for API key  

---

### Future Development

- Automatic logging of IT issues from ticketing systems.  
- Advanced search and filtering in the knowledge base.  
- Multi-user collaboration and role-based access.  
- Integration with IT monitoring tools for proactive problem-solving.  
- Real-time learning: automatically capture the problem-solving procedure without manual input.  
- Analytics dashboard to track frequent issues, AI response accuracy, and team performance.  
