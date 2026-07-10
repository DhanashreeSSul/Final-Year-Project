const pool = require('../db/pool');

/**
 * Hybrid Recommender System
 * Combines: skills match score + interest/category match + location proximity + freshness
 * Returns scored, ranked results per type.
 */

// Map interests/skills → job/course categories
const INTEREST_CATEGORY_MAP = {
  'Agriculture':      ['Agriculture'],
  'Textile':          ['Tailoring','Handicrafts'],
  'Arts & Crafts':    ['Handicrafts','Tailoring'],
  'Teaching':         ['Education'],
  'Healthcare':       ['Healthcare'],
  'Business':         ['Finance','Retail'],
  'Technology':       ['IT','Digital Literacy'],
  'Food Processing':  ['Agriculture','Retail'],
  'Social Work':      ['Social Work','Education'],
  'Finance':          ['Finance','Retail'],
  'Environment':      ['Agriculture'],
};

const SKILL_CATEGORY_MAP = {
  'Sewing':           ['Tailoring'],
  'Embroidery':       ['Tailoring','Handicrafts'],
  'Farming':          ['Agriculture'],
  'Computer Basics':  ['IT','Digital Literacy'],
  'MS Office':        ['IT','Finance'],
  'Digital Marketing':['IT'],
  'Accounting':       ['Finance'],
  'Mobile Banking':   ['Finance'],
  'Teaching':         ['Education'],
  'Healthcare':       ['Healthcare'],
  'Retail':           ['Retail'],
  'Customer Service': ['Retail','Social Work'],
  'Data Entry':       ['IT'],
  'Photography':      ['IT','Handicrafts'],
  'Cooking':          ['Food Processing','Agriculture'],
  'Handicrafts':      ['Handicrafts'],
};

/**
 * Score a job against the user profile.
 * Returns a score 0–100.
 */
function scoreJob(job, profile) {
  let score = 0;

  const userSkills   = (profile.skills   || []).map(s => s.toLowerCase());
  const userInterests= (profile.interests|| []).map(s => s.toLowerCase());
  const userState    = (profile.state    || '').toLowerCase();
  const userDistrict = (profile.district || '').toLowerCase();
  const jobState     = (job.location_state   || '').toLowerCase();
  const jobDistrict  = (job.location_district|| '').toLowerCase();
  const jobCat       = (job.category || '').toLowerCase();
  const jobSkills    = (job.skills_required || []).map(s => s.toLowerCase());

  // 1. Skills match (0–35)
  if (jobSkills.length > 0 && userSkills.length > 0) {
    const matched = userSkills.filter(s => jobSkills.some(js => js.includes(s) || s.includes(js)));
    score += Math.round((matched.length / jobSkills.length) * 35);
  }

  // 2. Interest → category match (0–25)
  let catScore = 0;
  for (const interest of profile.interests || []) {
    const cats = INTEREST_CATEGORY_MAP[interest] || [];
    if (cats.some(c => c.toLowerCase() === jobCat)) { catScore = 25; break; }
  }
  for (const skill of profile.skills || []) {
    const cats = SKILL_CATEGORY_MAP[skill] || [];
    if (cats.some(c => c.toLowerCase() === jobCat) && catScore < 20) { catScore = 20; }
  }
  score += catScore;

  // 3. Location match (0–25)
  if (job.work_mode === 'remote') {
    score += 20; // remote is always accessible
  } else if (userDistrict && jobDistrict && userDistrict === jobDistrict) {
    score += 25; // same district = best
  } else if (userState && jobState && userState === jobState) {
    score += 15; // same state
  }

  // 4. Freshness bonus (0–10): newer jobs get small boost
  const daysOld = (Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24);
  if (daysOld < 7)  score += 10;
  else if (daysOld < 30) score += 5;

  // 5. Has salary info (0–5)
  if (job.salary_min) score += 5;

  return Math.min(score, 100);
}

/**
 * Score a course against user profile.
 */
function scoreCourse(course, profile) {
  let score = 0;

  const userSkills   = (profile.skills   || []).map(s => s.toLowerCase());
  const userInterests= (profile.interests|| []).map(s => s.toLowerCase());
  const userState    = (profile.state    || '').toLowerCase();
  const userLang     = (profile.languages_known || ['Hindi','English']).map(l => l.toLowerCase());
  const courseCat    = (course.category  || '').toLowerCase();
  const courseTaught = (course.skills_taught || []).map(s => s.toLowerCase());
  const courseLangs  = (course.language  || []).map(l => l.toLowerCase());
  const courseState  = (course.location_state || '').toLowerCase();
  const courseMode   = (course.mode || '').toLowerCase();

  // 1. Skills alignment: user wants to learn skills in their interest categories (0–30)
  let skillInterestScore = 0;
  for (const interest of profile.interests || []) {
    const cats = INTEREST_CATEGORY_MAP[interest] || [];
    if (cats.some(c => c.toLowerCase() === courseCat)) { skillInterestScore = 30; break; }
  }
  score += skillInterestScore;

  // 2. New skill potential: course teaches what user doesn't already know (0–20)
  const newSkills = courseTaught.filter(s => !userSkills.some(us => us.includes(s) || s.includes(us)));
  if (newSkills.length > 0 && courseTaught.length > 0) {
    score += Math.round((newSkills.length / courseTaught.length) * 20);
  }

  // 3. Language accessibility (0–20)
  if (courseLangs.length === 0) {
    score += 10; // no language restriction
  } else {
    const langMatch = courseLangs.some(cl =>
      userLang.some(ul => ul.includes(cl) || cl.includes(ul))
    );
    if (langMatch) score += 20;
  }

  // 4. Location / mode accessibility (0–15)
  if (courseMode === 'online') {
    score += 15; // online = accessible from anywhere
  } else if (userState && courseState && userState === courseState) {
    score += 15;
  }

  // 5. Free courses preferred for rural users (0–10)
  if (course.is_free) score += 10;

  // 6. Certificate value (0–5)
  if (course.certification) score += 5;

  return Math.min(score, 100);
}

/**
 * Score a scheme against user profile.
 */
function scoreScheme(scheme, profile) {
  let score = 50; // base: all schemes are potentially relevant
  const userState  = (profile.state || '').toLowerCase();
  const schemeCat  = (scheme.category || '').toLowerCase();
  const schemeState= (scheme.state   || 'all').toLowerCase();
  const userInterests = (profile.interests || []).map(s => s.toLowerCase());

  // Location match
  if (schemeState === 'all') score += 20;
  else if (userState && schemeState === userState) score += 30;

  // Interest/category alignment
  const catInterestMap = {
    'finance': ['Business','Finance'],
    'women empowerment': ['Social Work','Business','Finance'],
    'agriculture': ['Agriculture','Food Processing','Environment'],
    'education': ['Teaching'],
    'health': ['Healthcare'],
    'housing': [],
  };
  const related = catInterestMap[schemeCat] || [];
  if (userInterests.some(ui => related.map(r=>r.toLowerCase()).includes(ui))) {
    score += 20;
  }

  return Math.min(score, 100);
}

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch full profile
    const profileResult = await pool.query(
      `SELECT u.name, u.state, u.district, u.language_pref,
              p.age, p.education, p.skills, p.interests, p.languages_known, p.work_experience
       FROM users u
       LEFT JOIN user_profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );
    const profile = profileResult.rows[0] || {};

    // Fetch candidate pools (more than we'll return so we can rank properly)
    const [jobsResult, coursesResult, schemesResult] = await Promise.all([
      pool.query(
        `SELECT j.*, o.org_name, o.logo_url, 'job' as type
         FROM jobs j
         LEFT JOIN organizations o ON o.id = j.org_id
         WHERE j.is_active = TRUE
         ORDER BY j.created_at DESC
         LIMIT 50`
      ),
      pool.query(
        `SELECT c.*, o.org_name, o.logo_url, 'course' as type
         FROM courses c
         LEFT JOIN organizations o ON o.id = c.org_id
         WHERE c.is_active = TRUE
         ORDER BY c.created_at DESC
         LIMIT 50`
      ),
      pool.query(
        `SELECT *, 'scheme' as type FROM schemes
         WHERE is_active = TRUE
         ORDER BY created_at DESC
         LIMIT 30`
      ),
    ]);

    // Score & rank
    const scoredJobs = jobsResult.rows
      .map(job => ({ ...job, score: scoreJob(job, profile) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    const scoredCourses = coursesResult.rows
      .map(course => ({ ...course, score: scoreCourse(course, profile) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    const scoredSchemes = schemesResult.rows
      .map(scheme => ({ ...scheme, score: scoreScheme(scheme, profile) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Compute profile completeness
    const completenessFields = {
      name:       !!(profile.name),
      state:      !!(profile.state),
      district:   !!(profile.district),
      education:  !!(profile.education),
      experience: !!(profile.work_experience),
      skills:     Array.isArray(profile.skills) && profile.skills.length > 0,
      interests:  Array.isArray(profile.interests) && profile.interests.length > 0,
      language:   Array.isArray(profile.languages_known) && profile.languages_known.length > 0,
    };
    const completedCount = Object.values(completenessFields).filter(Boolean).length;
    const profile_completeness = Math.round((completedCount / Object.keys(completenessFields).length) * 100);

    // Build match reasons for UI
    const jobsWithReasons = scoredJobs.map(j => ({
      ...j,
      match_reason: buildJobMatchReason(j, profile),
    }));
    const coursesWithReasons = scoredCourses.map(c => ({
      ...c,
      match_reason: buildCourseMatchReason(c, profile),
    }));

    res.json({
      success: true,
      data: {
        jobs:    jobsWithReasons,
        courses: coursesWithReasons,
        schemes: scoredSchemes,
        profile_completeness,
        profile_tips: buildProfileTips(completenessFields),
        has_profile: completedCount >= 3,
      }
    });
  } catch (err) {
    console.error('Recommendations error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

function buildJobMatchReason(job, profile) {
  const reasons = [];
  const userSkills = (profile.skills || []).map(s => s.toLowerCase());
  const jobSkills  = (job.skills_required || []).map(s => s.toLowerCase());
  const matched    = userSkills.filter(s => jobSkills.some(js => js.includes(s) || s.includes(js)));
  if (matched.length > 0) reasons.push(`Matches your skills: ${matched.slice(0,2).join(', ')}`);
  if (job.work_mode === 'remote') reasons.push('Work from home');
  else if (job.location_state && profile.state && job.location_state.toLowerCase() === profile.state.toLowerCase()) reasons.push(`Near you (${job.location_district || job.location_state})`);
  if (job.is_free !== undefined && job.salary_min) reasons.push(`₹${job.salary_min.toLocaleString()}+/mo`);
  return reasons.slice(0, 2).join(' · ') || 'Recommended for you';
}

function buildCourseMatchReason(course, profile) {
  const reasons = [];
  if (course.is_free) reasons.push('Free course');
  if (course.certification) reasons.push('Get certified');
  if (course.mode === 'online') reasons.push('Learn online');
  const courseLangs = (course.language || []).map(l => l.toLowerCase());
  const userLang    = (profile.language_pref || 'en');
  const langMap     = { hi:'Hindi', mr:'Marathi', en:'English', te:'Telugu', ta:'Tamil', kn:'Kannada' };
  if (courseLangs.includes((langMap[userLang]||'').toLowerCase())) reasons.push(`Available in ${langMap[userLang]}`);
  return reasons.slice(0, 2).join(' · ') || 'Recommended for you';
}

function buildProfileTips(fields) {
  const tips = [];
  if (!fields.skills)     tips.push('Add your skills to get better job matches');
  if (!fields.interests)  tips.push('Add your interests to discover relevant courses');
  if (!fields.district)   tips.push('Add your district to find nearby opportunities');
  if (!fields.education)  tips.push('Add your education level for accurate recommendations');
  return tips.slice(0, 2);
}

/**
 * GET /api/recommendations/jobs — standalone job recommendations endpoint
 */
exports.getJobRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 8 } = req.query;

    const profileResult = await pool.query(
      `SELECT u.state, u.district, p.skills, p.interests, p.education, p.languages_known
       FROM users u LEFT JOIN user_profiles p ON p.user_id = u.id WHERE u.id = $1`,
      [userId]
    );
    const profile = profileResult.rows[0] || {};

    const jobsResult = await pool.query(
      `SELECT j.*, o.org_name, o.logo_url FROM jobs j
       LEFT JOIN organizations o ON o.id = j.org_id
       WHERE j.is_active = TRUE ORDER BY j.created_at DESC LIMIT 100`
    );

    const ranked = jobsResult.rows
      .map(j => ({ ...j, score: scoreJob(j, profile), match_reason: buildJobMatchReason(j, profile) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, parseInt(limit));

    res.json({ success: true, data: ranked, total: ranked.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/recommendations/courses — standalone course recommendations endpoint
 */
exports.getCourseRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 8 } = req.query;

    const profileResult = await pool.query(
      `SELECT u.state, u.district, u.language_pref, p.skills, p.interests, p.education, p.languages_known
       FROM users u LEFT JOIN user_profiles p ON p.user_id = u.id WHERE u.id = $1`,
      [userId]
    );
    const profile = profileResult.rows[0] || {};

    const coursesResult = await pool.query(
      `SELECT c.*, o.org_name, o.logo_url FROM courses c
       LEFT JOIN organizations o ON o.id = c.org_id
       WHERE c.is_active = TRUE ORDER BY c.created_at DESC LIMIT 100`
    );

    const ranked = coursesResult.rows
      .map(c => ({ ...c, score: scoreCourse(c, profile), match_reason: buildCourseMatchReason(c, profile) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, parseInt(limit));

    res.json({ success: true, data: ranked, total: ranked.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/recommendations/feedback — record implicit feedback (click / apply)
 * Used to improve recommendations over time (stored for future ML training)
 */
exports.recordFeedback = async (req, res) => {
  try {
    const { entity_id, entity_type, action } = req.body; // action: 'view'|'apply'|'bookmark'|'dismiss'
    // Store feedback (create table if needed via migration)
    await pool.query(
      `INSERT INTO recommendation_feedback (user_id, entity_id, entity_type, action)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, entity_id, entity_type) DO UPDATE SET action = $4, updated_at = NOW()`,
      [req.user.id, entity_id, entity_type, action]
    ).catch(() => {}); // silently ignore if table doesn't exist yet
    res.json({ success: true });
  } catch (err) {
    res.json({ success: true }); // non-critical, don't fail
  }
};
