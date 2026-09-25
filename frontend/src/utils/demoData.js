// Realistic, verified demo data for Shakti Platform (academic evaluation and offline fallbacks)

export const DEMO_USERS = {
  woman: {
    id: 'usr-woman-demo-1',
    name: 'Savitri Devi',
    phone: '9000000002',
    email: 'savitri.devi@example.org',
    role: 'user',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    village: 'Shivpur',
    language_pref: 'hi',
    profile_complete: true,
    completion_percentage: 85,
    is_verified: true,
    aadhaar_masked: '•••• •••• 5678',
    profile: {
      age: 28,
      education: '10th Standard (Matric)',
      skills: ['Tailoring', 'Embroidery', 'Cooking', 'Smartphone Basics'],
      interests: ['Textile', 'Small Business', 'Agriculture', 'Self-Help Groups'],
      languages_known: ['Hindi', 'Bhojpuri'],
      work_experience: '2 years informal home stitching',
      career_goal: 'Start a tailoring micro-enterprise and earn ₹12,000/month',
      preferred_work_type: 'Part-time / Work from Home',
      availability: 'Immediate (4-5 hours/day)',
      bio: 'Enthusiastic rural artisan looking to upgrade stitching skills and connect with local foundations.'
    }
  },
  foundation: {
    id: 'usr-org-demo-1',
    name: 'Mahila Vikas Foundation',
    phone: '9000000001',
    email: 'contact@mahilavikas.org',
    role: 'org',
    state: 'Maharashtra',
    district: 'Pune',
    is_verified: true,
    org: {
      org_name: 'Mahila Vikas Foundation',
      org_type: 'Non-Governmental Organization (NGO)',
      registration_number: 'NGO/MH/2018/009182',
      sector: 'Women Vocational Training & Rural Livelihoods',
      description: 'Dedicated to skilling rural women in Maharashtra and UP through sustainable livelihood programs and fair-wage job linkages.',
      website: 'https://mahilavikas.org',
      contact_person: 'Sunita Patil (Program Director)',
      address: 'Plot 42, Gram Panchayat Road, Pimpri, Pune, MH - 411018'
    }
  }
};

export const DEMO_JOBS = [
  {
    id: 'job-1',
    title: 'Tailoring & Stitching Assistant',
    company: 'Mahila Vikas Foundation',
    org_id: 'usr-org-demo-1',
    location_district: 'Varanasi',
    location_state: 'Uttar Pradesh',
    work_mode: 'Work from Home / Local Hub',
    job_type: 'Part-time',
    salary_min: 8000,
    salary_max: 12000,
    skills_required: ['Tailoring', 'Stitching', 'Pattern Cutting'],
    education_required: '8th Pass or Basic Literacy',
    category: 'Textiles & Handicrafts',
    seats: 15,
    application_deadline: '2026-10-15',
    description: 'Provide stitching and embroidery support for rural artisan self-help groups. Materials provided at local collection center.',
    responsibilities: [
      'Stitch traditional garments and tote bags according to standard patterns',
      'Maintain fabric quality and inspect seams',
      'Submit finished batches weekly at the village common service center',
      'Coordinate with SHG group leader for timely deliveries'
    ],
    eligibility: 'Women aged 18-45 with basic sewing machine operation knowledge.',
    match_score: 94,
    match_breakdown: {
      skill_match: 96,
      interest_match: 92,
      location_match: 95,
      work_preference: 94
    },
    match_reasons: [
      'Matches your Tailoring and Embroidery skills',
      'Aligned with your preferred Part-time / Work from Home schedule',
      'Located within your district (Varanasi)',
      'Foundation offers subsidized sewing machine support'
    ]
  },
  {
    id: 'job-2',
    title: 'Handicraft & Crochet Artisan',
    company: 'Rural Artisans Livelihood Collective',
    location_district: 'Varanasi',
    location_state: 'Uttar Pradesh',
    work_mode: 'Work from Home',
    job_type: 'Flexible / Piece-rate',
    salary_min: 7000,
    salary_max: 11000,
    skills_required: ['Handicrafts', 'Embroidery', 'Crochet'],
    education_required: 'No formal schooling required',
    category: 'Art & Craft',
    seats: 25,
    application_deadline: '2026-10-30',
    description: 'Craft handmade jute bags and decorative handicraft items for festive urban markets with upfront raw materials.',
    responsibilities: [
      'Weave and crochet decorative pieces following training samples',
      'Attend bi-weekly village cluster meetings',
      'Maintain inventory of supplied yarn and jute'
    ],
    eligibility: 'Rural women registered under Deendayal Antyodaya Yojana or local SHG.',
    match_score: 89,
    match_breakdown: {
      skill_match: 92,
      interest_match: 88,
      location_match: 95,
      work_preference: 82
    },
    match_reasons: [
      'Directly matches your Embroidery skill',
      '100% Home-based work',
      'Same village cluster pickup'
    ]
  },
  {
    id: 'job-3',
    title: 'Digital Literacy Community Mobilizer',
    company: 'Pratham Digital Sakhi Initiative',
    location_district: 'Varanasi',
    location_state: 'Uttar Pradesh',
    work_mode: 'On-site Village Hub',
    job_type: 'Full-time',
    salary_min: 11000,
    salary_max: 15000,
    skills_required: ['Smartphone Basics', 'Communication', 'Hindi'],
    education_required: '10th Standard or 12th Standard',
    category: 'Education & Community',
    seats: 6,
    application_deadline: '2026-11-10',
    description: 'Guide fellow village women on how to use UPI, DigiLocker, and government portals on their smartphones safely.',
    responsibilities: [
      'Conduct 1-hour digital literacy camps in village Anganwadi centers',
      'Demonstrate safe digital payments and Aadhaar authentication',
      'Help beneficiaries register for government welfare schemes'
    ],
    eligibility: 'Women with smartphone familiarity and strong community communication.',
    match_score: 84,
    match_breakdown: {
      skill_match: 85,
      interest_match: 82,
      location_match: 90,
      work_preference: 80
    },
    match_reasons: [
      'Utilizes your smartphone familiarity and local dialect',
      'High community impact role with fixed monthly stipend'
    ]
  },
  {
    id: 'job-4',
    title: 'Organic Food Processing & Packaging Worker',
    company: 'Annapurna Women Farmer Producer Company',
    location_district: 'Mirzapur',
    location_state: 'Uttar Pradesh',
    work_mode: 'Cluster Processing Unit',
    job_type: 'Part-time',
    salary_min: 9000,
    salary_max: 13000,
    skills_required: ['Food Processing', 'Hygiene Standards', 'Packaging'],
    education_required: '5th Pass or Literate',
    category: 'Agriculture & Food',
    seats: 20,
    application_deadline: '2026-11-20',
    description: 'Sort, dry, and package organic spices and millet products under FSSAI certified community facility.',
    responsibilities: [
      'Clean and process spices according to food safety protocols',
      'Weigh and seal vacuum packs',
      'Track batch numbers and manufacturing dates'
    ],
    eligibility: 'Women belonging to agricultural households.',
    match_score: 79,
    match_breakdown: {
      skill_match: 75,
      interest_match: 85,
      location_match: 78,
      work_preference: 80
    },
    match_reasons: [
      'Matches your interest in Agriculture and Small Business',
      'Free transport provided from nearby villages'
    ]
  }
];

export const DEMO_COURSES = [
  {
    id: 'course-1',
    title: 'Advanced Machine Stitching & Blouse Designing',
    provider: 'National Skill Development Corporation (NSDC)',
    duration: '4 Weeks (2 hrs/day)',
    mode: 'Hybrid (Village Hub + Video Lessons)',
    skills_taught: ['Advanced Tailoring', 'Pattern Cutting', 'Garment Finishing', 'Pricing'],
    certification: true,
    is_free: true,
    category: 'Vocational Skills',
    start_date: '2026-10-01',
    seats: 30,
    description: 'Comprehensive practical training covering garment measurements, neckline finishing, and market-ready blouse creation. Certificate recognized across India.',
    eligibility: 'Women with basic hand stitching or sewing machine experience.'
  },
  {
    id: 'course-2',
    title: 'Digital Literacy & Secure Smartphone Banking',
    provider: 'PMGDISHA & Shakti Foundation',
    duration: '2 Weeks (1 hr/day)',
    mode: 'Mobile App / Self-paced',
    skills_taught: ['UPI Payments', 'DigiLocker', 'WhatsApp for Business', 'Cyber Safety'],
    certification: true,
    is_free: true,
    category: 'Digital Skills',
    start_date: 'Always Open',
    seats: 500,
    description: 'Learn how to protect your passwords, use voice typing in your mother tongue, check bank balances safely, and scan QR codes without fraud.',
    eligibility: 'All rural citizens with any Android smartphone.'
  },
  {
    id: 'course-3',
    title: 'Micro-Enterprise & SHG Accounting Basics',
    provider: 'NABARD Rural Entrepreneurship Cell',
    duration: '3 Weeks (Weekend Classes)',
    mode: 'Community Center / In-Person',
    skills_taught: ['Bookkeeping', 'Mudra Loan Application', 'Costing & Profit', 'GST Exemption'],
    certification: true,
    is_free: true,
    category: 'Entrepreneurship',
    start_date: '2026-10-15',
    seats: 40,
    description: 'Understand how to calculate raw material costs, maintain simple registers, and apply for government subsidized credit under Stand-Up India.',
    eligibility: 'Rural women planning to start or expand a home business.'
  },
  {
    id: 'course-4',
    title: 'Organic Mushroom Cultivation & Terrace Farming',
    provider: 'Krishi Vigyan Kendra (KVK)',
    duration: '10 Days',
    mode: 'Practical Hands-on at KVK',
    skills_taught: ['Composting', 'Spawning', 'Harvesting', 'Cold Storage'],
    certification: true,
    is_free: true,
    category: 'Agriculture',
    start_date: '2026-11-01',
    seats: 25,
    description: 'Low-cost high-yield mushroom cultivation inside small rooms or sheds. Generates quick revenue within 25 days.',
    eligibility: 'Open to rural women and farmer families.'
  }
];

export const DEMO_SCHEMES = [
  {
    id: 'scheme-1',
    title: 'PM Vishwakarma Yojana (Tailor / Darzi)',
    ministry: 'Ministry of Micro, Small and Medium Enterprises',
    scheme_type: 'Central Sector Scheme',
    state: 'All India',
    category: 'Artisans & Craftsmen',
    eligibility_criteria: 'Artisans and craftspersons working with their hands and tools. Minimum age 18 years. No Mudra loan availed in the last 5 years.',
    benefits: 'Skill training with ₹500/day stipend, ₹15,000 modern toolkit incentive (for sewing machines), and collateral-free enterprise loan up to ₹3,00,000 at 5% interest.',
    how_to_apply: 'Enroll with Aadhaar and biometric verification at the nearest Common Services Center (CSC).',
    documents_required: ['Aadhaar Card', 'Bank Passbook', 'Active Mobile Number', 'Ration Card'],
    application_link: 'https://pmvishwakarma.gov.in',
    match_score: 98,
    is_eligible: true
  },
  {
    id: 'scheme-2',
    title: 'Lakhpati Didi Initiative',
    ministry: 'Ministry of Rural Development (DAY-NRLM)',
    scheme_type: 'Central Initiative',
    state: 'All India',
    category: 'Women Empowerment & Livelihoods',
    eligibility_criteria: 'Active members of rural Self-Help Groups (SHGs) under Deendayal Antyodaya Yojana.',
    benefits: 'Livelihood planning, market linkages, interest subvention on bank credit, and targeted training to achieve minimum ₹1,00,000 annual sustainable income.',
    how_to_apply: 'Contact your Village Organization (VO) or Cluster Level Federation (CLF) SHG coordinator.',
    documents_required: ['SHG Passbook', 'Aadhaar Card', 'Livelihood Activity Proposal'],
    application_link: 'https://nrlm.gov.in',
    match_score: 95,
    is_eligible: true
  },
  {
    id: 'scheme-3',
    title: 'Pradhan Mantri Mudra Yojana (Shishu & Kishore)',
    ministry: 'Department of Financial Services, Ministry of Finance',
    scheme_type: 'Central Scheme',
    state: 'All India',
    category: 'Financial Assistance & Loans',
    eligibility_criteria: 'Any Indian woman entrepreneur having a business plan for non-farm income generation.',
    benefits: 'Shishu: Loans up to ₹50,000 with zero processing fees and no collateral. Kishore: Loans from ₹50,000 to ₹5,00,000.',
    how_to_apply: 'Apply through your local public sector bank, regional rural bank (RRB), or via the Udyamimitra portal.',
    documents_required: ['Identity Proof', 'Address Proof', 'Quotation for Machinery/Tools', 'Passport Photo'],
    application_link: 'https://www.mudra.org.in',
    match_score: 91,
    is_eligible: true
  },
  {
    id: 'scheme-4',
    title: 'Mahila Samman Savings Certificate (MSSC)',
    ministry: 'Ministry of Finance',
    scheme_type: 'Small Savings Scheme',
    state: 'All India',
    category: 'Savings & Investment',
    eligibility_criteria: 'Any girl or woman citizen of India. Can be opened individually or on behalf of a minor girl.',
    benefits: 'High fixed interest rate of 7.5% per annum compounded quarterly. Tenure of 2 years with partial withdrawal facility up to 40% after 1 year.',
    how_to_apply: 'Visit any Post Office or designated Public/Private Bank branch with identity documents.',
    documents_required: ['Aadhaar Card', 'PAN Card or Form 60', 'Account Opening Form'],
    application_link: 'https://www.indiapost.gov.in',
    match_score: 86,
    is_eligible: true
  },
  {
    id: 'scheme-5',
    title: 'Stand-Up India Scheme for Women Entrepreneurs',
    ministry: 'Department of Financial Services',
    scheme_type: 'Central Scheme',
    state: 'All India',
    category: 'Enterprise Finance',
    eligibility_criteria: 'Women entrepreneurs above 18 years setting up a greenfield enterprise in manufacturing, services, or trading.',
    benefits: 'Bank loan between ₹10 lakh and ₹1 crore to at least one woman borrower per bank branch, repayable up to 7 years.',
    how_to_apply: 'Online via the Stand-Up India portal or through SIDBI lead district managers.',
    documents_required: ['Project Report', 'Identity & Address Proof', 'Proof of Promoters Holding (minimum 51%)'],
    application_link: 'https://www.standupmitra.in',
    match_score: 80,
    is_eligible: true
  }
];

export const DEMO_APPLICANTS = [
  {
    id: 'app-1',
    applicant_name: 'Savitri Devi',
    phone: '9000000002',
    job_title: 'Tailoring & Stitching Assistant',
    location: 'Shivpur, Varanasi, UP',
    skills: ['Tailoring', 'Embroidery', 'Pattern Cutting'],
    experience: '2 years home stitching',
    applied_date: '2026-09-02',
    status: 'Shortlisted',
    timeline: [
      { step: 'Application Submitted', date: '02 Sep 2026', done: true },
      { step: 'Foundation Viewed Application', date: '03 Sep 2026', done: true },
      { step: 'Shortlisted for Trial', date: '05 Sep 2026', done: true },
      { step: 'Skill Evaluation at Local Hub', date: 'Pending', done: false },
      { step: 'Final Selection & Toolkit Allocation', date: 'Pending', done: false }
    ],
    match_score: 94,
    match_reasons: [
      'Exceeds minimum stitching requirement',
      'Lives within 4 km of Varanasi collection center',
      'Available for 4-5 hours daily'
    ]
  },
  {
    id: 'app-2',
    applicant_name: 'Pooja Maurya',
    phone: '9876543210',
    job_title: 'Tailoring & Stitching Assistant',
    location: 'Rohania, Varanasi, UP',
    skills: ['Tailoring', 'Garment Finishing'],
    experience: '1 year boutique assistant',
    applied_date: '2026-09-03',
    status: 'Under Review',
    timeline: [
      { step: 'Application Submitted', date: '03 Sep 2026', done: true },
      { step: 'Foundation Viewed Application', date: '04 Sep 2026', done: true },
      { step: 'Shortlisted', date: 'Pending', done: false },
      { step: 'Skill Evaluation', date: 'Pending', done: false },
      { step: 'Final Selection', date: 'Pending', done: false }
    ],
    match_score: 88,
    match_reasons: [
      'Has experience in boutique garment finishing',
      'Smartphone literate with digital payment knowledge'
    ]
  },
  {
    id: 'app-3',
    applicant_name: 'Meena Kumari',
    phone: '9812345678',
    job_title: 'Digital Literacy Community Mobilizer',
    location: 'Pindra, Varanasi, UP',
    skills: ['Smartphone Basics', 'Hindi', 'Public Speaking'],
    experience: 'Anganwadi helper for 3 years',
    applied_date: '2026-09-04',
    status: 'Interview',
    timeline: [
      { step: 'Application Submitted', date: '04 Sep 2026', done: true },
      { step: 'Foundation Viewed Application', date: '04 Sep 2026', done: true },
      { step: 'Shortlisted for Interview', date: '05 Sep 2026', done: true },
      { step: 'Telephonic / Video Interview', date: '07 Sep 2026', done: true },
      { step: 'Final Onboarding', date: 'Pending', done: false }
    ],
    match_score: 91,
    match_reasons: [
      'Prior community mobilization experience in Anganwadi',
      'Fluent in local dialect and Hindi'
    ]
  }
];

export const DEMO_ROADMAP_STEPS = [
  {
    stepNumber: 1,
    title: 'Complete Digital Literacy & Smartphone Safety',
    description: 'Learn secure UPI payments, voice search in Hindi/regional language, and how to safeguard personal credentials.',
    status: 'completed', // completed, active, pending
    duration: '1-2 Weeks',
    badge: 'Foundation',
    actionText: 'Review Certificate'
  },
  {
    stepNumber: 2,
    title: 'Certified Vocational Skill Training',
    description: 'Enroll in PM Vishwakarma or NSDC certified Tailoring & Garment Design course with practical toolkit support.',
    status: 'active',
    duration: '4 Weeks',
    badge: 'In Progress (65%)',
    actionText: 'Continue Learning'
  },
  {
    stepNumber: 3,
    title: 'Build Verified Digital Profile & Showcase Work',
    description: 'Upload samples of hand-stitched garments, verify Aadhaar with zero-knowledge encryption, and set income preferences.',
    status: 'pending',
    duration: '3 Days',
    badge: 'Next Step',
    actionText: 'Update Profile'
  },
  {
    stepNumber: 4,
    title: 'Apply for Recommended Local Opportunities',
    description: 'Receive AI-matched job offers from certified foundations like Mahila Vikas Foundation with 90%+ compatibility.',
    status: 'pending',
    duration: 'Ongoing',
    badge: 'Job Linkage',
    actionText: 'View Matched Jobs'
  },
  {
    stepNumber: 5,
    title: 'Micro-Enterprise & Sustainable Earnings',
    description: 'Access collateral-free Mudra Shishu loan (up to ₹50,000) or Lakhpati Didi funding to establish a village stitching micro-unit.',
    status: 'pending',
    duration: 'Long-term Goal',
    badge: 'Financial Independence',
    actionText: 'Explore Schemes'
  }
];
