# SmartMail

A full-stack email automation tool with a React (Vite) frontend and FastAPI backend. Upload contact files, create email templates, preview personalized emails, and send them in bulk.

---

## 🚀 Features
- Upload CSV/XLSX contact files
- Enter email subject and body templates with placeholders (e.g., `{name}`, `{company}`)
- Preview personalized emails before sending
- Send bulk emails (backend logic to be implemented)
- Modern, dark-mode UI

---

## 🗂️ Project Structure
```
SmartMail/
├── frontend/      # React + Vite app
│   └── src/
│       ├── components/
│       ├── App.jsx
│       └── ...
├── backend/       # FastAPI app
│   ├── main.py
│   ├── email_utils.py
│   └── ...
└── README.md
```

---

## 🖥️ Frontend Setup (React + Vite)

### Prerequisites
- Node.js (v16+ recommended)

### Installation & Run
```bash
cd frontend
npm install
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🐍 Backend Setup (FastAPI)

### Prerequisites
- Python 3.8+

### Installation & Run
```bash
cd backend
python -m venv venv
# Activate the virtual environment:
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

pip install fastapi uvicorn python-multipart

uvicorn main:app --reload
```
Visit [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) for the interactive API docs.

---

## 🌐 How Frontend & Backend Communicate
- The React frontend makes HTTP requests to the FastAPI backend (usually at `http://localhost:8000`).
- Endpoints:
  - `POST /upload-data` — Upload and parse contact files
  - `POST /generate-preview` — Generate email previews
  - `POST /send-emails` — Send emails in bulk

---

## 📦 Future Enhancements
- Save/load templates
- Authentication
- HTML email support
- Email logs and status
- Progress bar and status updates

---

## 🤝 Contributing
Pull requests and suggestions are welcome!

---

## 📄 License
MIT
