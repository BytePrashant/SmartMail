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
  zIndex: 2000,
};

const modalStyle = {
  background: 'white',
  borderRadius: 12,
  padding: '40px 32px',
  boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
  minWidth: 340,
  maxWidth: 400,
  width: '90%',
  position: 'relative',
  textAlign: 'center',
};

const progressBarContainer = {
  width: '100%',
  background: '#e5e7eb',
  borderRadius: 8,
  height: 18,
  margin: '24px 0 12px 0',
  overflow: 'hidden',
};

const progressBar = percent => ({
  width: `${percent}%`,
  height: '100%',
  background: '#2563eb',
  transition: 'width 0.4s',
});

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

const iconStyle = {
  fontSize: 48,
  marginBottom: 12,
};

const SendProgressModal = ({
  isOpen,
  total,
  current,
  estimatedTime,
  isDone,
  onClose,
  title,
  message,
  isError,
  showOnlyMessage,
  onReturnToFront
}) => {
  if (!isOpen) return null;
  if (showOnlyMessage) {
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <button style={closeBtnStyle} onClick={onClose} aria-label="Close">&times;</button>
          <div>
            {isError ? (
              <span style={{ ...iconStyle, color: '#dc2626' }}>✖</span>
            ) : (
              <span style={{ ...iconStyle, color: '#059669' }}>✔</span>
            )}
          </div>
          <h2 style={{ color: isError ? '#dc2626' : '#059669' }}>{title}</h2>
          <div style={{ marginTop: 12, fontSize: 17 }}>{message}</div>
        </div>
      </div>
    );
  }
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {(isDone || isError) && (
          <button style={closeBtnStyle} onClick={onClose} aria-label="Close">&times;</button>
        )}
        <h2>{isDone ? 'All Emails Sent!' : 'Sending Emails...'}</h2>
        <div style={progressBarContainer}>
          <div style={progressBar(percent)} />
        </div>
        <div style={{ fontWeight: 500, fontSize: 18, marginBottom: 8 }}>
          {isDone
            ? `Sent ${total} of ${total} emails.`
            : `Sent ${current} of ${total} emails...`}
        </div>
        {!isDone && (
          <div style={{ color: '#555', fontSize: 15 }}>
            Estimated time left: {estimatedTime}s
          </div>
        )}
        {isDone && (
          <>
            <div style={{ color: '#059669', fontWeight: 600, marginTop: 12 }}>
              All emails have been sent successfully!
            </div>
            {onReturnToFront && (
              <button
                className="send-btn"
                style={{ marginTop: 24, width: '100%' }}
                onClick={onReturnToFront}
              >
                Go to Home
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SendProgressModal;
