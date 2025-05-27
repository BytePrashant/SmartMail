import React from 'react';

// Helper function to replace placeholders in the template
function mergeTemplate(template, row) {
  return template.replace(/\{(\w+)\}/g, (_, key) => row[key] || '');
}

function PreviewTable({ data, subject, body }) {
  if (!data || data.length === 0) {
    return <p>No data to preview.</p>;
  }

  return (
    <div>
      <h3>Email Preview</h3>
      <table className="email-preview-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Recipient</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Subject</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Body</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{row.email || '-'}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{mergeTemplate(subject, row)}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <div className="email-body-box">{mergeTemplate(body, row)}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PreviewTable;
