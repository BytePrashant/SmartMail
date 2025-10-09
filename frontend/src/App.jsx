import { useState, useEffect } from 'react'
import './App.css'
import FileUpload from './components/FileUpload';
import TemplateForm from './components/TemplateForm';
import PreviewTable from './components/PreviewTable';
import SendButton from './components/SendButton';
import InstructionModal from './components/InstructionModal';
import SendProgressModal from './components/SendProgressModal';
import EmailConfigModal from './components/EmailConfigModal';

import apiFetch from './api';
import useUserId from './hooks/useUserId';
import useSendProgress from './hooks/useSendProgress';

function App() {
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [data, setData] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [randomPreviewRows, setRandomPreviewRows] = useState([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({ title: '', message: '', isError: false });
  const [showEmailConfig, setShowEmailConfig] = useState(false);
  const [emailConfigStatus, setEmailConfigStatus] = useState(null);
  const [emailConfig, setEmailConfig] = useState(null);

  const {
    showProgress,
    progressCurrent,
    progressDone,
    progressTotal,
    progressEstimated,
    startSend,
    reset: resetProgress,
  } = useSendProgress();

  const userId = useUserId();

  useEffect(() => {
    if (userId) checkEmailConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const checkEmailConfig = async () => {
    try {
      const data = await apiFetch('/api/v1/email-config', { userId });
      setEmailConfigStatus(data.success);
      if (data.success && data.config) setEmailConfig(data.config);
    } catch {
      setEmailConfigStatus(false);
    }
  };

  const handleFileSelect = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await apiFetch('/api/v1/upload-data', {
        method: 'POST',
        body: formData,
        userId,
      });
      setData(result.data);
      setMessageModalContent({ title: 'Upload Successful', message: result.message || 'File uploaded successfully!', isError: false });
      setShowMessageModal(true);
    } catch (error) {
      setMessageModalContent({ title: 'Upload Failed', message: error.message, isError: true });
      setShowMessageModal(true);
    }
  };

  const handlePreview = (e) => {
    e.preventDefault();
    // Pick 3 random rows from data
    let sample = [];
    if (data.length <= 3) {
      sample = [...data];
    } else {
      const used = new Set();
      while (sample.length < 3) {
        const idx = Math.floor(Math.random() * data.length);
        if (!used.has(idx)) {
          used.add(idx);
          sample.push(data[idx]);
        }
      }
    }
    setRandomPreviewRows(sample);
    setPreviewIdx(0);
    setStep(2);
  };

  const handleSendEmails = async () => {
    if (!emailConfigStatus) {
      setMessageModalContent({ title: 'Email Configuration Required', message: 'Please configure your email settings before sending emails.', isError: true });
      setShowMessageModal(true);
      return;
    }

    try {
      await startSend({ subject, body, data, pdfFile, userId, onError: err => {
        setMessageModalContent({ title: 'Send Failed', message: err.message, isError: true });
        setShowMessageModal(true);
      }});
    } catch {
      // errors handled in onError
    }
  };

  const handleReturnToFront = () => {
    resetProgress();
    setStep(1);
  };

  const handleConfigSaved = () => {
    setEmailConfigStatus(true);
    checkEmailConfig();
    setMessageModalContent({ title: 'Configuration Saved', message: 'Email configuration saved successfully!', isError: false });
    setShowMessageModal(true);
  };

  return (
    <div className="app-container">
      <InstructionModal isOpen={showModal} onClose={() => setShowModal(false)} />
      {!showModal && (
        <button
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1001,
            padding: '8px 16px',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
          onClick={() => setShowModal(true)}
        >
          Show Instructions
        </button>
      )}
      <SendProgressModal
        isOpen={showProgress}
        total={progressTotal}
        current={progressCurrent}
        estimatedTime={progressEstimated}
        isDone={progressDone}
        onClose={() => resetProgress()}
        onReturnToFront={handleReturnToFront}
      />
      <SendProgressModal
        isOpen={showMessageModal}
        showOnlyMessage={true}
        title={messageModalContent.title}
        message={messageModalContent.message}
        isError={messageModalContent.isError}
        onClose={() => setShowMessageModal(false)}
      />
      <EmailConfigModal
        isOpen={showEmailConfig}
        onClose={() => setShowEmailConfig(false)}
        onConfigSaved={handleConfigSaved}
        userId={userId}
      />
      <h2>SmartMail</h2>
      
      {/* Email Configuration Status */}
      <div style={{ marginBottom: 16 }}>
        {emailConfigStatus ? (
          <div style={{ 
            color: '#059669', 
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f0fdf4',
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #bbf7d0'
          }}>
            <div>
              ✅ Ready to send emails!
              {emailConfig && (
                <div style={{ fontSize: 14, color: '#047857', marginTop: 4 }}>
                  Using: {emailConfig.sender_email}
                </div>
              )}
            </div>
            <button
              style={{
                padding: '6px 12px',
                background: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 14,
              }}
              onClick={() => setShowEmailConfig(true)}
            >
              Change Email
            </button>
          </div>
        ) : (
          <div style={{ 
            color: '#dc2626', 
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fef2f2',
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #fecaca'
          }}>
            <div>
              📧 Setup Required
              <div style={{ fontSize: 14, color: '#991b1b', marginTop: 4 }}>
                Enter your Gmail address to get started
              </div>
            </div>
            <button
              style={{
                padding: '6px 12px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 14,
              }}
              onClick={() => setShowEmailConfig(true)}
            >
              Setup Email
            </button>
          </div>
        )}
      </div>

      {step === 1 && (
        <>
          <FileUpload onFileSelect={handleFileSelect} />
          <TemplateForm
            subject={subject}
            body={body}
            onSubjectChange={setSubject}
            onBodyChange={setBody}
          />
          <div style={{ margin: '16px 0' }}>
            <label htmlFor="pdf-upload">Attach PDF to all emails: </label>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={e => setPdfFile(e.target.files[0])}
            />
            {pdfFile && <span className="pdf-filename" style={{ marginLeft: 8 }}>{pdfFile.name}</span>}
          </div>
          <button
            className="send-btn"
            style={{ marginTop: 8 }}
            onClick={handlePreview}
          >
            Preview
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            <button
              onClick={() => setPreviewIdx(idx => Math.max(0, idx - 1))}
              disabled={previewIdx === 0}
              style={{
                fontSize: 24,
                padding: '4px 12px',
                borderRadius: 4,
                border: 'none',
                background: previewIdx === 0 ? '#eee' : '#1976d2',
                color: previewIdx === 0 ? '#aaa' : 'white',
                cursor: previewIdx === 0 ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
              aria-label="Previous"
            >
              &#8592;
            </button>
            <div style={{ minWidth: 720 }}>
              {randomPreviewRows.length > 0 && (
                <PreviewTable
                  data={[randomPreviewRows[previewIdx]]}
                  subject={subject}
                  body={body}
                />
              )}
              <div style={{ textAlign: 'center', marginTop: 8, color: '#555', fontWeight: 500 }}>
                {randomPreviewRows.length > 0 && `${previewIdx + 1} / ${randomPreviewRows.length}`}
              </div>
            </div>
            <button
              onClick={() => setPreviewIdx(idx => Math.min(randomPreviewRows.length - 1, idx + 1))}
              disabled={previewIdx === randomPreviewRows.length - 1}
              style={{
                fontSize: 24,
                padding: '4px 12px',
                borderRadius: 4,
                border: 'none',
                background: previewIdx === randomPreviewRows.length - 1 ? '#eee' : '#1976d2',
                color: previewIdx === randomPreviewRows.length - 1 ? '#aaa' : 'white',
                cursor: previewIdx === randomPreviewRows.length - 1 ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
              aria-label="Next"
            >
              &#8594;
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24 }}>
            <button
              className="send-btn"
              style={{ marginTop: 18 }}
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <SendButton
              onClick={handleSendEmails}
              disabled={!data.length || !emailConfigStatus}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default App
