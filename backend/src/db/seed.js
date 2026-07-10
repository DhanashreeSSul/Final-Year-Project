const pool = require('../db/pool');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const seed = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Hash for 'password123'
    const hash = await bcrypt.hash('password123', 12);

    // Org user
    const orgUser = await client.query(
      "INSERT INTO users (name, phone, email, password_hash, role, language_pref, state, district, is_verified) VALUES ('Mahila Vikas Foundation', '9000000001', 'org@shakti.in', $1, 'org', 'en', 'Maharashtra', 'Pune', TRUE) ON CONFLICT (phone) DO UPDATE SET name=EXCLUDED.name RETURNING id",
      [hash]
    );

    // Woman user
    const womanUser = await client.query(
      "INSERT INTO users (name, phone, email, password_hash, role, language_pref, state, district, village, is_verified) VALUES ('Savitri Devi', '9000000002', 'savitri@shakti.in', $1, 'user', 'hi', 'Uttar Pradesh', 'Varanasi', 'Rampur', TRUE) ON CONFLICT (phone) DO UPDATE SET name=EXCLUDED.name RETURNING id",
      [hash]
    );
    await client.query("INSERT INTO user_profiles (user_id, age, education, skills, interests, languages_known, work_experience) VALUES ($1, 28, 'Secondary (Class 9-10)', ARRAY['Sewing','Embroidery','Cooking'], ARRAY['Textile','Agriculture','Social Work'], ARRAY['Hindi','Bhojpuri'], '1-2 years') ON CONFLICT DO NOTHING", [womanUser.rows[0].id]);

    const orgId = orgUser.rows[0].id;

    // Create org profile
    const org = await client.query(
      "INSERT INTO organizations (user_id, org_name, org_type, description, state, district, contact_person, is_verified) VALUES ($1, 'Mahila Vikas Foundation', 'NGO', 'Dedicated to rural women empowerment through skill development and livelihood programs since 2005.', 'Maharashtra', 'Pune', 'Rekha Sharma', TRUE) ON CONFLICT DO NOTHING RETURNING id",
      [orgId]
    );

    if (org.rows[0]) {
      const orgRecId = org.rows[0].id;

      // Jobs
      const jobs = [
        { title: 'Tailoring Instructor', desc: 'Teach basic and advanced tailoring skills to rural women. Training and certification provided. Flexible timings. Work from community center.', type: 'part-time', mode: 'onsite', state: 'Maharashtra', district: 'Pune', salMin: 8000, salMax: 12000, skills: ['Sewing','Embroidery','Teaching'], edu: 'Secondary (Class 9-10)', cat: 'Tailoring', seats: 3 },
        { title: 'Digital Marketing Executive', desc: 'Help rural artisans sell their products online. Training in social media marketing and e-commerce provided. Remote work opportunity.', type: 'full-time', mode: 'remote', state: 'Maharashtra', district: 'Mumbai', salMin: 12000, salMax: 18000, skills: ['Digital Marketing','Computer Basics','MS Office'], edu: 'Higher Secondary (Class 11-12)', cat: 'IT', seats: 2 },
        { title: 'Agriculture Field Worker', desc: 'Support women farmers with modern farming techniques, organic certification, and cooperative formation. Training included.', type: 'full-time', mode: 'onsite', state: 'Uttar Pradesh', district: 'Lucknow', salMin: 7000, salMax: 10000, skills: ['Farming'], edu: 'Primary (Class 1-5)', cat: 'Agriculture', seats: 10 },
        { title: 'Community Health Worker', desc: 'Provide basic health education and maternal care support in rural areas. ASHA worker role. Government benefits applicable.', type: 'contract', mode: 'onsite', state: 'Rajasthan', district: 'Jaipur', salMin: 6000, salMax: 9000, skills: ['Healthcare'], edu: 'Secondary (Class 9-10)', cat: 'Healthcare', seats: 5 },
        { title: 'Data Entry Operator', desc: 'Work from home opportunity for rural women. Enter and manage data using computer. Training provided. Flexible hours, good for women with family responsibilities.', type: 'part-time', mode: 'remote', state: 'Andhra Pradesh', district: 'Vijayawada', salMin: 6000, salMax: 8000, skills: ['Data Entry','Computer Basics','MS Office'], edu: 'Secondary (Class 9-10)', cat: 'IT', seats: 8 },
        { title: 'Handicraft Artist & Trainer', desc: 'Create and teach traditional handicrafts including pottery, weaving, and block printing. Export opportunities available. Earn per piece basis also possible.', type: 'full-time', mode: 'onsite', state: 'Rajasthan', district: 'Jodhpur', salMin: 9000, salMax: 15000, skills: ['Handicrafts','Teaching'], edu: 'No Formal Education', cat: 'Handicrafts', seats: 4 },
      ];

      for (const j of jobs) {
        await client.query(
          "INSERT INTO jobs (org_id, title, description, job_type, work_mode, location_state, location_district, salary_min, salary_max, skills_required, education_required, category, seats, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,TRUE) ON CONFLICT DO NOTHING",
          [orgRecId, j.title, j.desc, j.type, j.mode, j.state, j.district, j.salMin, j.salMax, j.skills, j.edu, j.cat, j.seats]
        );
      }

      // Courses
      const courses = [
        { title: 'Basic Computer Skills', desc: 'Learn fundamentals of computer operation, internet usage, email, and basic MS Office. Perfect for beginners with no prior computer knowledge.', dur: '4 weeks', mode: 'offline', lang: ['Hindi','English'], skills: ['Computer Basics','MS Office','Internet'], cert: true, free: true, fee: 0, state: 'Uttar Pradesh', district: 'Lucknow', cat: 'Digital Literacy', seats: 25 },
        { title: 'Professional Tailoring & Dress Designing', desc: 'Comprehensive 3-month course covering all aspects of garment making, from basic stitching to advanced dress designing. Certificate from NSDC.', dur: '3 months', mode: 'offline', lang: ['Hindi','Marathi'], skills: ['Sewing','Embroidery'], cert: true, free: false, fee: 500, state: 'Maharashtra', district: 'Pune', cat: 'Tailoring', seats: 20 },
        { title: 'Mobile Banking & Digital Payments', desc: 'Learn to use mobile banking apps, UPI payments, and manage finances digitally. Crucial skill for financial independence. Completely free!', dur: '1 week', mode: 'online', lang: ['Hindi','English','Marathi','Telugu','Tamil'], skills: ['Mobile Banking','Digital Marketing'], cert: false, free: true, fee: 0, state: 'Maharashtra', district: null, cat: 'Finance', seats: 100 },
        { title: 'Organic Farming & SHG Formation', desc: 'Learn organic farming techniques, formation of Self Help Groups, cooperative marketing, and government scheme access for farmers.', dur: '6 weeks', mode: 'hybrid', lang: ['Hindi','Bengali'], skills: ['Farming'], cert: true, free: true, fee: 0, state: 'West Bengal', district: 'Murshidabad', cat: 'Agriculture', seats: 30 },
        { title: 'Digital Literacy & Social Media', desc: 'Online course to learn internet safety, social media use, online shopping, and digital communication. Available in 5 languages.', dur: '2 weeks', mode: 'online', lang: ['Hindi','English','Marathi','Telugu','Tamil','Kannada'], skills: ['Digital Marketing','Computer Basics'], cert: true, free: true, fee: 0, state: null, district: null, cat: 'Digital Literacy', seats: 500 },
      ];

      for (const c of courses) {
        await client.query(
          "INSERT INTO courses (org_id, title, description, duration, mode, language, skills_taught, certification, is_free, fee, location_state, location_district, category, seats, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,TRUE) ON CONFLICT DO NOTHING",
          [orgRecId, c.title, c.desc, c.dur, c.mode, c.lang, c.skills, c.cert, c.free, c.fee, c.state, c.district, c.cat, c.seats]
        );
      }
    }

    // Government Schemes
    const schemes = [
      { title: 'PM Mudra Yojana - Shishu, Kishor, Tarun', desc: 'Provides loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises. Women entrepreneurs get priority processing. No collateral required for Shishu loans.', type: 'Loan', ministry: 'Ministry of Finance', eligibility: '- Any Indian citizen starting a small business\n- Women-led businesses get priority\n- No collateral needed for loans up to ₹50,000\n- Age 18-65 years', benefits: '- Shishu: Up to ₹50,000 at low interest\n- Kishor: ₹50,001 to ₹5 lakh\n- Tarun: ₹5 lakh to ₹10 lakh\n- Priority for women entrepreneurs', apply: '1. Visit nearest bank/MFI/NBFC\n2. Fill Mudra loan application\n3. Submit business plan and KYC documents\n4. Approval within 7-10 working days', docs: ['Aadhaar Card', 'PAN Card', 'Bank Statement (6 months)', 'Business Plan', 'Caste Certificate (if SC/ST)', 'Passport Photo'], link: 'https://mudra.org.in', state: 'All', cat: 'Finance' },
      { title: 'Beti Bachao Beti Padhao', desc: 'Scheme to address declining Child Sex Ratio and related issues of empowerment of women over a lifecycle continuum. Focuses on education and welfare of girl child.', type: 'Social', ministry: 'Ministry of Women & Child Development', eligibility: '- Families with girl children\n- Available across India\n- Special focus on 640 selected districts\n- All communities eligible', benefits: '- Educational support for girls\n- Healthcare services\n- Protection from discrimination\n- Awareness campaigns\n- Community support programs', apply: '1. Contact local Anganwadi center\n2. Visit district office of Women & Child Development\n3. Enroll through school or Anganwadi', docs: ['Birth Certificate', 'Aadhaar of parents', 'Domicile Certificate'], link: 'https://wcd.nic.in/bbbp-schemes', state: 'All', cat: 'Women Empowerment' },
      { title: 'Sukanya Samriddhi Yojana', desc: 'Small savings scheme for girl child. Opened in the name of the girl child below age 10. Enjoy high interest rates and tax benefits. Designed to ensure bright future for daughters.', type: 'Savings', ministry: 'Ministry of Finance', eligibility: '- Girl child below 10 years of age\n- One account per girl child\n- Maximum two accounts per family\n- Must be Indian citizen', benefits: '- High interest rate (currently ~8.2% p.a.)\n- Tax exemption under Section 80C\n- Maturity at 21 years\n- Partial withdrawal at 18 for education/marriage\n- Minimum deposit ₹250/year', apply: '1. Visit any Post Office or authorized bank\n2. Fill SSY account opening form\n3. Submit girl child\'s birth certificate and parent\'s KYC\n4. Deposit minimum ₹250 to open account', docs: ['Girl Child\'s Birth Certificate', 'Parent\'s Aadhaar', 'Parent\'s PAN Card', 'Passport Photo'], link: 'https://www.nsiindia.gov.in', state: 'All', cat: 'Finance' },
      { title: 'PM Awas Yojana - Gramin (Rural Housing)', desc: 'Provides financial assistance to rural households for construction of pucca house with basic amenities. Priority to women-headed households.', type: 'Housing', ministry: 'Ministry of Rural Development', eligibility: '- Rural families without pucca house\n- Must be in SECC 2011 list\n- Priority: SC/ST, minorities, women-headed HH\n- Annual income limit applies', benefits: '- ₹1.2 lakh (plains) or ₹1.3 lakh (hilly areas)\n- Additional support for toilets under SBM\n- MGNREGS wages for unskilled labor\n- Loan facility up to ₹70,000', apply: '1. Apply through Gram Panchayat or BDO office\n2. Submit application with SECC details\n3. Bank account and Aadhaar mandatory\n4. Track status on AwaasSoft portal', docs: ['Aadhaar Card', 'Bank Account Details', 'SECC Beneficiary Code', 'BPL Certificate'], link: 'https://pmayg.nic.in', state: 'All', cat: 'Housing' },
      { title: 'National Rural Livelihood Mission (DAY-NRLM)', desc: 'Aajeevika scheme to mobilize rural poor women into Self Help Groups, provide skills training, and facilitate access to credit and livelihoods. Most successful women empowerment scheme in India.', type: 'Livelihood', ministry: 'Ministry of Rural Development', eligibility: '- Rural poor women aged 18-60\n- Must join or form Self Help Group\n- Priority to SC/ST/minorities/PwD\n- BPL and near-BPL families', benefits: '- SHG revolving fund (₹15,000)\n- Community Investment Fund (CIF)\n- Bank linkage for credit\n- Skill training and placement\n- Marketing support\n- Social security access', apply: '1. Join existing SHG in village\n2. Contact block-level NRLM office\n3. Form new SHG with 10-12 women\n4. Regular meetings and savings required', docs: ['Aadhaar Card', 'Bank Account', 'Proof of Residence', 'Income Certificate'], link: 'https://aajeevika.gov.in', state: 'All', cat: 'Women Empowerment' },
      { title: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)', desc: 'Flagship scheme for skill development of youth/women in India. Short-term training, RPL, and special projects. Certified training by NSDC and sector skill councils.', type: 'Skill', ministry: 'Ministry of Skill Development', eligibility: '- Indian citizens\n- Any age group\n- Special focus on school/college dropouts\n- Both employed and unemployed can apply', benefits: '- Free skill training and certification\n- Monetary reward on certification (RPL)\n- Post-placement support\n- Training in 300+ job roles\n- Recognized by industry', apply: '1. Visit PMKVY training center near you\n2. Register online at skillindiadigital.gov.in\n3. Complete training and assessment\n4. Receive NSQF-aligned certificate', docs: ['Aadhaar Card', 'Bank Account', 'Passport Photo', '10th Marksheet (if available)'], link: 'https://pmkvyofficial.org', state: 'All', cat: 'Education' },
    ];

    for (const s of schemes) {
      await client.query(
        "INSERT INTO schemes (title, description, scheme_type, ministry, eligibility_criteria, benefits, how_to_apply, documents_required, state, category, application_link, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,TRUE) ON CONFLICT DO NOTHING",
        [s.title, s.desc, s.type, s.ministry, s.eligibility, s.benefits, s.apply, s.docs, s.state, s.cat, s.link]
      );
    }

    await client.query('COMMIT');
    console.log('\n=== SEED COMPLETED SUCCESSFULLY ===');
    console.log('\nTest Accounts:');
    console.log('  Organization: phone=9000000001, password=password123');
    console.log('  Woman User:   phone=9000000002, password=password123');
    console.log('\nSeeded: 6 Jobs, 5 Courses, 6 Government Schemes\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

seed().catch(console.error);
