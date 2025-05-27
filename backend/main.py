from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse

app = FastAPI()

@app.post("/upload-data")
async def upload_data(file: UploadFile = File(...)):
    # TODO: Parse the uploaded file and return the data
    return {"message": f"Received file: {file.filename}"}

@app.post("/generate-preview")
async def generate_preview(
    subject: str = Form(...),
    body: str = Form(...),
    data: str = Form(...)
):
    # TODO: Merge template with data and return preview
    return {"message": "Preview generated", "subject": subject, "body": body, "data": data}

@app.post("/send-emails")
async def send_emails(
    subject: str = Form(...),
    body: str = Form(...),
    data: str = Form(...)
):
    # TODO: Send emails and return status
    return {"message": "Emails sent", "subject": subject, "body": body, "data": data}
    
