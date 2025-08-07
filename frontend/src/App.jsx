import { useState, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FileUpload from './components/FileUpload';
import TemplateForm from './components/TemplateForm';
import PreviewTable from './components/PreviewTable';
import SendButton from './components/SendButton';
import InstructionModal from './components/InstructionModal';
import SendProgressModal from './components/SendProgressModal';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [data, setData] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [randomPreviewRows, setRandomPreviewRows] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [progressCurrent, setProgressCurrent] = useState(0);
  const [progressDone, setProgressDone] = useState(false);
  const [progressTotal, setProgressTotal] = useState(0);
  const [progressEstimated, setProgressEstimated] = useState(0);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({ title: '', message: '', isError: false });

  const handleFileSelect = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/upload-data`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessageModalContent({
          title: 'Upload Failed',
          message: errorData.detail || 'File upload failed',
          isError: true,
        });
        setShowMessageModal(true);
        throw new Error(errorData.detail || 'File upload failed');
      }

      const result = await response.json();
      setData(result.data); // Update your data state with the contacts from backend
      setMessageModalContent({
        title: 'Upload Successful',
        message: result.message || 'File uploaded successfully!',
        isError: false,
      });
      setShowMessageModal(true);
    } catch (error) {
      if (!showMessageModal) {
        setMessageModalContent({
          title: 'Upload Failed',
          message: error.message,
          isError: true,
        });
        setShowMessageModal(true);
      }
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
    setShowProgress(true);
    setProgressCurrent(0);
    setProgressDone(false);
    setProgressTotal(data.length);
    const DELAY_PER_EMAIL = 10; // seconds (updated)
    setProgressEstimated(Math.round(data.length * DELAY_PER_EMAIL));

    // Simulate progress
    let sent = 0;
    const interval = setInterval(() => {
      sent++;
      setProgressCurrent(c => Math.min(c + 1, data.length));
      setProgressEstimated(e => Math.max(e - DELAY_PER_EMAIL, 0));
      if (sent >= data.length) {
        clearInterval(interval);
      }
    }, DELAY_PER_EMAIL * 1000);

    try {
      const response = await fetch(`${API_URL}/send-emails`, {
        method: 'POST',
        body: (() => {
          const formData = new FormData();
          formData.append('subject', subject);
          formData.append('body', body);
          formData.append('data', JSON.stringify(data));
          if (pdfFile) {
            formData.append('attachment', pdfFile);
          }
          return formData;
        })(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setProgressDone(true);
        setMessageModalContent({
          title: 'Send Failed',
          message: errorData.detail || 'Failed to send emails',
          isError: true,
        });
        setShowMessageModal(true);
        throw new Error(errorData.detail || 'Failed to send emails');
      }

      const result = await response.json();
      setProgressCurrent(data.length);
      setProgressEstimated(0);
      setProgressDone(true);
      // Optionally, you can show a success message here or after closing the modal
    } catch (error) {
      setProgressDone(true);
      setMessageModalContent({
        title: 'Send Failed',
        message: error.message,
        isError: true,
      });
      setShowMessageModal(true);
    }
  };

  // Handler to return to front page after sending
  const handleReturnToFront = () => {
    setShowProgress(false);
    setStep(1);
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
        onClose={() => setShowProgress(false)}
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
      <h2>SmartMail</h2>
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
              disabled={!data.length}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default App
