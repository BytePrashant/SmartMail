import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FileUpload from './components/FileUpload';
import TemplateForm from './components/TemplateForm';
import PreviewTable from './components/PreviewTable';
import SendButton from './components/SendButton';
import InstructionModal from './components/InstructionModal';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [data, setData] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [showModal, setShowModal] = useState(true);

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
        throw new Error(errorData.detail || 'File upload failed');
      }

      const result = await response.json();
      setData(result.data); // Update your data state with the contacts from backend
      alert(result.message); // Optional: show a success message
    } catch (error) {
      alert(error.message);
    }
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSendEmails = async () => {
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
        throw new Error(errorData.detail || 'Failed to send emails');
      }

      const result = await response.json();
      alert(result.message || 'Emails sent successfully!');
    } catch (error) {
      alert(error.message);
    }
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
      <h2>SmartMail</h2>
      {step === 1 && (
        <>
          <FileUpload onFileSelect={handleFileSelect} />
          <TemplateForm
            subject={subject}
            body={body}
            onSubjectChange={setSubject}
            onBodyChange={setBody}
            onSubmit={handlePreview}
          />
          <div style={{ margin: '16px 0' }}>
            <label htmlFor="pdf-upload">Attach PDF to all emails: </label>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={e => setPdfFile(e.target.files[0])}
            />
            {pdfFile && <span style={{ marginLeft: 8 }}>{pdfFile.name}</span>}
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <PreviewTable data={data.slice(0, 3)} subject={subject} body={body} />
          <SendButton
            onClick={handleSendEmails}
            disabled={!data.length}
          />
        </>
      )}
    </div>
  )
}

export default App
