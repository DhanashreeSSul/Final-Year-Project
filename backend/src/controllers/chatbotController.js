const pool = require('../db/pool');
const { v4: uuidv4 } = require('uuid');
const { HfInference } = require("@huggingface/inference");

const hf = new HfInference(process.env.HF_TOKEN);
console.log(
  "HF Token Loaded:",
  !!process.env.HF_TOKEN
);
const INTENT_PATTERNS = {
  jobs: /\b(job|jobs|work|employment|career|vacancy|naukri|kaam|rojgar)\b/i,

  courses: /\b(course|courses|training|skill|skills|learn|learning|education|siksha|shikshan)\b/i,

  schemes: /\b(scheme|schemes|government|govt|yojana|sarkari|subsidy|benefit)\b/i,

  greeting: /\b(hello|hi|hey|namaste|namaskar)\b/i,

  help: /\b(help|assist|guide|guidance|support)\b/i,
};

const detectIntent = (msg) => {
  for (const [intent, pattern] of Object.entries(INTENT_PATTERNS)) {
    if (pattern.test(msg)) return intent;
  }
  return 'general';
};

const RESPONSES = {
  greeting: {
    en: 'Namaste! I am Shakti, your AI career guide. I can help you find jobs, training courses, and government schemes. What would you like to explore today?',
    hi: '\u0928\u092e\u0938\u094d\u0924\u0947! \u092e\u0948\u0902 \u0936\u0915\u094d\u0924\u093f \u0939\u0942\u0902, \u0906\u092a\u0915\u0940 AI \u0915\u0930\u093f\u092f\u0930 \u0917\u093e\u0907\u0921\u0964 \u092e\u0948\u0902 \u0906\u092a\u0915\u094b \u0928\u094c\u0915\u0930\u0940, \u0915\u094b\u0930\u094d\u0938 \u0914\u0930 \u0938\u0930\u0915\u093e\u0930\u0940 \u092f\u094b\u091c\u0928\u093e\u090f\u0902 \u0916\u094b\u091c\u0928\u0947 \u092e\u0947\u0902 \u092e\u0926\u0926 \u0915\u0930 \u0938\u0915\u0924\u0940 \u0939\u0942\u0902\u0964',
    mr: '\u0928\u092e\u0938\u094d\u0915\u093e\u0930! \u092e\u0940 \u0936\u0915\u094d\u0924\u0940 \u0906\u0939\u0947, \u0924\u0941\u092e\u091a\u0940 AI \u0915\u0930\u093f\u0905\u0930 \u092e\u093e\u0930\u094d\u0917\u0926\u0930\u094d\u0936\u0915\u0964 \u092e\u0940 \u0924\u0941\u092e\u094d\u0939\u093e\u0932\u093e \u0928\u094b\u0915\u0930\u094d\u092f\u093e, \u0905\u092d\u094d\u092f\u093e\u0938\u0915\u094d\u0930\u092e \u0906\u0923\u093f \u0938\u0930\u0915\u093e\u0930\u0940 \u092f\u094b\u091c\u0928\u093e \u0936\u094b\u0927\u0923\u094d\u092f\u093e\u0924 \u092e\u0926\u0924 \u0915\u0930\u0947\u0928\u0964',
  },
  jobs: {
    en: 'Great! I can help you find jobs. Jobs are available in sectors like agriculture, handicrafts, healthcare, education, and IT. Would you like me to show you jobs near your location? Please share your state and district.',
    hi: '\u092c\u0922\u093c\u093f\u092f\u093e! \u092e\u0948\u0902 \u0906\u092a\u0915\u094b \u0928\u094c\u0915\u0930\u0940 \u0916\u094b\u091c\u0928\u0947 \u092e\u0947\u0902 \u092e\u0926\u0926 \u0915\u0930\u0942\u0902\u0917\u0940\u0964 \u0915\u0943\u0937\u093f, \u0939\u0938\u094d\u0924\u0936\u093f\u0932\u094d\u092a, \u0938\u094d\u0935\u093e\u0938\u094d\u0925\u094d\u092f, \u0936\u093f\u0915\u094d\u0937\u093e \u0914\u0930 IT \u0915\u094d\u0937\u0947\u0924\u094d\u0930 \u092e\u0947\u0902 \u0928\u094c\u0915\u0930\u093f\u092f\u093e\u0902 \u0909\u092a\u0932\u092c\u094d\u0927 \u0939\u0948\u0902\u0964',
    mr: '\u091b\u093e\u0928! \u092e\u0940 \u0924\u0941\u092e\u094d\u0939\u093e\u0932\u093e \u0928\u094c\u0915\u0930\u094d\u092f\u093e \u0936\u094b\u0927\u0923\u094d\u092f\u093e\u0924 \u092e\u0926\u0924 \u0915\u0930\u0947\u0928\u0964 \u0915\u0943\u0937\u0940, \u0939\u0938\u094d\u0924\u0915\u0932\u093e, \u0906\u0930\u094b\u0917\u094d\u092f, \u0936\u093f\u0915\u094d\u0937\u0923 \u0906\u0923\u093f IT \u0915\u094d\u0937\u0947\u0924\u094d\u0930\u093e\u0924 \u0928\u094b\u0915\u0930\u094d\u092f\u093e \u0909\u092a\u0932\u092c\u094d\u0927 \u0906\u0939\u0947\u0924\u0964',
  },
  courses: {
    en: 'Excellent! Training courses can help you build new skills. Available courses include digital literacy, sewing, computer basics, accounting, healthcare, and more. Many courses are FREE and offer certificates. Would you like to see available courses?',
    hi: '\u0936\u093e\u0928\u0926\u093e\u0930! \u092a\u094d\u0930\u0936\u093f\u0915\u094d\u0937\u0923 \u0915\u094b\u0930\u094d\u0938 \u0906\u092a\u0915\u094b \u0928\u090f \u0915\u094c\u0936\u0932 \u0938\u0940\u0916\u0928\u0947 \u092e\u0947\u0902 \u092e\u0926\u0926 \u0915\u0930\u0947\u0902\u0917\u0947\u0964 \u0921\u093f\u091c\u093f\u091f\u0932 \u0938\u093e\u0915\u094d\u0937\u0930\u0924\u093e, \u0938\u093f\u0932\u093e\u0908, \u0915\u0902\u092a\u094d\u092f\u0942\u091f\u0930 \u091c\u0948\u0938\u0947 \u0915\u0908 \u0915\u094b\u0930\u094d\u0938 \u0909\u092a\u0932\u092c\u094d\u0927 \u0939\u0948\u0902\u0964 \u0915\u0908 \u0915\u094b\u0930\u094d\u0938 \u092e\u0941\u092b\u094d\u0924 \u0939\u0948\u0902\u0964',
    mr: '\u0909\u0924\u094d\u0924\u092e! \u0921\u093f\u091c\u093f\u091f\u0932 \u0938\u093e\u0915\u094d\u0937\u0930\u0924\u093e, \u0936\u093f\u0935\u0923, \u0938\u0902\u0917\u0923\u0915 \u092f\u093e\u0902\u0938\u093e\u0930\u0916\u0947 \u0905\u0928\u0947\u0915 \u0905\u092d\u094d\u092f\u093e\u0938\u0915\u094d\u0930\u092e \u0909\u092a\u0932\u092c\u094d\u0927 \u0906\u0939\u0947\u0924\u0964',
  },
  schemes: {
    en: 'The Indian government has many beneficial schemes for women! These include PM Mudra Yojana (business loans), Beti Bachao Beti Padhao, Sukanya Samriddhi Yojana, and more. Would you like details about any specific scheme?',
    hi: '\u0938\u0930\u0915\u093e\u0930 \u0915\u0940 \u0915\u0908 \u092f\u094b\u091c\u0928\u093e\u090f\u0902 \u092e\u0939\u093f\u0932\u093e\u0913\u0902 \u0915\u0947 \u0932\u093f\u090f \u0939\u0948\u0902! \u091c\u0948\u0938\u0947 PM \u092e\u0941\u0926\u094d\u0930\u093e \u092f\u094b\u091c\u0928\u093e, \u092c\u0947\u091f\u0940 \u092c\u091a\u093e\u0913 \u092c\u0947\u091f\u0940 \u092a\u0922\u093c\u093e\u0913, \u0938\u0941\u0915\u0928\u094d\u092f\u093e \u0938\u092e\u0943\u0926\u094d\u0927\u093f \u092f\u094b\u091c\u0928\u093e, \u0906\u0926\u093f\u0964',
    mr: '\u0938\u0930\u0915\u093e\u0930\u091a\u094d\u092f\u093e \u0905\u0928\u0947\u0915 \u092f\u094b\u091c\u0928\u093e \u092e\u0939\u093f\u0932\u093e\u0902\u0938\u093e\u0920\u0940 \u0906\u0939\u0947\u0924\u0964 PM \u092e\u0941\u0926\u094d\u0930\u093e \u092f\u094b\u091c\u0928\u093e, \u0938\u0941\u0915\u0928\u094d\u092f\u093e \u0938\u092e\u0943\u0926\u094d\u0927\u093f \u092f\u094b\u091c\u0928\u093e \u0907\u0924\u094d\u092f\u093e\u0926\u0940\u0964',
  },
  help: {
    en: 'I can help you with:\n- Finding jobs near you\n- Discovering free training courses\n- Learning about government schemes\n- Career guidance based on your skills\n- Digital literacy tips\n\nJust ask me anything!',
    hi: '\u092e\u0948\u0902 \u0906\u092a\u0915\u0940 \u0907\u0928\u092e\u0947\u0902 \u092e\u0926\u0926 \u0915\u0930 \u0938\u0915\u0924\u0940 \u0939\u0942\u0902:\n- \u0906\u092a\u0915\u0947 \u092a\u093e\u0938 \u0915\u0940 \u0928\u094c\u0915\u0930\u093f\u092f\u093e\u0902\n- \u092e\u0941\u092b\u094d\u0924 \u092a\u094d\u0930\u0936\u093f\u0915\u094d\u0937\u0923 \u0915\u094b\u0930\u094d\u0938\n- \u0938\u0930\u0915\u093e\u0930\u0940 \u092f\u094b\u091c\u0928\u093e\u090f\u0902\n- \u0915\u0930\u093f\u092f\u0930 \u092e\u093e\u0930\u094d\u0917\u0926\u0930\u094d\u0936\u0928\n- \u0921\u093f\u091c\u093f\u091f\u0932 \u0938\u093e\u0915\u094d\u0937\u0930\u0924\u093e',
    mr: '\u092e\u0940 \u0924\u0941\u092e\u094d\u0939\u093e\u0932\u093e \u092e\u0926\u0924 \u0915\u0930\u0942 \u0936\u0915\u0924\u094b:\n- \u0924\u0941\u092e\u091a\u094d\u092f\u093e \u091c\u0935\u0933\u0940\u0932 \u0928\u094b\u0915\u0930\u094d\u092f\u093e\n- \u092e\u094b\u092b\u0924 \u092a\u094d\u0930\u0936\u093f\u0915\u094d\u0937\u0923 \u0905\u092d\u094d\u092f\u093e\u0938\u0915\u094d\u0930\u092e\n- \u0938\u0930\u0915\u093e\u0930\u0940 \u092f\u094b\u091c\u0928\u093e\n- \u0915\u0930\u093f\u0905\u0930 \u092e\u093e\u0930\u094d\u0917\u0926\u0930\u094d\u0936\u0928',
  },
  general: {
    en: 'I understand you are looking for guidance. I am here to help rural women like you find opportunities for career growth and digital empowerment. You can ask me about jobs, training courses, government schemes, or career advice. How can I assist you today?',
    hi: '\u092e\u0948\u0902 \u0938\u092e\u091d\u0924\u0940 \u0939\u0942\u0902 \u0906\u092a \u092e\u093e\u0930\u094d\u0917\u0926\u0930\u094d\u0936\u0928 \u091a\u093e\u0939\u0924\u0940 \u0939\u0948\u0902\u0964 \u092e\u0948\u0902 \u0917\u094d\u0930\u093e\u092e\u0940\u0923 \u092e\u0939\u093f\u0932\u093e\u0913\u0902 \u0915\u094b \u0915\u0930\u093f\u092f\u0930 \u0915\u0947 \u0905\u0935\u0938\u0930 \u0916\u094b\u091c\u0928\u0947 \u092e\u0947\u0902 \u092e\u0926\u0926 \u0915\u0947 \u0932\u093f\u090f \u092f\u0939\u093e\u0902 \u0939\u0942\u0902\u0964 \u0906\u092a \u0928\u094c\u0915\u0930\u0940, \u0915\u094b\u0930\u094d\u0938, \u0938\u0930\u0915\u093e\u0930\u0940 \u092f\u094b\u091c\u0928\u093e\u090f\u0902 \u092f\u093e \u0915\u0930\u093f\u092f\u0930 \u0938\u0932\u093e\u0939 \u0915\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902 \u092a\u0942\u091b \u0938\u0915\u0924\u0940 \u0939\u0948\u0902\u0964',
    mr: '\u092e\u0940 \u0917\u094d\u0930\u093e\u092e\u0940\u0923 \u092e\u0939\u093f\u0932\u093e\u0902\u0928\u093e \u0915\u0930\u093f\u0905\u0930\u091a\u094d\u092f\u093e \u0938\u0902\u0927\u0940 \u0936\u094b\u0927\u0923\u094d\u092f\u093e\u0924 \u092e\u0926\u0924 \u0915\u0930\u0923\u094d\u092f\u093e\u0938\u093e\u0920\u0940 \u0907\u0925\u0947 \u0906\u0939\u0947\u0964 \u0928\u094c\u0915\u0930\u094d\u092f\u093e, \u0905\u092d\u094d\u092f\u093e\u0938\u0915\u094d\u0930\u092e, \u0938\u0930\u0915\u093e\u0930\u0940 \u092f\u094b\u091c\u0928\u093e \u092f\u093e\u092c\u0926\u094d\u0926\u0932 \u0935\u093f\u091a\u093e\u0930\u093e\u0964',
  },
};


const generateResponse = async (message, language = "en") => {
  try {

    const languageName =
      language === "hi"
        ? "Hindi"
        : language === "mr"
        ? "Marathi"
        : "English";

    const result = await hf.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        {
          role: "system",
          content: `
You are Shakti, an AI career guide for rural women in India.

Help users with:
- Jobs
- Training courses
- Government schemes
- Career guidance
- Digital literacy

Respond in ${languageName}.
Keep answers simple and practical.
`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300
    });

    return result.choices[0].message.content;

  } catch (error) {

    console.error("HF Error:", error);

    const intent = detectIntent(message);

    return (
      RESPONSES[intent]?.[language] ||
      RESPONSES[intent]?.en ||
      RESPONSES.general.en
    );
  }
};

exports.chat = async (req, res) => {
  try {
    const { message, session_token, language = 'en' } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message required' });

    let sessionId;
    let token = session_token;

    if (token) {
      const sess = await pool.query('SELECT id FROM chat_sessions WHERE session_token = $1', [token]);
      if (sess.rows[0]) {
        sessionId = sess.rows[0].id;
        await pool.query('UPDATE chat_sessions SET last_active = NOW() WHERE id = $1', [sessionId]);
      }
    }

    if (!sessionId) {
      token = uuidv4();
      const newSess = await pool.query(
        'INSERT INTO chat_sessions (user_id, session_token, language) VALUES ($1, $2, $3) RETURNING id',
        [req.user ? req.user.id : null, token, language]
      );
      sessionId = newSess.rows[0].id;
    }

    await pool.query(
      'INSERT INTO chat_messages (session_id, role, content) VALUES ($1, $2, $3)',
      [sessionId, 'user', message]
    );

    const aiResponse = await generateResponse(message, language);

    await pool.query(
      'INSERT INTO chat_messages (session_id, role, content) VALUES ($1, $2, $3)',
      [sessionId, 'assistant', aiResponse]
    );

    res.json({ success: true, response: aiResponse, session_token: token });
  }catch (err) {

  console.error("Chat Route Error:");
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message
  });
}
};

exports.getHistory = async (req, res) => {
  try {
    const { session_token } = req.params;
    const sess = await pool.query(
      'SELECT id FROM chat_sessions WHERE session_token = $1',
      [session_token]
    );
    if (!sess.rows[0]) return res.status(404).json({ success: false, message: 'Session not found' });
    const msgs = await pool.query(
      'SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
      [sess.rows[0].id]
    );
    res.json({ success: true, data: msgs.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
