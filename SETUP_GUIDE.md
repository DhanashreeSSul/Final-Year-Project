# SHAKTI PLATFORM — COMPLETE SETUP & DEPLOYMENT GUIDE
## Secured AI-Enabled Platform for Digital Literacy and Career Empowerment for Rural Women in India

---

## PROJECT OVERVIEW

**Platform Name:** Shakti
**Target Users:**
- Rural Women (Users): Register, explore jobs/courses/schemes, chat with AI guide
- Organizations/NGOs: Register, post jobs, create training courses, manage applications

**Core Features:**
✓ OTP-based secure registration (privacy-preserving)
✓ Multilingual AI chatbot (English, Hindi, Marathi, Telugu, Tamil, Kannada)
✓ Voice input via Web Speech API
✓ AI career recommender (location + skills matching)
✓ Job board with filters (state, district, category, work mode)
✓ Free training courses with certification tracking
✓ Government schemes database (PM Mudra, NRLM, PMKVY, etc.)
✓ Application tracking dashboard
✓ Organization portal (post jobs, manage courses)
✓ Bookmark/save functionality
✓ Notification system
✓ Profile completeness tracker
✓ Role-based access (women vs org)
✓ Offline-ready UI (works on low bandwidth)
✓ Pink-themed responsive design

---

## DIRECTORY STRUCTURE

```
shakti-platform/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── server.js          # Main server entry
│   │   ├── db/
│   │   │   ├── pool.js        # PostgreSQL connection pool
│   │   │   ├── migrate.js     # Run once: creates all tables
│   │   │   └── seed.js        # Populates with demo data
│   │   ├── routes/            # API route definitions
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT authentication
│   │   └── utils/
│   │       ├── jwt.js         # Token generation/verification
│   │       └── otp.js         # OTP generation/verification
│   ├── .env                   # Environment variables (edit this!)
│   └── package.json
│
└── frontend/                   # React.js Application
    ├── src/
    │   ├── App.js             # Routes & layout
    │   ├── index.js           # React entry point
    │   ├── context/
    │   │   └── AuthContext.js # Global auth state
    │   ├── utils/
    │   │   └── api.js         # All API calls (Axios)
    │   ├── styles/
    │   │   └── globals.css    # Pink-themed design system
    │   ├── components/shared/ # Navbar, Footer, Modal, etc.
    │   └── pages/             # All page components
    │       ├── LandingPage.js
    │       ├── LoginPage.js
    │       ├── RegisterPage.js
    │       ├── Dashboard.js       # Women dashboard
    │       ├── ChatbotPage.js     # AI multilingual chatbot
    │       ├── JobsPage.js        # Job listings
    │       ├── JobDetailPage.js   # Job details + apply
    │       ├── CoursesPage.js     # Training courses
    │       ├── CourseDetailPage.js
    │       ├── SchemesPage.js     # Govt schemes
    │       ├── SchemeDetailPage.js
    │       ├── ProfilePage.js     # User profile + applications
    │       ├── ApplicationsPage.js
    │       ├── OrgDashboardPage.js # Org portal
    │       ├── OrgJobsPage.js
    │       └── OrgCoursesPage.js
    ├── .env                   # Frontend env (API URL)
    └── package.json
```

---

## STEP 1: PREREQUISITES

Install the following before starting:

1. **Node.js** (v18+): https://nodejs.org
2. **PostgreSQL** (v14+): https://www.postgresql.org/download/
3. **npm** (comes with Node.js)

Verify installations:
```bash
node --version     # Should show v18+
npm --version      # Should show 9+
psql --version     # Should show 14+
```

---

## STEP 2: DATABASE SETUP

### 2a. Create PostgreSQL Database

Open your terminal and run:
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Inside psql prompt, run:
CREATE DATABASE shakti_platform;
\q
```

### 2b. Configure Backend Environment

Open `backend/.env` and update:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shakti_platform
DB_USER=postgres
DB_PASSWORD=YOUR_ACTUAL_POSTGRES_PASSWORD   ← CHANGE THIS
JWT_SECRET=any_long_random_string_here       ← CHANGE THIS
```

---

## STEP 3: BACKEND SETUP

```bash
# Navigate to backend folder
cd shakti-platform/backend

# Install dependencies
npm install

# Run database migrations (creates all tables)
npm run migrate

# Seed with demo data (jobs, schemes, courses, test users)
npm run seed

# Start development server
npm run dev
```

✅ Backend will run at: http://localhost:5000
✅ Test the API: http://localhost:5000/api/health

---

## STEP 4: FRONTEND SETUP

Open a new terminal:
```bash
# Navigate to frontend folder
cd shakti-platform/frontend

# Install dependencies
npm install

# Start development server
npm start
```

✅ Frontend will open at: http://localhost:3000

---

## STEP 5: TEST THE PLATFORM

After seeding, use these demo accounts:

**Woman User Account:**
- Phone: 9000000002
- Password: password123
- Features: Browse jobs/courses/schemes, AI chatbot, apply, view dashboard

**Organization Account:**
- Phone: 9000000001
- Password: password123
- Features: Post jobs, create courses, manage org profile

**Register New Account:**
1. Click "Register Free"
2. Enter mobile number → Click "Send OTP"
3. In development mode, OTP is shown in browser console AND in the toast notification
4. Enter OTP → Set password → Done!

---

## STEP 6: API ENDPOINTS REFERENCE

### Authentication
```
POST /api/auth/send-otp       - Send OTP to phone
POST /api/auth/register       - Register with OTP verification
POST /api/auth/login          - Login with phone + password
POST /api/auth/reset-password - Reset password with OTP
GET  /api/auth/me             - Get current user (Auth required)
```

### Jobs
```
GET    /api/jobs              - List jobs (supports filters: state, district, category, work_mode, search, page)
GET    /api/jobs/:id          - Get job details
POST   /api/jobs              - Create job (Org only)
PUT    /api/jobs/:id          - Update job (Org only)
DELETE /api/jobs/:id          - Soft-delete job (Org only)
```

### Courses
```
GET  /api/courses             - List courses (filters: state, category, mode, is_free, search)
GET  /api/courses/:id         - Course details
POST /api/courses             - Create course (Org only)
```

### Schemes
```
GET /api/schemes              - List government schemes (filters: state, category, search)
GET /api/schemes/:id          - Scheme details
```

### Applications
```
POST /api/applications        - Apply for job/course/scheme
GET  /api/applications/my     - Get user's applications
PATCH /api/applications/:id/status - Update status (Org)
```

### Chatbot
```
POST /api/chatbot/message     - Send message to AI chatbot
GET  /api/chatbot/history/:token - Get chat history
```

### Recommendations
```
GET /api/recommendations      - Get personalized recommendations (Auth)
```

### Users
```
PUT  /api/users/profile           - Update user profile
GET  /api/users/notifications     - Get notifications
POST /api/users/bookmarks         - Toggle bookmark
GET  /api/users/bookmarks         - List bookmarks
```

### Organizations
```
GET  /api/organizations/my        - Get org profile
POST /api/organizations/my        - Create/update org profile
GET  /api/organizations/dashboard - Org stats
```

### Analytics
```
GET /api/analytics/stats          - Platform-wide statistics
```

---

## STEP 7: CONNECT REAL SMS OTP (Production)

Replace the console.log OTP in `backend/src/controllers/authController.js`:

### Option A: Twilio (Recommended)
```bash
npm install twilio
```
```javascript
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

await client.messages.create({
  body: `Your Shakti OTP is: ${otp}. Valid for 10 minutes.`,
  from: process.env.TWILIO_PHONE,
  to: `+91${phone}`
});
```

### Option B: MSG91 (Indian SMS Provider)
```bash
npm install msg91
```
```javascript
const msg91 = require('msg91')(process.env.MSG91_AUTH_KEY);
msg91.sendOTP({ mobile: `91${phone}`, message: `Your Shakti OTP: ${otp}` });
```

Add to `.env`:
```


---

## STEP 8: UPGRADE CHATBOT WITH CLAUDE AI (Optional)

The current chatbot uses rule-based intent detection. To upgrade to Claude AI:

1. Get API key: https://console.anthropic.com
2. Install: `npm install @anthropic-ai/sdk`
3. In `chatbotController.js`, replace `generateResponse` with:

```javascript
const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const generateResponse = async (message, language) => {
  const systemPrompt = `You are Shakti, an AI career guide for rural women in India.
  You help women find jobs, training courses, and government schemes.
  Respond in ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'}.
  Be encouraging, simple, and practical. Keep responses concise.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [{ role: 'user', content: message }],
    system: systemPrompt
  });
  return response.content[0].text;
};
```

Add to `.env`:
```


---

## STEP 9: PRODUCTION DEPLOYMENT

### Backend (Render / Railway / AWS EC2)

1. Create account on [Render](https://render.com) (free tier available)
2. Create new "Web Service"
3. Connect your GitHub repo
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add all environment variables from `.env`
7. Use Render's free PostgreSQL database

### Frontend (Vercel / Netlify)

1. Create account on [Vercel](https://vercel.com)
2. Import your GitHub repo
3. Set root directory to `frontend/`
4. Add env variable: `REACT_APP_API_URL=https://your-backend.render.com/api`
5. Deploy!

### Update CORS

In `backend/.env`:
```
FRONTEND_URL=https://your-app.vercel.app
```

---

## STEP 10: ADDING NEW FEATURES

### Add a New Government Scheme (via DB)
```sql
INSERT INTO schemes (title, description, scheme_type, ministry, eligibility_criteria, benefits, how_to_apply, documents_required, state, category, application_link)
VALUES ('Your Scheme', 'Description', 'Type', 'Ministry Name', 'Who can apply', 'Benefits', 'How to apply', ARRAY['Doc1','Doc2'], 'All', 'Category', 'https://link.gov.in');
```

### Add Admin Scheme Management
Create `backend/src/routes/admin.js` with protected routes using `authorize('admin')` middleware.

### Add Multilingual Database Content
Store titles in JSON:
```sql
ALTER TABLE jobs ADD COLUMN title_hi VARCHAR(255);
ALTER TABLE jobs ADD COLUMN title_mr VARCHAR(255);
```
Then serve based on user's `language_pref`.

---

## SECURITY FEATURES IMPLEMENTED

1. **OTP Verification**: Phone-based registration with time-limited OTP
2. **Password Hashing**: bcrypt with salt factor 12
3. **JWT Authentication**: Token-based with 7-day expiry
4. **Rate Limiting**: 100 requests per 15 minutes per IP
5. **Helmet.js**: HTTP security headers
6. **CORS**: Restricted to frontend origin only
7. **Input Validation**: express-validator on all endpoints
8. **SQL Injection Prevention**: Parameterized queries throughout
9. **Role-Based Access Control**: user/org/admin roles enforced server-side
10. **Soft Deletes**: Jobs are deactivated, not deleted (data preservation)

---

## ARCHITECTURE SUMMARY

```
React Frontend (Port 3000)
        ↕ HTTPS API calls
Node.js/Express Backend (Port 5000)
        ↕ Connection Pool
PostgreSQL Database (Port 5432)

Key patterns:
- JWT token stored in localStorage
- All API calls via Axios with interceptors
- Auto-logout on 401 responses
- Role-based route protection on both client and server
- Optimistic UI updates for better UX
```

---

## TROUBLESHOOTING

**Error: "connect ECONNREFUSED 127.0.0.1:5432"**
→ PostgreSQL is not running. Start it with: `sudo service postgresql start` (Linux) or open pgAdmin (Windows)

**Error: "Database does not exist"**
→ Run: `psql -U postgres -c "CREATE DATABASE shakti_platform;"`

**OTP not received**
→ In development mode, OTP is printed in backend terminal and shown in browser toast. Check there.

**CORS error in browser**
→ Make sure `FRONTEND_URL` in backend `.env` matches exactly where your React app is running.

**"relation does not exist" error**
→ Migrations not run. Execute: `cd backend && npm run migrate`

---

## RESEARCH PAPER COMPONENTS

The platform implements research concepts:
- **Privacy-Preserving AI**: Minimal data collection, consent-based, OTP-only auth
- **Hybrid Recommender System**: Content-based (skills match) + Context-aware (location proximity)
- **NLP Chatbot**: Intent classification with multilingual support
- **Edge AI Ready**: Stateless API design enables edge computation
- **Verifiable Credentials**: JWT-based role verification
- **Digital Literacy**: Progressive complexity UI for low-literacy users

---

*Shakti Platform v1.0.0 — Empowering Rural Women through AI-Driven Digital Empowerment*
*Built for IEEE Research Paper: "Secured AI-Enabled Platform for Digital Literacy and Career Empowerment for Rural Women in India"*
