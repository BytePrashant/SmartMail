from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List
import json
import logging

from ..services.email_service import email_service
from ..services.template_service import template_service
from ..models.email import (
    ContactData,
    EmailTemplate,
    EmailPreview,
    EmailBatchResponse,
    FileUploadResponse
)
from ..core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix=settings.API_V1_STR)

@router.post("/upload-data", response_model=FileUploadResponse)
async def upload_data(file: UploadFile = File(...)):
    """
    Upload and parse contact data file (CSV or XLSX).
    
    The file should contain at least an 'Email' column, and optionally
    'Full Name' and 'Company Name' columns for personalization.
    """
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        if not file.filename.lower().endswith(tuple(settings.ALLOWED_FILE_TYPES)):
            raise HTTPException(
                status_code=400,
                detail=f"Only {', '.join(settings.ALLOWED_FILE_TYPES)} files are supported"
            )
        
        # Read file content
        file_content = await file.read()
        
        # Check file size
        if len(file_content) > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE / 1024 / 1024}MB"
            )
        
        # Parse the file
        contacts = template_service.parse_file(file_content, file.filename)
        
        if not contacts:
            raise HTTPException(status_code=400, detail="No valid contacts found in file")
        
        return FileUploadResponse(
            message=f"Successfully parsed {len(contacts)} contacts from {file.filename}",
            data=contacts,
            count=len(contacts)
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing file upload: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.post("/generate-preview", response_model=List[EmailPreview])
async def generate_preview(
    subject: str = Form(...),
    body: str = Form(...),
    data: str = Form(...)
):
    """
    Generate email previews by merging template with contact data.
    
    Args:
        subject: Subject template with placeholders (e.g., "{name}, Prashant here...")
        body: Body template with placeholders
        data: JSON string of contact data from /upload-data
    """
    try:
        # Parse the data string back to list of dictionaries
        contact_data = json.loads(data)
        
        if not contact_data:
            raise HTTPException(status_code=400, detail="No contact data provided")
        
        # Convert to ContactData objects
        contacts = [ContactData(**item) for item in contact_data]
        
        # Generate previews
        previews = template_service.generate_preview(contacts, subject, body)
        
        if not previews:
            raise HTTPException(
                status_code=400,
                detail="No previews generated. Check your template placeholders."
            )
        
        return previews
    
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid data format")
    except Exception as e:
        logger.error(f"Error generating previews: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.post("/send-emails", response_model=EmailBatchResponse)
async def send_emails(
    subject: str = Form(...),
    body: str = Form(...),
    data: str = Form(...),
    max_per_run: int = Form(None),
    attachment: UploadFile = File(None)
):
    """
    Send emails in bulk with rate limiting and proper error handling.
    Optionally attach a PDF file to each email.
    """
    try:
        # Validate email settings
        if not settings.SENDER_EMAIL or not settings.SENDER_PASSWORD:
            raise HTTPException(
                status_code=500,
                detail="Email configuration not set. Please set SENDER_EMAIL and SENDER_PASSWORD in .env file."
            )
        # Parse the data string back to list of dictionaries
        contact_data = json.loads(data)
        if not contact_data:
            raise HTTPException(status_code=400, detail="No contact data provided")
        # Convert to ContactData objects
        contacts = [ContactData(**item) for item in contact_data]
        # Generate emails
        emails = template_service.generate_emails(contacts, subject, body)
        if not emails:
            raise HTTPException(
                status_code=400,
                detail="No emails generated. Check your template placeholders."
            )
        # Read attachment if provided
        attachment_bytes = None
        attachment_filename = None
        if attachment is not None:
            attachment_bytes = await attachment.read()
            attachment_filename = attachment.filename
        # Send emails (pass attachment info)
        result = email_service.send_batch_emails(emails, max_per_run, attachment_bytes=attachment_bytes, attachment_filename=attachment_filename)
        return result
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid data format")
    except Exception as e:
        logger.error(f"Error sending emails: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "message": "SmartMail API is running"} 