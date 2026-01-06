import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from langchain_community.document_loaders import PyPDFLoader
from pydantic import BaseModel
from brain import AnitsBrain

app = FastAPI()
brain = AnitsBrain()

# 1. CORS: Allow React Frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. STATIC: Serve PDFs for download (e.g., Calendars)
# Files inside the 'static' folder are accessible at http://localhost:8000/static/filename.pdf
if not os.path.exists("static"):
    os.makedirs("static")
app.mount("/static", StaticFiles(directory="static"), name="static")

class ChatInput(BaseModel):
    question: str

@app.get("/")
def health_check():
    return {"status": "Online"}

@app.post("/chat")
def chat_endpoint(input_data: ChatInput):
    try:
        response = brain.ask(input_data.question)
        return {"answer": response}
    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ingest-all")
def ingest_college_data():
    """
    Recursively scans 'college_data' and ALL subfolders (like placements_summary).
    Ingests both .txt and .pdf files.
    """
    base_folder = "./college_data"
    
    if not os.path.exists(base_folder):
        raise HTTPException(status_code=404, detail="Folder 'college_data' not found!")
    
    results = []
    
    # os.walk is the magic: It goes into every subfolder automatically
    for root, dirs, files in os.walk(base_folder):
        for filename in files:
            file_path = os.path.join(root, filename)
            content = ""
            
            try:
                # 1. Handle Text Files
                if filename.endswith(".txt"):
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                
                # 2. Handle PDF Files
                elif filename.endswith(".pdf"):
                    print(f"📄 Processing PDF: {filename}")
                    loader = PyPDFLoader(file_path)
                    pages = loader.load()
                    content = "\n".join([p.page_content for p in pages])
                
                else:
                    continue # Skip other files

                # 3. Feed to Brain
                if content:
                    # We pass 'filename' so the AI knows the source (e.g., 'placement_2023.txt')
                    msg = brain.ingest_text(content, filename)
                    results.append(msg)
                    
            except Exception as e:
                print(f"❌ Error reading {filename}: {e}")

    if not results:
        return {"message": "No files found in college_data or its subfolders."}
        
    return {"status": "success", "files_processed": len(results), "details": results}