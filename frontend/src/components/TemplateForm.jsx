import React from 'react';

function TemplateForm({ subject, body, onSubjectChange, onBodyChange }) {
  return (
    <form>
      <div>
        <label htmlFor="subject">Subject:</label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={e => onSubjectChange(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="body">Body Template:</label>
        <textarea
          id="body"
          value={body}
          onChange={e => onBodyChange(e.target.value)}
          required
          style={{ minHeight: '120px' }}
        />
      </div>
    </form>
  );
}

export default TemplateForm;
