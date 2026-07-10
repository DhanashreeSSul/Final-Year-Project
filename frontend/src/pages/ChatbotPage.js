import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Bot, User, RefreshCw, Sparkles } from 'lucide-react';
import { chatAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code:'en', label:'English' },
  { code:'hi', label:'हिंदी' },
  { code:'mr', label:'मराठी' },
  { code:'te', label:'తెలుగు' },
  { code:'ta', label:'தமிழ்' },
  { code:'kn', label:'ಕನ್ನಡ' },
];

const QUICK_PROMPTS = {
  en: ['Find jobs near me','Show free courses','Government schemes for women','Career advice for beginners','Digital skills training'],
  hi: ['मेरे पास नौकरी खोजें','मुफ्त कोर्स दिखाएं','महिलाओं के लिए योजनाएं','करियर सलाह','डिजिटल कौशल'],
  mr: ['माझ्या जवळ नोकऱ्या','मोफत कोर्स','महिलांसाठी योजना','करिअर सल्ला','डिजिटल कौशल्ये'],
};

export default function ChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role:'assistant', content: user?.language_pref === 'hi' ?
      'नमस्ते! मैं शक्ति हूं, आपकी AI करियर गाइड। मैं आपको नौकरी, कोर्स और सरकारी योजनाएं खोजने में मदद करूंगी।' :
      'Namaste! I am Shakti, your AI career guide. I can help you find jobs, courses, and government schemes. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [lang, setLang] = useState(user?.language_pref || 'en');
  const [sessionToken, setSessionToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  useEffect(() => {
    // Web Speech API setup
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const r = new SR();
      r.continuous = false; r.interimResults = false;
      r.onresult = (e) => { setInput(e.results[0][0].transcript); setListening(false); };
      r.onerror = () => setListening(false);
      r.onend = () => setListening(false);
      recognitionRef.current = r;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return toast.error('Voice input not supported in this browser');
    if (listening) { recognitionRef.current.stop(); setListening(false); }
    else { recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN'; recognitionRef.current.start(); setListening(true); }
  };

  const sendMessage = async (msg) => {
    const text = msg || input.trim();
    if (!text) return;
    setInput('');
    setMessages(p => [...p, { role:'user', content: text }]);
    setLoading(true);
    try {
      const res = await chatAPI.sendMessage({ message: text, session_token: sessionToken, language: lang });
      if (res.data.session_token) setSessionToken(res.data.session_token);
      setMessages(p => [...p, { role:'assistant', content: res.data.response }]);
    } catch {
      setMessages(p => [...p, { role:'assistant', content: 'Sorry, I had trouble responding. Please try again.' }]);
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e) => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const clearChat = () => {
    setMessages([{ role:'assistant', content: 'Chat cleared. How can I help you?' }]);
    setSessionToken(null);
  };

  const quickPrompts = QUICK_PROMPTS[lang] || QUICK_PROMPTS.en;

  return (
    <div style={{maxWidth:820,margin:'0 auto',padding:'0 0 0',display:'flex',flexDirection:'column',height:'calc(100vh - 64px)'}}>
      {/* Header */}
      <div style={{background:'linear-gradient(135deg,var(--pink-600),var(--pink-800))',padding:'16px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Sparkles size={20} color="white"/>
          </div>
          <div>
            <div style={{color:'white',fontWeight:700,fontFamily:'var(--font-display)',fontSize:16}}>Shakti AI Guide</div>
            <div style={{color:'rgba(255,255,255,0.7)',fontSize:12,display:'flex',alignItems:'center',gap:4}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:'#4ade80',display:'inline-block'}}/>
              Online — Multilingual Career Assistant
            </div>
          </div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <select value={lang} onChange={e=>setLang(e.target.value)} style={{fontSize:12,padding:'4px 8px',borderRadius:8,border:'1px solid rgba(255,255,255,0.3)',background:'rgba(255,255,255,0.15)',color:'white',cursor:'pointer',outline:'none'}}>
            {LANGUAGES.map(l=><option key={l.code} value={l.code} style={{color:'var(--gray-800)'}}>{l.label}</option>)}
          </select>
          <button onClick={clearChat} className="btn btn-sm" style={{background:'rgba(255,255,255,0.15)',color:'white',border:'none'}} title="Clear chat">
            <RefreshCw size={14}/>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages" style={{flex:1,overflowY:'auto',padding:'20px',display:'flex',flexDirection:'column',gap:16,background:'var(--pink-50)'}}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-message ${m.role}`}>
            <div className="chat-avatar" style={{background:m.role==='assistant'?'linear-gradient(135deg,var(--pink-500),var(--pink-700))':'var(--gray-200)'}}>
              {m.role==='assistant' ? <Sparkles size={16} color="white"/> : <User size={16} color="var(--gray-600)"/>}
            </div>
            <div className="chat-bubble">{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-message assistant">
            <div className="chat-avatar" style={{background:'linear-gradient(135deg,var(--pink-500),var(--pink-700))'}}>
              <Sparkles size={16} color="white"/>
            </div>
            <div className="chat-bubble" style={{display:'flex',gap:6,alignItems:'center'}}>
              <span style={{width:8,height:8,borderRadius:'50%',background:'var(--pink-400)',animation:'pulse 1s infinite'}}/>
              <span style={{width:8,height:8,borderRadius:'50%',background:'var(--pink-400)',animation:'pulse 1s 0.2s infinite'}}/>
              <span style={{width:8,height:8,borderRadius:'50%',background:'var(--pink-400)',animation:'pulse 1s 0.4s infinite'}}/>
            </div>
          </div>
        )}
        <div ref={messagesEndRef}/>
      </div>

      {/* Quick prompts */}
      <div style={{background:'white',padding:'8px 16px',borderTop:'1px solid var(--pink-100)',display:'flex',gap:6,overflowX:'auto',flexShrink:0}}>
        {quickPrompts.map(p=>(
          <button key={p} onClick={()=>sendMessage(p)} className="lang-chip" style={{whiteSpace:'nowrap',flexShrink:0}}>{p}</button>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input-area" style={{background:'white',borderTop:'1px solid var(--pink-100)',flexShrink:0}}>
        <button onClick={toggleVoice} className="btn btn-secondary btn-sm" style={{flexShrink:0,border:'none',background:listening?'var(--pink-100)':'var(--pink-50)',color:listening?'var(--pink-700)':'var(--gray-500)',padding:10,borderRadius:'50%'}}>
          <Mic size={18} color={listening?'var(--pink-600)':undefined}/>
        </button>
        <textarea className="chat-input" rows={1} style={{resize:'none'}} placeholder={`Ask in ${LANGUAGES.find(l=>l.code===lang)?.label || 'English'}...`}
          value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKeyDown}/>
        <button onClick={()=>sendMessage()} className="btn btn-primary" style={{flexShrink:0,padding:10,borderRadius:'50%'}} disabled={loading||!input.trim()}>
          <Send size={18}/>
        </button>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:0.3;}50%{opacity:1;}}`}</style>
    </div>
  );
}
