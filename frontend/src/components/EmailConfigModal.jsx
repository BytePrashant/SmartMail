import React, { useState, useEffect } from 'react';

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
};

const modalStyle = {
  background: 'white',
  borderRadius: 12,
  padding: '40px 32px',
  boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
  minWidth: 400,
  maxWidth: 600,
  width: '90%',
  position: 'relative',
  textAlign: 'center',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const closeBtnStyle = {
  position: 'absolute',
  top: 12,
  right: 12,
  background: 'transparent',
  border: 'none',
  fontSize: 28,
  cursor: 'pointer',
  color: '#888',
  fontWeight: 'bold',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: 6,
  fontSize: 16,
  marginBottom: 16,
};

const buttonStyle = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: 6,
  fontSize: 16,
  cursor: 'pointer',
  margin: '8px',
  transition: 'background 0.2s',
};

const stepStyle = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  padding: 16,
  marginBottom: 16,
  textAlign: 'left',
};

const stepNumberStyle = {
  background: '#2563eb',
  color: 'white',
  borderRadius: '50%',
  width: 24,
  height: 24,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  fontWeight: 'bold',
  marginRight: 12,
};

const EmailConfigModal = ({ isOpen, onClose, onConfigSaved, userId }) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCurrentConfig();
    }
  }, [isOpen]);

  const loadCurrentConfig = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/email-config`, {
        headers: {
          'X-User-ID': userId
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.config) {
          setEmailAddress(data.config.sender_email || '');
        }
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const testConfig = async () => {
    if (!emailAddress || !appPassword) {
      setError('Please fill in both fields');
      return;
    }

    setIsLoading(true);
    setTestResult(null);
    setError('');

    try {
      // Auto-detect email provider and use appropriate settings
      let config;
      if (emailAddress.includes('@gmail.com')) {
        config = {
          smtp_server: 'smtp.gmail.com',
          smtp_port: 587,
          use_tls: true,
          sender_email: emailAddress,
          sender_password: appPassword,
        };
      } else if (emailAddress.includes('@outlook.com') || emailAddress.includes('@hotmail.com')) {
        config = {
          smtp_server: 'smtp-mail.outlook.com',
          smtp_port: 587,
          use_tls: true,
          sender_email: emailAddress,
          sender_password: appPassword,
        };
      } else {
        // Default to Gmail settings for other providers
        config = {
          smtp_server: 'smtp.gmail.com',
          smtp_port: 587,
          use_tls: true,
          sender_email: emailAddress,
          sender_password: appPassword,
        };
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/email-config/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setError('Failed to test configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!emailAddress || !appPassword) {
      setError('Please fill in both fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Auto-detect email provider and use appropriate settings
      let config;
      if (emailAddress.includes('@gmail.com')) {
        config = {
          smtp_server: 'smtp.gmail.com',
          smtp_port: 587,
          use_tls: true,
          sender_email: emailAddress,
          sender_password: appPassword,
        };
      } else if (emailAddress.includes('@outlook.com') || emailAddress.includes('@hotmail.com')) {
        config = {
          smtp_server: 'smtp-mail.outlook.com',
          smtp_port: 587,
          use_tls: true,
          sender_email: emailAddress,
          sender_password: appPassword,
        };
      } else {
        // Default to Gmail settings for other providers
        config = {
          smtp_server: 'smtp.gmail.com',
          smtp_port: 587,
          use_tls: true,
          sender_email: emailAddress,
          sender_password: appPassword,
        };
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/email-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();
      if (data.success) {
        onConfigSaved();
        onClose();
      } else {
        setError(data.message || 'Failed to save configuration');
      }
    } catch (error) {
      setError('Failed to save configuration');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button style={closeBtnStyle} onClick={onClose} aria-label="Close">&times;</button>
        <h2>📧 Setup Your Email</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>
          Just enter your email and we'll help you set it up!
        </p>

        <div style={{ textAlign: 'left', marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            Your Email Address:
          </label>
          <input
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            placeholder="your-email@gmail.com"
            style={inputStyle}
          />
        </div>

        <div style={{ textAlign: 'left', marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            App Password:
          </label>
          <input
            type="password"
            value={appPassword}
            onChange={(e) => setAppPassword(e.target.value)}
            placeholder="Enter your app password"
            style={inputStyle}
          />
          <small style={{ color: '#666', fontSize: 12 }}>
            This is NOT your regular password! See help below.
          </small>
        </div>

        {error && (
          <div style={{ color: '#dc2626', marginBottom: 16 }}>
            {error}
          </div>
        )}

        {testResult && (
          <div style={{ 
            color: testResult.success ? '#059669' : '#dc2626', 
            marginBottom: 16,
            fontWeight: 500 
          }}>
            {testResult.message}
          </div>
        )}

        {/* Action Buttons */}
        {emailAddress && appPassword && (
          <div style={{ marginTop: 24 }}>
            <button
              style={{ ...buttonStyle, background: '#059669' }}
              onClick={testConfig}
              disabled={isLoading}
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              style={buttonStyle}
              onClick={saveConfig}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save & Use'}
            </button>
          </div>
        )}

        {/* Help Section */}
        <div style={{ marginTop: 24, textAlign: 'left' }}>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: '#2563eb',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: 14,
            }}
            onClick={() => setShowHelp(!showHelp)}
          >
            {showHelp ? 'Hide Help' : '❓ How to get an App Password for Gmail?'}
          </button>
          
          {showHelp && (
            <div style={{ marginTop: 16, fontSize: 14, color: '#666', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <h4 style={{ marginTop: 0, color: '#374151' }}>🔐 Gmail App Password Setup:</h4>
              
              <p style={{ marginBottom: 16 }}>
                Follow these simple steps to get your app password:
              </p>

              <div style={stepStyle}>
                <div style={{ marginBottom: 12 }}>
                  <span style={stepNumberStyle}>1</span>
                  <strong>Enable 2-Step Verification</strong>
                </div>
                <ul style={{ margin: '8px 0', paddingLeft: 20, marginLeft: 36 }}>
                  <li>Go to <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>Google Account Security</a></li>
                  <li>Click on <strong>"2-Step Verification"</strong></li>
                  <li>Click <strong>"Get Started"</strong></li>
                  <li>Follow the setup (usually involves your phone)</li>
                  <li><strong>Turn it ON</strong></li>
                </ul>
              </div>

              <div style={stepStyle}>
                <div style={{ marginBottom: 12 }}>
                  <span style={stepNumberStyle}>2</span>
                  <strong>Generate App Password</strong>
                </div>
                <ul style={{ margin: '8px 0', paddingLeft: 20, marginLeft: 36 }}>
                  <li>Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>App Passwords</a></li>
                  <li>Click <strong>"Select app"</strong> → Choose <strong>"Mail"</strong></li>
                  <li>Click <strong>"Select device"</strong> → Choose <strong>"Other (Custom name)"</strong></li>
                  <li>Type a name like <strong>"SmartMail"</strong></li>
                  <li>Click <strong>"Generate"</strong></li>
                  <li><strong>Copy the 16-character password</strong> (like: abcd efgh ijkl mnop)</li>
                </ul>
              </div>

              <div style={stepStyle}>
                <div style={{ marginBottom: 12 }}>
                  <span style={stepNumberStyle}>3</span>
                  <strong>Use in SmartMail</strong>
                </div>
                <ul style={{ margin: '8px 0', paddingLeft: 20, marginLeft: 36 }}>
                  <li>Paste the app password in the field above</li>
                  <li>Click <strong>"Test Connection"</strong> to verify</li>
                  <li>Click <strong>"Save & Use"</strong> to finish!</li>
                </ul>
              </div>

              <div style={{ background: '#fef3c7', padding: 12, borderRadius: 6, border: '1px solid #f59e0b', marginTop: 16 }}>
                <strong>💡 Important:</strong> Never use your regular Gmail password! Always use the app password you generated.
              </div>

              <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
                <strong>Need help?</strong> Check <a href="https://support.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>Google Support</a> or contact their help team.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailConfigModal;

