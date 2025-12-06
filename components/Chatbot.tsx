
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles, Activity, FileText, AlertTriangle } from 'lucide-react';
import { Patient, AnalysisResult } from '../types';

interface ChatbotProps {
  patients: Patient[];
  analysisResult?: AnalysisResult | null;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: React.ReactNode;
  timestamp: Date;
}

export const Chatbot: React.FC<ChatbotProps> = ({ patients, analysisResult }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hello! I'm MedFlow Assistant. I can help with patient records or analyze uploaded documents.",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to announce document analysis completion in chat
  useEffect(() => {
      if (analysisResult) {
          const msg: Message = {
              id: Date.now().toString(),
              sender: 'bot',
              text: (
                <div className="animate-fade-in">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                        <FileText size={14}/> Document Processed
                    </span>
                    <div className="mt-1 font-medium">{analysisResult.metadata.patientName}</div>
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Ask me about:
                        <div className="flex gap-2 mt-2 flex-wrap">
                            <button onClick={() => setInput("Summarize this report")} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors border border-slate-200 dark:border-slate-600">Summary</button>
                            <button onClick={() => setInput("What are the risks?")} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors border border-slate-200 dark:border-slate-600">Critical Flags</button>
                            <button onClick={() => setInput("Treatment plan")} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded hover:bg-green-50 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 transition-colors border border-slate-200 dark:border-slate-600">Plan</button>
                        </div>
                    </div>
                </div>
              ),
              timestamp: new Date()
          };
          setMessages(prev => [...prev, msg]);
          setIsOpen(true); // Auto-open chat on analysis complete
      }
  }, [analysisResult]);

  const generateResponse = (query: string): React.ReactNode => {
    const lowerQuery = query.toLowerCase();
    
    // --- STRATEGY 1: Context Switching (Explicit Patient Name from DB) ---
    // Even if a doc is loaded, if user asks "How is Robert?", we should answer about Robert.
    const matchedDbPatient = patients.find(p => 
      lowerQuery.includes(p.name.toLowerCase()) || 
      (p.name.split(' ')[0].length > 2 && lowerQuery.includes(p.name.split(' ')[0].toLowerCase())) // Avoid matching short names excessively
    );

    // If a patient is explicitly named and it's NOT the person in the document (or no doc loaded)
    if (matchedDbPatient && (!analysisResult || !analysisResult.metadata.patientName.toLowerCase().includes(matchedDbPatient.name.toLowerCase()))) {
        return generateDbPatientResponse(matchedDbPatient, lowerQuery);
    }

    // --- STRATEGY 2: RAG - Document Context (High Priority) ---
    if (analysisResult) {
         // If query is generic (diagnosis, summary, meds) OR refers to document patient
         const isRelevantToDoc = 
            lowerQuery.includes('report') || lowerQuery.includes('document') || 
            lowerQuery.includes('summary') || lowerQuery.includes('risk') || 
            lowerQuery.includes('plan') || lowerQuery.includes('med') ||
            lowerQuery.includes('diagnosis') || lowerQuery.includes('symptom') ||
            lowerQuery.includes('advice') || lowerQuery.includes('avoid') ||
            lowerQuery.includes(analysisResult.metadata.patientName.toLowerCase().split(' ')[0]);

         if (isRelevantToDoc) {
            return generateDocumentResponse(analysisResult, lowerQuery);
         }
    }

    // --- STRATEGY 3: General Fallback ---
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
        return "Hello! I can help you summarize patient records. Try asking 'How is Robert?' or upload a document and ask 'What does the report say?'.";
    }

    return "I couldn't find a specific patient context for that query. Please mention a patient's name or upload a document.";
  };

  // Helper: Generate response based on DB Patient Data
  const generateDbPatientResponse = (patient: Patient, query: string) => {
      if (query.includes('medicine') || query.includes('medication') || query.includes('drug')) {
        return (
            <div className="space-y-2">
                <p><strong>Recommended Medications for {patient.name}:</strong></p>
                <ul className="list-disc pl-4 text-sm space-y-1">
                    {getMockMeds(patient.suggestedDepartment).map(m => <li key={m}>{m}</li>)}
                </ul>
            </div>
        );
      }
      
      if (query.includes('routine') || query.includes('plan') || query.includes('action')) {
         return (
             <div className="space-y-2">
                 <p><strong>Care Routine ({patient.severity.toUpperCase()} Priority):</strong></p>
                 <ul className="list-disc pl-4 text-sm space-y-1">
                    <li>Monitor vitals every {patient.severity === 'emergency' ? '15 mins' : '4 hours'}.</li>
                    <li>Review {patient.suggestedDepartment} labs.</li>
                    <li>Ensure patient is comfortable and hydrated.</li>
                 </ul>
             </div>
         );
      }

      // Default DB Summary
      return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                <Activity size={16} /> Patient Record: {patient.name}
            </div>
            <p className="text-sm">{patient.aiSummary}</p>
            <div className="mt-2 flex gap-2">
                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                    patient.severity === 'emergency' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                    {patient.severity}
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-bold text-slate-600 dark:text-slate-300">
                    {patient.suggestedDepartment}
                </span>
            </div>
        </div>
      );
  };

  // Helper: Generate response based on Document Analysis (RAG)
  const generateDocumentResponse = (doc: AnalysisResult, query: string) => {
      const q = query.toLowerCase();

      // 1. Risks / Alerts
      if (q.includes('risk') || q.includes('alert') || q.includes('flag') || q.includes('critical')) {
          if (doc.alertFlags.length === 0 && doc.increasedMarkers.length === 0) {
              return "✅ No critical alerts or flags found in this report. The patient appears stable based on the extracted data.";
          }
          return (
              <div className="space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold border-b border-red-100 dark:border-red-900/30 pb-1">
                      <AlertTriangle size={16} /> Critical Findings
                  </div>
                  {doc.alertFlags.length > 0 && (
                      <ul className="list-disc pl-4 text-sm space-y-1 text-slate-700 dark:text-slate-300">
                          {doc.alertFlags.map(f => <li key={f}>{f}</li>)}
                      </ul>
                  )}
                  {doc.increasedMarkers.length > 0 && (
                      <div className="mt-2">
                          <p className="text-xs font-bold text-slate-500 uppercase">Elevated Markers</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                              {doc.increasedMarkers.map(m => (
                                  <span key={m} className="text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded">{m}</span>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
          );
      }

      // 2. Medications / Treatment
      if (q.includes('med') || q.includes('drug') || q.includes('treat') || q.includes('plan')) {
          return (
              <div className="space-y-2 animate-fade-in">
                  <p className="font-bold text-indigo-600 dark:text-indigo-400">Treatment Plan for {doc.metadata.patientName}:</p>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                      <ul className="space-y-2 text-sm">
                          {doc.recommendedMeds.map((med, i) => (
                              <li key={i} className="flex justify-between">
                                  <span className="font-medium">{med.name}</span>
                                  <span className="text-slate-500 text-xs">{med.dosage}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
                  <div className="text-xs text-slate-500">
                      *Follow up: {doc.followUpPlan}
                  </div>
              </div>
          );
      }

      // 3. Diagnosis
      if (q.includes('diagnosis') || q.includes('condition') || q.includes('problem')) {
          return (
              <div>
                  <p>The analyzed report indicates:</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{doc.diagnosis}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{doc.summary}</p>
              </div>
          );
      }

      // 4. Default Summary
      return (
          <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold border-b border-indigo-100 dark:border-indigo-800 pb-1">
                  <FileText size={16} /> Analysis: {doc.metadata.patientName}
              </div>
              <p className="text-sm leading-relaxed">{doc.summary}</p>
              <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">Age: {doc.metadata.age}</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">Doc: {doc.metadata.doctorName}</span>
              </div>
          </div>
      );
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI thinking delay
    setTimeout(() => {
        const botMsg: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: generateResponse(userMsg.text as string),
            timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  const getMockMeds = (dept: string) => {
      switch(dept) {
          case 'Cardiology': return ['Aspirin 81mg', 'Atorvastatin', 'Metoprolol', 'Nitroglycerin PRN'];
          case 'Neurology': return ['TPA (if eligible)', 'Anti-platelet therapy', 'Neuro-protective agents'];
          case 'Orthopedics': return ['Acetaminophen', 'Ibuprofen', 'Calcium + Vit D', 'Bisphosphonates'];
          case 'General': return ['Paracetamol', 'IV Fluids', 'Broad-spectrum antibiotics'];
          default: return ['Standard care meds', 'Vitamins'];
      }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-up flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                    <Sparkles size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-sm">MedFlow Assistant</h3>
                    <p className="text-xs text-blue-100 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                        {analysisResult && <span className="ml-2 bg-white/20 px-1 rounded text-[10px]">RAG ACTIVE</span>}
                    </p>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50 min-h-[300px]">
             {messages.map((msg) => (
                 <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-blue-100 dark:bg-blue-900'}`}>
                         {msg.sender === 'user' ? <User size={16} className="text-slate-600 dark:text-slate-300" /> : <Bot size={16} className="text-blue-600 dark:text-blue-400" />}
                     </div>
                     <div className={`p-3 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                         msg.sender === 'user' 
                           ? 'bg-blue-600 text-white rounded-tr-none' 
                           : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                     }`}>
                         {msg.text}
                         <div className={`text-[10px] mt-1 opacity-70 ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                             {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </div>
                     </div>
                 </div>
             ))}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={analysisResult ? `Ask about ${analysisResult.metadata.patientName}...` : "Ask about a patient..."}
                className="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                  <Send size={18} />
              </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 relative"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {analysisResult && !isOpen && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white animate-pulse"></span>
        )}
      </button>
    </div>
  );
};
