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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {data.map((row, idx) => {
          // Prepend full name to subject
          const subjectPreview = `${row.full_name || ''}, ${mergeTemplate(subject, row)}`;
          // Prepend Hi, full name to body
          const bodyPreview = `Hi, ${row.full_name || ''}\n${mergeTemplate(body, row)}`;
          return (
            <div
              key={idx}
              style={{
                border: '1px solid #222',
                borderRadius: '10px',
                padding: '16px',
                width: '700px',
                background: '#181c20', // dark card background
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minHeight: '120px',
              }}
            >
              {/* Email Box */}
              <div style={{
                background: '#23272f', // dark blue-gray
                borderRadius: '6px',
                padding: '10px',
                border: '1px solid #2d323c',
                marginBottom: '0',
                color: '#e0e6ed',
                textAlign: 'left',
              }}>
                <div style={{ fontWeight: 500, fontSize: '11px', color: '#7fa2d6', marginBottom: '2px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Email</div>
                <div style={{ color: '#e0e6ed', fontSize: '15px', textAlign: 'left', wordBreak: 'break-all' }}>{row.email || '-'}</div>
              </div>
              {/* Subject Box */}
              <div style={{
                background: '#20232a', // slightly different dark
                borderRadius: '6px',
                padding: '10px',
                border: '1px solid #292d36',
                marginBottom: '0',
                color: '#e0e6ed',
                textAlign: 'left',
              }}>
                <div style={{ fontWeight: 500, fontSize: '11px', color: '#b3b8c3', marginBottom: '2px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Subject</div>
                <div style={{ color: '#e0e6ed', fontSize: '15px', textAlign: 'left', wordBreak: 'break-word' }}>{subjectPreview}</div>
              </div>
              {/* Body Box */}
              <div style={{
                background: '#181c20', // match card background for body
                borderRadius: '6px',
                padding: '10px',
                border: '1px solid #23272f',
                marginBottom: '0',
                color: '#e0e6ed',
                textAlign: 'left',
                fontSize: '13px',
              }}>
                <div style={{ fontWeight: 500, fontSize: '11px', color: '#b3b8c3', marginBottom: '2px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Body</div>
                <div style={{ color: '#e0e6ed', fontSize: '12px', textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{bodyPreview}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PreviewTable;
