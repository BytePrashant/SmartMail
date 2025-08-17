# Email Configuration Template
# Copy this file to .env in the backend directory and fill in your actual values

# SMTP Server Settings
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587

# Your Email Credentials
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password

# Note: For Gmail, you need to use an App Password, not your regular password
# To generate an App Password:
# 1. Enable 2-factor authentication on your Google account
# 2. Go to Google Account settings > Security > App passwords
# 3. Generate a new app password for "Mail"

# Alternative email services:
# Outlook/Hotmail: SMTP_SERVER=smtp-mail.outlook.com, SMTP_PORT=587
# Yahoo: SMTP_SERVER=smtp.mail.yahoo.com, SMTP_PORT=587
# Custom SMTP: Use your email provider's SMTP settings
