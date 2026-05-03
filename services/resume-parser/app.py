from fastapi import FastAPI, UploadFile, File
import pdfplumber

app = FastAPI()

@app.get("/")
def root():
    return {"status": "parser running 🚀"}

@app.post("/parse")
async def parse_resume(file: UploadFile = File(...)):
    try:
        text = ""
        if file.filename.endswith(".pdf"):
            with pdfplumber.open(file.file) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() or ""
        else:
            text = (await file.read()).decode("utf-8", errors="ignore")

        return {"text": text}
    except Exception as e:
        return {"error": str(e)}