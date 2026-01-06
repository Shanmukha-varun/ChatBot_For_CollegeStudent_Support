import os
import hashlib
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

class AnitsBrain:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.persist_directory = "./chroma_db"
        
        
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash", 
            temperature=0.1,
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )

    def ingest_text(self, text_data: str, source_name: str):
        """Chunks text and saves it to the vector database with duplicate prevention."""
        splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=150)
        chunks = splitter.split_text(text_data)
        
        docs = []
        ids = []
        
        for i, t in enumerate(chunks):
            content_hash = hashlib.md5(t.encode()).hexdigest()
            unique_id = f"{source_name}_{i}_{content_hash}"
            docs.append(Document(page_content=t, metadata={"source": source_name}))
            ids.append(unique_id)
        
        vector_db = Chroma(
            persist_directory=self.persist_directory,
            embedding_function=self.embeddings
        )
        
        vector_db.add_documents(documents=docs, ids=ids)
        return f"Successfully processed {len(chunks)} chunks from {source_name}"

    def ask(self, query: str):
        query_lower = query.lower()
        
        # =========================================================
        # 📅 NEW FEATURE: SMART CALENDAR TRIGGERS
        # =========================================================
        # Replace with your actual Ngrok URL if deploying remotely
        BASE_URL = "http://127.0.0.1:8000/static"

        if "calendar" in query_lower:
            # CASE 1: M.Tech Requests
            if any(x in query_lower for x in ["m.tech", "mtech", "masters"]):
                return (
                    "📅 **M.Tech Academic Calendar (2025-26):**\n\n"
                    f"[📥 Download M.Tech Calendar]({BASE_URL}/calendar_mtech.pdf)"
                )

            # CASE 2: 1st Year B.Tech Requests
            if any(x in query_lower for x in ["1st year", "first year", "freshers"]):
                return (
                    "📅 **First Year B.Tech Academic Calendar (2025-26):**\n\n"
                    f"[📥 Download 1st Year Calendar]({BASE_URL}/calendar_1st_year.pdf)"
                )

            # CASE 3: Senior B.Tech (2nd, 3rd, 4th Years) or General "Engineering"
            if any(x in query_lower for x in ["2nd year", "3rd year", "4th year", "senior", "b.tech", "engineering"]):
                return (
                    "📅 **B.Tech Academic Calendar (2nd, 3rd & 4th Years):**\n\n"
                    f"[📥 Download Senior B.Tech Calendar]({BASE_URL}/calendar_btech_seniors.pdf)"
                )
            
            # CASE 4: Ambiguous Request (Show All Options)
            return (
                "Which Academic Calendar do you need?\n\n"
                f"1. [📥 First Year B.Tech]({BASE_URL}/calendar_1st_year.pdf)\n"
                f"2. [📥 Senior B.Tech (2/3/4 Years)]({BASE_URL}/calendar_btech_seniors.pdf)\n"
                f"3. [📥 M.Tech]({BASE_URL}/calendar_mtech.pdf)"
            )

        if "syllabus" in query_lower and "download" in query_lower:
            if "1-1" in query_lower or "1st year 1st sem" in query_lower:
                return f"📚 **CSE 1-1 Syllabus:**\n[📥 Download PDF]({BASE_URL}/syllabus_cse_1-1.pdf)"
            if "1-2" in query_lower or "1st year 2nd sem" in query_lower:
                return f"📚 **CSE 1-2 Syllabus:**\n[📥 Download PDF]({BASE_URL}/syllabus_cse_1-2.pdf)"
            if "2-1" in query_lower or "2nd year 1st sem" in query_lower:
                return f"📚 **CSE 2-1 Syllabus:**\n[📥 Download PDF]({BASE_URL}/syllabus_cse_2-1.pdf)"
            if "3-1" in query_lower or "3rd year 1st sem" in query_lower:
                return f"📚 **CSE 3-1 Syllabus:**\n[📥 Download PDF]({BASE_URL}/syllabus_cse_3-1.pdf)"
            if "3-2" in query_lower or "3rd year 2nd sem" in query_lower:
                return f"📚 **CSE 3-2 Syllabus:**\n[📥 Download PDF]({BASE_URL}/syllabus_cse_3-2.pdf)"
            
            return "Which semester syllabus do you want to download? (e.g., 'Download syllabus for 3-1')"

        # =========================================================
        # 🧠 EXISTING LOGIC (Vector Search & AI Analysis)
        # =========================================================
        
        if not os.path.exists(self.persist_directory):
            return "The database is empty."

        vector_db = Chroma(
            persist_directory=self.persist_directory, 
            embedding_function=self.embeddings
        )
        
        docs = vector_db.similarity_search(query, k=15)
        
        if not docs:
            return "I couldn't find any relevant info."

        context_list = []
        for d in docs:
            source = d.metadata.get('source', 'Unknown Source')
            context_list.append(f"SOURCE: {source}\nCONTENT: {d.page_content}")
        
        context = "\n---\n".join(context_list)
        
        # --- PREVIOUS PLACEMENT & DATA PROMPT (UNCHANGED) ---
        prompt = f"""
        You are the ANITS College Assistant. Answer based strictly on the context.
        ### 🌍 LANGUAGE RULES:
        1. **If the user asks in Telugu, ANSWER IN TELUGU.**
        2. **If the user asks in Hindi, ANSWER IN HINDI.**
        3. **If the user asks in English, ANSWER IN ENGLISH.**
        CRITICAL INSTRUCTIONS FOR DATA:
        1. **Search inside the text:** The year (e.g., "2022") might be in the table header or the row, not just the filename.
        2. **Table Handling:** If you see a company name (like "Infosys") and a number nearby, check if there is a year associated with that section.
        3. **Assumption:** If the user asks for "2022" and you see data labeled "2021-22" or "2022 Batch", count that as a match.
        4. **Extraction:** If you find the count, return just the number and the context.
        
        Example Logic:
        - Found "Infosys" -> Check text for "2022" -> Found "Selects: 140" -> Answer: "140 students were selected."

        - For placements: Look at the tables. Note that 'Minimum Salary','Maximum Salary', 'Medain Salary' and 'Total Placements' are usually at the bottom.
        - For general info: Look for the '00_webpage_content.txt' source.
        - If the year is not specified, assume the user is asking about the latest available data (2025)

        ### 📚 MODE C: SYLLABUS & CURRICULUM
        - **Subject Queries:** If asking about a subject (e.g., "Syllabus for Java", "Units in Python"), summarize the Unit Titles or Topics found.
        - **Textbooks:** If asking for textbooks, look for the "Text Books" section in the syllabus files.
        - **Credits:** Check the Course Structure tables for credit information.
        
        CONTEXT:
        {context}
        
        QUESTION: {query}
        """
        
        response = self.llm.invoke(prompt)
        return response.content
