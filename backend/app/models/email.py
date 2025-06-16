from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ContactData(BaseModel):
    """Model for contact data from uploaded files"""
    email: EmailStr
    full_name: Optional[str] = None
    company_name: Optional[str] = None
    # Add any other fields that might be in your CSV/XLSX

class EmailTemplate(BaseModel):
    """Model for email template with placeholders"""
    subject: str = Field(..., min_length=1, max_length=200)
    body: str = Field(..., min_length=1)
    
class EmailPreview(BaseModel):
    """Model for email preview"""
    recipient: EmailStr
    subject: str
    body: str
    data: Dict[str, Any]

class EmailStatus(BaseModel):
    """Model for email sending status"""
    recipient: EmailStr
    status: str  # 'pending', 'sent', 'failed'
    message: Optional[str] = None
    sent_at: Optional[datetime] = None

class EmailBatchResponse(BaseModel):
    """Model for batch email sending response"""
    message: str
    success_count: int
    error_count: int
    results: List[EmailStatus]

class FileUploadResponse(BaseModel):
    """Model for file upload response"""
    message: str
    data: List[ContactData]
    count: int 