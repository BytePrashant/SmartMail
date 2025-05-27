import React from 'react';

function FileUpload({ onFileSelect }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div>
      <label htmlFor="file-upload">Upload CSV or XLSX file:</label>
      <input
        id="file-upload"
        type="file"
        accept=".csv, .xlsx"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default FileUpload;