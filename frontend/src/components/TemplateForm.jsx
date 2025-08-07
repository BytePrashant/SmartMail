import React from 'react';

function TemplateForm({ subject, body, onSubjectChange, onBodyChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
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
      <button type="submit">Preview</button>
    </form>
  );
}

export default TemplateForm;
