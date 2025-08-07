import React from 'react';

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
  zIndex: 1000,
};

const modalStyle = {
  background: 'white',
  borderRadius: 12,
  padding: '56px 40px 48px 40px',
  boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
  maxWidth: 650,
  width: '95%',
  minHeight: '480px', // Increased height by about 20%
  position: 'relative',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const closeBtnStyle = {
  position: 'absolute',
  top: 18,
  right: 18,
  background: 'transparent',
  border: 'none',
  fontSize: 32,
  cursor: 'pointer',
  color: '#888',
  fontWeight: 'bold',
};

const tableStyle = {
  margin: '24px auto',
  borderCollapse: 'collapse',
  width: '100%',
};

const thtdStyle = {
  border: '1px solid #ddd',
  padding: '12px',
  fontSize: 16,
};

const InstructionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button style={closeBtnStyle} onClick={onClose} aria-label="Close">&times;</button>
        <h2>Welcome to SmartMail!</h2>
        <p>
          To get started, please upload an <strong>Excel</strong> or <strong>CSV</strong> file with the following columns:
        </p>
        <ul style={{ textAlign: 'left', margin: '0 auto 16px auto', maxWidth: 320, fontSize: 16 }}>
          <li><strong>Email</strong></li>
          <li><strong>Full Name</strong></li>
          <li><strong>Company Name</strong></li>
        </ul>
        <p>
          The application will use this information to generate dynamic emails for each recipient.
        </p>
        <div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thtdStyle}>Email</th>
                <th style={thtdStyle}>Full Name</th>
                <th style={thtdStyle}>Company Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={thtdStyle}>jane.doe@example.com</td>
                <td style={thtdStyle}>Jane Doe</td>
                <td style={thtdStyle}>Acme Corp</td>
              </tr>
              <tr>
                <td style={thtdStyle}>john.smith@example.com</td>
                <td style={thtdStyle}>John Smith</td>
                <td style={thtdStyle}>Beta Inc</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructionModal;
