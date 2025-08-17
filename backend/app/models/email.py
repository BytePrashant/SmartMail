from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ContactData(BaseModel):
    """Model for contact data from uploaded files"""
    email: EmailStr
    full_name: Optional[str] = None
    company_name: Optional[str] = None
    first_name: Optional[str] = None
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

class EmailConfig(BaseModel):
    """Model for email configuration"""
    smtp_server: str = Field(..., description="SMTP server (e.g., smtp.gmail.com)")
    smtp_port: int = Field(..., ge=1, le=65535, description="SMTP port (e.g., 587 for TLS)")
    sender_email: EmailStr = Field(..., description="Sender email address")
    sender_password: str = Field(..., min_length=1, description="App password or email password")
    use_tls: bool = Field(default=True, description="Use TLS encryption")

class EmailConfigResponse(BaseModel):
    """Model for email configuration response"""
    message: str
    success: bool
    config: Optional[EmailConfig] = None

class EmailTestResponse(BaseModel):
    """Model for email configuration test response"""
    message: str
    success: bool
    error: Optional[str] = None 