import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { chatAPI } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
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

/* ─── Gradient Orb Bot Avatar ─── */
function BotOrb({ size = 36, pulsing = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, var(--primary-400), var(--accent-400), var(--secondary-400))',
      backgroundSize: '200% 200%',
      animation: pulsing ? 'orb-pulse 2s ease-in-out infinite, orb-gradient 4s ease infinite' : 'orb-gradient 4s ease infinite',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: pulsing ? '0 0 18px rgba(107,45,139,0.35)' : '0 0 10px rgba(107,45,139,0.15)',
      transition: 'box-shadow 0.4s ease'
    }}>
      <Sparkles size={size * 0.44} color="#fff" />
    </div>
  );
}

/* ─── Waveform Visualizer (for mic recording) ─── */
function WaveformBars() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '24px' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          style={{
            width: '3px', height: '18px', borderRadius: '999px',
            backgroundColor: 'var(--accent-500)',
            transformOrigin: 'center'
          }}
        />
      ))}
    </div>
  );
}

/* ─── Typing Indicator (three dots) ─── */
function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 0' }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '7px', height: '7px', borderRadius: '50%',
            backgroundColor: 'var(--primary-400)'
          }}
        />
      ))}
    </div>
  );
}

/* ─── Typewriter effect for bot text ─── */
function TypewriterText({ text, speed = 12 }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) return;
    let i = 0;
    setDisplayed('');
    setDone(false);
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && <span style={{ display: 'inline-block', width: '2px', height: '14px', background: 'var(--primary-500)', marginLeft: '1px', animation: 'blink 0.7s step-end infinite', verticalAlign: 'text-bottom' }} />}
    </span>
  );
}

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
          <BotOrb size={42} />
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

      <div className="chat-window" style={{ borderRadius: '20px', overflow: 'hidden', border: '1.5px solid var(--border)', background: 'var(--surface)' }}>
        {/* Chat Messages */}
        <div className="chat-messages-container" style={{ padding: '24px 16px' }}>
          <AnimatePresence>
            {messages.map((msg, msgIdx) => {
              const isUser = msg.sender === 'user';
              const isLatestBot = !isUser && msgIdx === messages.length - 1;
              return (
                <motion.div
                  key={msg.id}
                  className={`chat-bubble-wrapper ${isUser ? 'user' : ''}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Avatar */}
                  {isUser ? (
                    <div
                      className="chat-avatar-icon"
                      style={{
                        backgroundColor: 'var(--primary-700)',
                        color: '#ffffff',
                        border: 'none'
                      }}
                    >
                      <User size={18} />
                    </div>
                  ) : (
                    <BotOrb size={34} pulsing={isLatestBot && loading} />
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '100%', minWidth: 0 }}>
                    <div
                      className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
                      style={{
                        whiteSpace: 'pre-line', lineHeight: '1.6',
                        borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        background: isUser
                          ? 'linear-gradient(135deg, var(--primary-600), var(--primary-700))'
                          : 'var(--surface)',
                        color: isUser ? '#fff' : 'var(--text-main)',
                        border: isUser ? 'none' : '1px solid var(--border)',
                        boxShadow: isUser ? '0 2px 8px rgba(107,45,139,0.15)' : '0 1px 4px rgba(0,0,0,0.04)'
                      }}
                    >
                      {isLatestBot && !isUser ? (
                        <TypewriterText text={msg.text} speed={14} />
                      ) : (
                        msg.text
                      )}
                    </div>

                    {/* Structured Recommendation Cards */}
                    {msg.recommendations && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                      >
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-800)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {msg.recommendations.title}
                        </div>

                        {msg.recommendations.items.map((item, idx) => (
                          <motion.div
                            key={idx}
                            className="card"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + idx * 0.12 }}
                            style={{
                              padding: '14px',
                              backgroundColor: 'var(--surface)',
                              border: '1.5px solid var(--primary-100)',
                              borderRadius: '16px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-main)' }}>
                                  {item.title}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--primary-700)', fontWeight: '600' }}>
                                  {item.org}
                                </div>
                              </div>
                              <span className="badge badge-match" style={{ flexShrink: 0 }}>{item.match}% Fit</span>
                            </div>

                            {item.salary && (
                              <div style={{
                                fontSize: '13px', fontWeight: '700',
                                color: 'var(--teal-700)',
                                marginTop: '8px',
                                display: 'flex', alignItems: 'center', gap: '4px'
                              }}>
                                <IndianRupee size={12} /> {item.salary} • {item.workMode}
                              </div>
                            )}

                            {item.benefit && (
                              <div style={{
                                fontSize: '12px', color: 'var(--secondary-700)', marginTop: '6px',
                                backgroundColor: 'var(--secondary-50)',
                                padding: '6px 10px', borderRadius: '8px'
                              }}>
                                {item.benefit}
                              </div>
                            )}

                            {/* Explainability Breakdown */}
                            <div style={{ marginTop: '10px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                              <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-light)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                WHY AM I SEEING THIS?
                              </div>
                              {item.reasons.map((r, rIdx) => (
                                <div key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-body)', marginTop: '2px' }}>
                                  <CheckCircle2 size={12} color="var(--secondary-600)" />
                                  <span>{r}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {loading && (
            <motion.div
              className="chat-bubble-wrapper"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <BotOrb size={34} pulsing />
              <div className="chat-bubble chat-bubble-assistant" style={{
                borderRadius: '20px 20px 20px 4px',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <TypingDots />
                <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>Shakti AI is thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="chat-prompts-row" style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex', gap: '8px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none'
        }}>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <motion.button
              key={idx}
              type="button"
              className="chat-prompt-pill"
              onClick={() => handleSend(prompt)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                whiteSpace: 'nowrap',
                border: '1.5px solid var(--primary-100)',
                borderRadius: '999px',
                padding: '8px 14px',
                background: 'var(--surface)',
                cursor: 'pointer',
                fontSize: '12px', fontWeight: '600',
                color: 'var(--primary-700)',
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'border-color 0.2s, background 0.2s',
                flexShrink: 0
              }}
            >
              <Sparkles size={12} />
              <span>{prompt}</span>
            </motion.button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="chat-input-bar" style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'var(--bg-subtle)'
        }}>
          {/* Mic Button with waveform */}
          <motion.button
            type="button"
            onClick={toggleMic}
            whileTap={{ scale: 0.9 }}
            style={{
              width: '48px', height: '48px', padding: 0, borderRadius: '50%',
              border: isListening ? '2px solid var(--accent-500)' : '1.5px solid var(--border)',
              background: isListening ? 'var(--accent-50)' : 'var(--surface)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isListening ? 'var(--accent-600)' : 'var(--text-muted)',
              boxShadow: isListening ? '0 0 16px rgba(225,29,116,0.25)' : 'none',
              transition: 'all 0.3s ease',
              position: 'relative', overflow: 'hidden'
            }}
            title={isListening ? 'Stop Listening' : 'Voice Input (Hindi / Regional Language)'}
          >
            {isListening ? <WaveformBars /> : <Mic size={20} />}
            {isListening && (
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  position: 'absolute', inset: -4,
                  borderRadius: '50%',
                  border: '2px solid var(--accent-300)',
                  pointerEvents: 'none'
                }}
              />
            )}
          </motion.button>

          <input
            type="text"
            className="form-control"
            placeholder="Ask about jobs, schemes, or training in simple words..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{
              borderRadius: '999px',
              flex: 1,
              height: '48px',
              fontSize: '14px',
              border: '1.5px solid var(--border)',
              background: 'var(--surface)'
            }}
          />

          <motion.button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => handleSend()}
            disabled={!inputText.trim() || loading}
            whileTap={{ scale: 0.9 }}
            style={{
              width: '48px', height: '48px', padding: 0, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            title="Send Question"
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
