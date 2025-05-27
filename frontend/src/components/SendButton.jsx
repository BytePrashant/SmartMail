import React from 'react';

function SendButton({ onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} className="send-btn">
      Send Emails
    </button>
  );
}

export default SendButton;
