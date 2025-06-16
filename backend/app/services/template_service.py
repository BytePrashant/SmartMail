import pandas as pd
from typing import List, Dict, Any, Optional
import io
import logging
from ..models.email import ContactData, EmailPreview
from ..core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TemplateService:
    def parse_file(self, file_content: bytes, filename: str) -> List[ContactData]:
        """
        Parse CSV or XLSX file content and return list of ContactData objects.
        
        Args:
            file_content: Raw bytes of the uploaded file
            filename: Original filename (used to determine file type)
            
        Returns:
            List of ContactData objects
            
        Raises:
            ValueError: If file format is not supported or data is invalid
        """
        try:
            # Determine file type and read into DataFrame
            if filename.lower().endswith('.csv'):
                df = pd.read_csv(io.BytesIO(file_content))
            elif filename.lower().endswith('.xlsx'):
                df = pd.read_excel(io.BytesIO(file_content), engine='openpyxl')
            else:
                raise ValueError(f"Unsupported file format. Please upload CSV or XLSX files.")
            
            # Remove duplicates and empty emails
            df = df.drop_duplicates(subset=['Email']).dropna(subset=['Email'])
            
            # Convert DataFrame to list of ContactData objects
            contacts = []
            for _, row in df.iterrows():
                # Clean the data - convert NaN to None
                data = {k: (None if pd.isna(v) else str(v)) for k, v in row.items()}
                
                # Map column names to our model fields
                contact = ContactData(
                    email=data.get('Email', ''),
                    full_name=data.get('Full Name'),
                    company_name=data.get('Company Name')
                    # Add other fields as needed
                )
                contacts.append(contact)
            
            return contacts
            
        except Exception as e:
            logger.error(f"Error parsing file {filename}: {str(e)}")
            raise ValueError(f"Error parsing file: {str(e)}")
    
    def generate_preview(
        self,
        contacts: List[ContactData],
        subject_template: str,
        body_template: str
    ) -> List[EmailPreview]:
        """
        Generate email previews by merging templates with contact data.
        
        Args:
            contacts: List of ContactData objects
            subject_template: Subject template with placeholders
            body_template: Body template with placeholders
            
        Returns:
            List of EmailPreview objects
        """
        previews = []
        
        for contact in contacts:
            try:
                # Convert contact to dict for template formatting
                data = contact.model_dump()
                
                # Generate subject and body
                subject = subject_template.format(**data)
                body = body_template.format(**data)
                
                # Create preview
                preview = EmailPreview(
                    recipient=contact.email,
                    subject=subject,
                    body=body,
                    data=data
                )
                previews.append(preview)
                
            except KeyError as e:
                # Handle missing placeholder
                logger.warning(f"Missing placeholder {e} in template for {contact.email}")
                # You might want to handle this differently
                continue
            except Exception as e:
                logger.error(f"Error generating preview for {contact.email}: {str(e)}")
                continue
        
        return previews
    
    def generate_emails(
        self,
        contacts: List[ContactData],
        subject_template: str,
        body_template: str
    ) -> List[Dict[str, Any]]:
        """
        Generate email data for sending.
        
        Args:
            contacts: List of ContactData objects
            subject_template: Subject template with placeholders
            body_template: Body template with placeholders
            
        Returns:
            List of dictionaries with email, subject, and body
        """
        emails = []
        
        for contact in contacts:
            try:
                # Convert contact to dict for template formatting
                data = contact.model_dump()
                
                # Generate subject and body
                subject = subject_template.format(**data)
                body = body_template.format(**data)
                
                # Add to list
                emails.append({
                    'email': contact.email,
                    'subject': subject,
                    'body': body
                })
                
            except KeyError as e:
                logger.warning(f"Missing placeholder {e} in template for {contact.email}")
                continue
            except Exception as e:
                logger.error(f"Error generating email for {contact.email}: {str(e)}")
                continue
        
        return emails

# Create a singleton instance
template_service = TemplateService() 