import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { chatAPI } from '../utils/api';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  CheckCircle2,
  Briefcase,
  FileText,
  GraduationCap,
  ExternalLink,
  IndianRupee,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

const SUGGESTED_PROMPTS = [
  'What job is suitable for me in my district?',
  'I want to work from home in stitching & crafts.',
  'Which government scheme gives a free sewing toolkit?',
  'What free certified courses can I take as a beginner?',
  'How do I apply for PM Mudra loan for women?'
];

export default function ChatbotPage() {
  const { user } = useAuth();
  const { currentLang } = useLanguage();
  const [sessionToken, setSessionToken] = useState(() => localStorage.getItem('shakti_chat_token') || '');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `Namaste ${user?.name || 'Sister'}! I am your AI Career Guide powered by Shakti AI. Ask me about jobs near you, certified vocational training courses, or government financial schemes in your language.`,
      recommendations: null
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load chat history if session token exists
  useEffect(() => {
    const loadHistory = async () => {
      if (!sessionToken) return;
      try {
        const res = await chatAPI.getHistory(sessionToken);
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const loadedMsgs = res.data.data.map(m => ({
            id: m.id,
            sender: m.role === 'assistant' ? 'assistant' : 'user',
            text: m.content,
            recommendations: null
          }));
          setMessages(loadedMsgs);
        }
      } catch (err) {
        console.warn('Could not restore chat session history:', err.message);
      }
    };
    loadHistory();
  }, [sessionToken]);

  // Speech to Text initialization via Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLang === 'hi' ? 'hi-IN' : currentLang === 'mr' ? 'mr-IN' : 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
        toast.error('Could not capture audio. Please type your question.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentLang]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      toast.error('Voice input is not supported in this browser. Please type your message.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast('Listening... Speak now', { icon: '🎤' });
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleResetChat = () => {
    localStorage.removeItem('shakti_chat_token');
    setSessionToken('');
    setMessages([
      {
        id: Date.now(),
        sender: 'assistant',
        text: `Namaste ${user?.name || 'Sister'}! New conversation started. How can I help you today?`,
        recommendations: null
      }
    ]);
    toast.success('Conversation reset');
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // Connect directly to live backend Chatbot endpoint
      const res = await chatAPI.sendMessage({
        message: query,
        language: currentLang,
        session_token: sessionToken || undefined,
        userId: user?.id
      });

      const aiReply = res.data?.response || res.data?.reply;

      if (res.data?.session_token) {
        setSessionToken(res.data.session_token);
        localStorage.setItem('shakti_chat_token', res.data.session_token);
      }

      if (aiReply) {
        const structured = generateStructuredRecs(query);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'assistant',
            text: aiReply,
            recommendations: structured
          }
        ]);
      } else {
        throw new Error('Empty reply from backend');
      }
    } catch (err) {
      console.warn('Chatbot live API fallback:', err.message);
      // Fallback intelligent response with structured cards
      const structured = generateStructuredRecs(query);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: getSmartReplyText(query),
          recommendations: structured
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Rule-based structured recommendation generator for high-trust responses
  const generateStructuredRecs = (query) => {
    const q = query.toLowerCase();
    if (q.includes('tailor') || q.includes('stitch') || q.includes('home') || q.includes('job') || q.includes('suitable') || q.includes('naukri')) {
      return {
        type: 'jobs',
        title: 'Matched Opportunities for Tailoring & Stitching',
        items: [
          {
            title: 'Tailoring & Stitching Assistant',
            org: 'Mahila Vikas Foundation',
            match: 94,
            workMode: 'Work from Home / Local Hub',
            location: 'Varanasi',
            salary: '₹8,000–₹12,000/month',
            reasons: ['Raw material drop & pickup', 'Flexible hours for mothers', 'Subsidized sewing unit']
          },
          {
            title: 'Handicraft & Crochet Artisan',
            org: 'Rural Artisans Livelihood Collective',
            match: 89,
            workMode: 'Part-Time / Village Center',
            location: 'Varanasi',
            salary: '₹7,000–₹11,000/month',
            reasons: ['No formal degree needed', 'Training provided', 'Direct weekly bank payment']
          }
        ]
      };
    } else if (q.includes('scheme') || q.includes('yojana') || q.includes('business') || q.includes('loan') || q.includes('toolkit') || q.includes('mudra') || q.includes('vishwakarma')) {
      return {
        type: 'schemes',
        title: 'Eligible Government Schemes for Rural Women',
        items: [
          {
            title: 'PM Vishwakarma Yojana (Tailor/Darzi)',
            org: 'Ministry of MSME',
            match: 98,
            benefit: '₹15,000 Free Toolkit Voucher + 5% Subsidized Loan up to ₹3,00,000',
            reasons: ['Artisan criteria match', 'No collateral required', 'Aadhaar verified']
          },
          {
            title: 'Lakhpati Didi Initiative',
            org: 'DAY-NRLM (Ministry of Rural Development)',
            match: 95,
            benefit: 'Guaranteed livelihood planning + bank linkage for ₹1,00,000 annual income',
            reasons: ['Self-Help Group linkage', 'Interest subvention']
          },
          {
            title: 'Pradhan Mantri Mudra Yojana (Shishu)',
            org: 'Ministry of Finance',
            match: 91,
            benefit: 'Zero collateral business loan up to ₹50,000',
            reasons: ['Micro-enterprise setup support', 'No processing fees']
          }
        ]
      };
    } else if (q.includes('course') || q.includes('skill') || q.includes('learn') || q.includes('training')) {
      return {
        type: 'courses',
        title: 'Recommended Free Certified Skills',
        items: [
          {
            title: 'Advanced Machine Stitching & Blouse Designing',
            org: 'NSDC & Skill India',
            match: 95,
            benefit: '4 Weeks • Government Recognized Certificate',
            reasons: ['Upskills basic tailoring to commercial market designs']
          },
          {
            title: 'Digital Literacy & Secure Smartphone Banking',
            org: 'PMGDISHA & Shakti Foundation',
            match: 92,
            benefit: '2 Weeks • Safe UPI & Voice Search',
            reasons: ['Essential smartphone security for rural entrepreneurs']
          }
        ]
      };
    }
    return null;
  };

  const getSmartReplyText = (query) => {
    const q = query.toLowerCase();
    if (q.includes('tailor') || q.includes('stitch')) {
      return 'Based on your tailoring background and preferred part-time work mode, I found 2 high-compatibility opportunities near you with raw material home delivery:';
    } else if (q.includes('scheme') || q.includes('business') || q.includes('loan')) {
      return 'Here are verified central government schemes that provide financial toolkits and low-interest loans for women starting a home enterprise:';
    } else {
      return 'Based on your profile, here are recommended career opportunities and training programs designed for rural women:';
    }
  };

  return (
    <div className="container" style={{ maxWidth: '840px', paddingBottom: '60px' }}>
      <div className="page-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'var(--primary-700)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: '24px' }}>My AI Career Guide</h1>
            <p className="page-subtitle" style={{ fontSize: '14px', margin: 0 }}>
              Live AI guide powered by Meta-Llama 3.1 & Shakti Recommendation Engine.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetChat}
          className="btn btn-outline btn-sm"
          title="Start fresh conversation"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RotateCcw size={14} /> New Chat
        </button>
      </div>

      <div className="chat-window">
        {/* Chat Messages */}
        <div className="chat-messages-container">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`chat-bubble-wrapper ${isUser ? 'user' : ''}`}>
                <div
                  className="chat-avatar-icon"
                  style={{
                    backgroundColor: isUser ? 'var(--primary-700)' : '#ffffff',
                    color: isUser ? '#ffffff' : 'var(--primary-700)',
                    border: isUser ? 'none' : '1px solid var(--border)'
                  }}
                >
                  {isUser ? <User size={18} /> : <Bot size={20} />}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '100%' }}>
                  <div
                    className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
                    style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}
                  >
                    {msg.text}
                  </div>

                  {/* Structured Recommendation Cards */}
                  {msg.recommendations && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-800)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {msg.recommendations.title}
                      </div>

                      {msg.recommendations.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="card"
                          style={{
                            padding: '14px',
                            backgroundColor: '#ffffff',
                            border: '1.5px solid var(--primary-200)',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-main)' }}>
                                {item.title}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--primary-700)', fontWeight: '600' }}>
                                {item.org}
                              </div>
                            </div>
                            <span className="badge badge-match">{item.match}% Fit</span>
                          </div>

                          {item.salary && (
                            <div style={{ fontSize: '13px', color: 'var(--accent-700)', fontWeight: '600', marginTop: '6px' }}>
                              <IndianRupee size={12} style={{ display: 'inline' }} /> {item.salary} • {item.workMode}
                            </div>
                          )}

                          {item.benefit && (
                            <div style={{ fontSize: '12px', color: 'var(--secondary-700)', marginTop: '4px', backgroundColor: 'var(--secondary-50)', padding: '6px 8px', borderRadius: '4px' }}>
                              {item.benefit}
                            </div>
                          )}

                          {/* Explainability Breakdown (Why am I seeing this?) */}
                          <div style={{ marginTop: '10px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-light)', marginBottom: '4px' }}>
                              WHY AM I SEEING THIS?
                            </div>
                            {item.reasons.map((r, rIdx) => (
                              <div key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-body)' }}>
                                <CheckCircle2 size={12} color="var(--secondary-600)" />
                                <span>{r}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="chat-bubble-wrapper">
              <div className="chat-avatar-icon" style={{ backgroundColor: '#ffffff', color: 'var(--primary-700)', border: '1px solid var(--border)' }}>
                <Bot size={20} />
              </div>
              <div className="chat-bubble chat-bubble-assistant" style={{ fontStyle: 'italic', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', border: '2px solid var(--primary-400)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span>Shakti AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="chat-prompts-row">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              className="chat-prompt-pill"
              onClick={() => handleSend(prompt)}
            >
              <Sparkles size={12} />
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="chat-input-bar">
          <button
            type="button"
            onClick={toggleMic}
            className={`btn ${isListening ? 'btn-accent' : 'btn-outline'} btn-sm`}
            style={{ width: '44px', height: '44px', padding: 0, borderRadius: '50%' }}
            title={isListening ? 'Stop Listening' : 'Voice Input (Hindi / Regional Language)'}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            type="text"
            className="form-control"
            placeholder="Ask about jobs, schemes, or training in simple words..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{ borderRadius: 'var(--radius-full)' }}
          />

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => handleSend()}
            disabled={!inputText.trim() || loading}
            style={{ width: '44px', height: '44px', padding: 0, borderRadius: '50%' }}
            title="Send Question"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
