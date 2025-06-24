import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FileUpload from './components/FileUpload';
import TemplateForm from './components/TemplateForm';
import PreviewTable from './components/PreviewTable';
import SendButton from './components/SendButton';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [data, setData] = useState([]);


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

  return (
    <div className="app-container">
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
        </>
      )}
      {step === 2 && (
        <>
          <PreviewTable data={data.slice(0, 3)} subject={subject} body={body} />
          <SendButton
            onClick={() => {
              // send emails logic
            }}
            disabled={!data.length}
          />
        </>
      )}
    </div>
  )
}

export default App
