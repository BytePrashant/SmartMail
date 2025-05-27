import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FileUpload from './components/FileUpload';
import TemplateForm from './components/TemplateForm';
import PreviewTable from './components/PreviewTable';
import SendButton from './components/SendButton';

function App() {
  const [count, setCount] = useState(0)
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Mock data for preview
  const [data, setData] = useState([
    { name: 'Alice', company: 'Acme', email: 'alice@acme.com' },
    { name: 'Bob', company: 'BetaCorp', email: 'bob@betacorp.com' },
  ]);

  const handleFileSelect = (file) => {
    console.log('Selected file:', file);
    // In the future, parse the file and setData with real data
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
    // For now, just log the subject and body
    console.log('Subject:', subject);
    console.log('Body:', body);
  };

  return (
    <div className="app-container">
      <h2>SmartMail</h2>
      <FileUpload onFileSelect={handleFileSelect} />
      <TemplateForm
        subject={subject}
        body={body}
        onSubjectChange={setSubject}
        onBodyChange={setBody}
        onSubmit={handlePreview}
      />
      {showPreview && (
        <>
          <PreviewTable data={data} subject={subject} body={body} />
          <SendButton
            onClick={() => {
              // For now, just log to console
              console.log('Sending emails...');
            }}
            disabled={!showPreview || !data.length}
          />
        </>
      )}
    </div>
  )
}

export default App
