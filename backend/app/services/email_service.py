import smtplib
import time
import random
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging
from ..core.config import settings
from ..models.email import EmailStatus, EmailBatchResponse, EmailConfig

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self, config: Optional[EmailConfig] = None):
        # Use provided config or fall back to settings
        if config:
            self.smtp_server = config.smtp_server
            self.smtp_port = config.smtp_port
            self.sender_email = config.sender_email
            self.sender_password = config.sender_password
            self.use_tls = config.use_tls
        else:
            # Fallback to environment variables (for backward compatibility)
            self.smtp_server = settings.SMTP_SERVER
            self.smtp_port = settings.SMTP_PORT
            self.sender_email = settings.SENDER_EMAIL
            self.sender_password = settings.SENDER_PASSWORD
            self.use_tls = True
        
        # Validate email settings
        if not self.sender_email or not self.sender_password:
            logger.warning("Email credentials not configured. Set SENDER_EMAIL and SENDER_PASSWORD in .env file or use EmailConfig.")
    
    def _create_email_message(self, to_email: str, subject: str, body: str, attachment_bytes: bytes = None, attachment_filename: str = None) -> MIMEMultipart:
        """Create an email message with the given parameters and optional PDF attachment."""
        msg = MIMEMultipart()
        msg['From'] = self.sender_email
        msg['To'] = to_email
        msg['Subject'] = subject
        msg['Precedence'] = 'bulk'  # Hint to mail servers
        msg.attach(MIMEText(str(body), 'plain'))
        # Attach PDF if provided
        if attachment_bytes and attachment_filename:
            from email.mime.application import MIMEApplication
            part = MIMEApplication(attachment_bytes, Name=attachment_filename)
            part['Content-Disposition'] = f'attachment; filename="{attachment_filename}"'
            msg.attach(part)
        return msg
    
    def _connect_smtp(self) -> smtplib.SMTP:
        """Establish SMTP connection with proper error handling."""
        try:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.ehlo()
            
            if self.use_tls:
                server.starttls()
                server.ehlo()
            
            server.login(self.sender_email, self.sender_password)
            return server
        except Exception as e:
            logger.error(f"Failed to connect to SMTP server: {str(e)}")
            raise
    
    def test_connection(self) -> bool:
        """Test SMTP connection without sending an email."""
        try:
            with self._connect_smtp() as server:
                logger.info("SMTP connection test successful")
                return True
        except Exception as e:
            logger.error(f"SMTP connection test failed: {str(e)}")
            return False

    def send_single_email(self, to_email: str, subject: str, body: str, attachment_bytes: bytes = None, attachment_filename: str = None) -> EmailStatus:
        """Send a single email and return its status, with optional PDF attachment."""
        status = EmailStatus(
            recipient=to_email,
            status="pending",
            sent_at=None
        )
        try:
            # Create message
            msg = self._create_email_message(to_email, subject, body, attachment_bytes, attachment_filename)
            # Connect and send
            with self._connect_smtp() as server:
                server.send_message(msg)
            # Update status
            status.status = "sent"
            status.sent_at = datetime.now()
            status.message = "Email sent successfully"
            logger.info(f"Email sent to {to_email}")
        except Exception as e:
            status.status = "failed"
            status.message = str(e)
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return status
    
    def send_batch_emails(
        self,
        emails: List[Dict[str, Any]],
        max_per_run: Optional[int] = None,
        attachment_bytes: bytes = None,
        attachment_filename: str = None
    ) -> EmailBatchResponse:
        """
        Send a batch of emails with rate limiting and proper error handling.
        Optionally attach a PDF file to each email.
        """
        if not emails:
            return EmailBatchResponse(
                message="No emails to send",
                success_count=0,
                error_count=0,
                results=[]
            )
        # Use settings or provided max
        max_per_run = max_per_run or settings.MAX_EMAILS_PER_RUN
        emails_to_send = emails[:max_per_run]
        results: List[EmailStatus] = []
        success_count = 0
        error_count = 0
        # Process in batches
        for i, email_data in enumerate(emails_to_send):
            try:
                # Send email with optional attachment
                status = self.send_single_email(
                    email_data['email'],
                    email_data['subject'],
                    email_data['body'],
                    attachment_bytes=attachment_bytes,
                    attachment_filename=attachment_filename
                )
                # Update counts
                if status.status == "sent":
                    success_count += 1
                else:
                    error_count += 1
                results.append(status)
                # Add delay between emails
                if i < len(emails_to_send) - 1:  # Don't delay after the last email
                    delay = random.uniform(
                        settings.DELAY_MIN_SECONDS,
                        settings.DELAY_MAX_SECONDS
                    )
                    time.sleep(delay)
                # Add batch delay
                if (i + 1) % settings.BATCH_SIZE == 0 and i < len(emails_to_send) - 1:
                    logger.info(f"Batch of {settings.BATCH_SIZE} emails sent. Pausing for {settings.BATCH_DELAY_SECONDS} seconds...")
                    time.sleep(settings.BATCH_DELAY_SECONDS)
            except Exception as e:
                logger.error(f"Unexpected error in batch processing: {str(e)}")
                error_count += 1
                results.append(EmailStatus(
                    recipient=email_data.get('email', 'unknown'),
                    status="failed",
                    message=f"Batch processing error: {str(e)}"
                ))
        return EmailBatchResponse(
            message=f"Batch processing completed. {success_count} successful, {error_count} failed.",
            success_count=success_count,
            error_count=error_count,
            results=results
        )

# Create a singleton instance
email_service = EmailService() 