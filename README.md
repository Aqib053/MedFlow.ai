# 🏥 MedFlow AI

**MedFlow AI** is an AI-powered hospital workflow and patient management system designed to streamline clinical operations, assist doctors with intelligent insights, and automate medical documentation.

Built using **React, TypeScript, Vite, Tailwind CSS**, and **Google Gemini AI**, MedFlow AI focuses on improving efficiency across hospital roles such as reception, triage, doctors, and pharmacy.

---

## ✨ Features

### 👤 Patient Management
- Patient registration and profile management  
- Role-based dashboards (Reception, Triage, Doctor)  
- Visit history, vitals, prescriptions, and reports  
- Clean, medical-grade UI optimized for clinicians  

---

### 📄 AI-Powered Medical Document Analysis
- Upload medical PDFs or reports  
- Automatic summarization of patient history  
- Extraction of symptoms, risks, and abnormalities  
- AI-generated clinical insights for doctors  

---

### 🤖 AI Clinical Assistant
- Doctor-facing AI chatbot  
- Report interpretation and clinical hints  
- Follow-up question suggestions  
- Non-prescriptive medication and lifestyle guidance  

---

### ❤️ Vitals & Monitoring
- Structured vitals entry  
- Trend-based visualization  
- AI-assisted vitals interpretation  
- Early warning indicators for abnormal values  

---

### 🗂️ Hospital Workflow Modules
- Reception & queue management  
- Triage priority assignment  
- Doctor consultation view  
- Pharmacy & billing modules  
- Voice command support (experimental)

---

## 🛠️ Tech Stack

**Frontend**
- React 18
- TypeScript
- Vite
- Tailwind CSS

**AI**
- Google Gemini API (via Google AI Studio)

**Charts & UI**
- Custom components
- Recharts (optional)

**Deployment**
- Vercel

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- Google AI Studio account
- Gemini API key

---

### Installation

```bash
git clone https://github.com/Aqib053/MedFlow.ai.git
cd MedFlow.ai
npm install

Environment Variables (Local)

Create a file called .env.local in the project root:

VITE_AI_PROVIDER=gemini
VITE_GEMINI_API_KEY=your_gemini_api_key_here


⚠️ Do NOT commit .env.local to GitHub

Run Locally
npm run dev


Open:

http://localhost:5173

🌍 Deployment (Vercel)

This project is optimized for Vercel.

Required Environment Variables (Vercel → Settings → Environment Variables)
VITE_AI_PROVIDER=gemini
VITE_GEMINI_API_KEY=your_gemini_api_key_here


Make sure:

Framework Preset: Vite

Build Command: vite build

Output Directory: dist

Root Directory: /

After saving env variables, redeploy the project.

🔐 Security Notes

⚠️ This project currently uses client-side AI calls (prototype stage).

For production:

Move AI calls to a backend (serverless / API route)

Protect API keys

Implement authentication & role-based access

Follow healthcare data compliance standards (HIPAA/GDPR)

🗺️ Roadmap

Backend API integration

Secure server-side AI processing

Discharge summary automation

Multi-language support

Mobile-friendly UI

EHR / FHIR integration

Analytics dashboard

📄 License

MIT License

👤 Author

Aqib
GitHub: https://github.com/Aqib053

🙏 Acknowledgements

Built using modern web technologies and AI to explore how intelligent systems can improve real-world healthcare workflows.


---

If you want next:
- ✅ **Fix white screen issue (I already know why from your screenshots)**
- ✅ **Refactor Gemini calls to avoid runtime crash**
- ✅ **Add backend API for production**
- ✅ **Create a live demo walkthrough**

Say **“fix white screen now”** and we’ll solve it step-by-step without guessing.
