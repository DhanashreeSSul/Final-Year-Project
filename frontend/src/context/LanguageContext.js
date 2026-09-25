import React, { createContext, useContext, useState, useEffect } from 'react';

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', greeting: 'Hello' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', greeting: 'नमस्ते' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', greeting: 'नमस्कार' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', greeting: 'வணக்கம்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', greeting: 'నమస్కారం' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', greeting: 'ನಮಸ್ಕಾರ' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', greeting: 'নমস্কার' }
];

const TRANSLATIONS = {
  en: {
    appName: 'Shakti Platform',
    tagline: 'Secured AI-Enabled Platform for Digital Literacy and Career Empowerment',
    home: 'Home',
    opportunities: 'Opportunities',
    jobs: 'Jobs',
    courses: 'Training',
    schemes: 'Govt Schemes',
    chat: 'AI Guide',
    roadmap: 'Career Roadmap',
    entrepreneurship: 'Business',
    dashboard: 'Dashboard',
    profile: 'Profile',
    applications: 'Applications',
    saved: 'Saved',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    settings: 'Settings',
    getStarted: 'Get Started',
    exploreOpportunities: 'Explore Opportunities',
    forFoundations: 'For Foundations & NGOs',
    registerFoundation: 'Register as Foundation',
    continueAsWoman: 'Continue as Woman',
    continueAsFoundation: 'Continue as Foundation',
    searchJobs: 'Search jobs, skills, or locations...',
    applyNow: 'Apply Now',
    enrollNow: 'Enroll Now',
    checkEligibility: 'Check Eligibility',
    whyMatches: 'Why this matches you',
    matchScore: 'Match Score',
    offlineNotice: 'You are currently offline. Cached opportunities are available.'
  },
  hi: {
    appName: 'शक्ति प्लेटफॉर्म',
    tagline: 'ग्रामीण महिलाओं के लिए डिजिटल साक्षरता और करियर सशक्तिकरण मंच',
    home: 'होम',
    opportunities: 'अवसर',
    jobs: 'नौकरियां',
    courses: 'प्रशिक्षण',
    schemes: 'सरकारी योजनाएं',
    chat: 'एआई मार्गदर्शक',
    roadmap: 'करियर रोडमैप',
    entrepreneurship: 'व्यवसाय',
    dashboard: 'डैशबोर्ड',
    profile: 'मेरी प्रोफाइल',
    applications: 'आवेदन',
    saved: 'सहेजे गए',
    login: 'लॉग इन',
    register: 'पंजीकरण',
    logout: 'लॉग आउट',
    settings: 'सेटिंग्स',
    getStarted: 'शुरुआत करें',
    exploreOpportunities: 'अवसर देखें',
    forFoundations: 'संस्थाओं और एनजीओ के लिए',
    registerFoundation: 'संस्था के रूप में जुड़ें',
    continueAsWoman: 'महिला के रूप में जारी रखें',
    continueAsFoundation: 'संस्था के रूप में जारी रखें',
    searchJobs: 'नौकरियां, कौशल या स्थान खोजें...',
    applyNow: 'आवेदन करें',
    enrollNow: 'दाखिला लें',
    checkEligibility: 'पात्रता जांचें',
    whyMatches: 'यह आपके लिए उपयुक्त क्यों है',
    matchScore: 'मैच स्कोर',
    offlineNotice: 'आप अभी ऑफ़लाइन हैं। सहेजे गए अवसर उपलब्ध हैं।'
  },
  mr: {
    appName: 'शक्ती प्लॅटफॉर्म',
    tagline: 'ग्रामीण महिलांसाठी डिजिटल साक्षरता आणि करिअर सक्षमीकरण',
    home: 'मुख्यपृष्ठ',
    opportunities: 'संधी',
    jobs: 'नोकऱ्या',
    courses: 'प्रशिक्षण',
    schemes: 'शासकीय योजना',
    chat: 'एआय मार्गदर्शक',
    roadmap: 'करिअर रोडमॅप',
    entrepreneurship: 'उद्योग',
    dashboard: 'डॅशबोर्ड',
    profile: 'माझे प्रोफाइल',
    applications: 'माझे अर्ज',
    saved: 'जतन केलेले',
    login: 'लॉगिन',
    register: 'नोंदणी',
    logout: 'लॉगआउट',
    settings: 'सेटिंग्ज',
    getStarted: 'सुरुवात करा',
    exploreOpportunities: 'संधी शोधा',
    forFoundations: 'संस्था व एनजीओसाठी',
    registerFoundation: 'संस्था म्हणून नोंदणी करा',
    continueAsWoman: 'महिला म्हणून पुढे जा',
    continueAsFoundation: 'संस्था म्हणून पुढे जा',
    searchJobs: 'नोकऱ्या, कौशल्ये किंवा ठिकाण शोधा...',
    applyNow: 'अर्ज करा',
    enrollNow: 'प्रवेश घ्या',
    checkEligibility: 'पात्रता तपासा',
    whyMatches: 'हे तुमच्यासाठी योग्य का आहे',
    matchScore: 'मॅच स्कोअर',
    offlineNotice: 'तुम्ही सध्या ऑफलाइन आहात. जतन केलेल्या संधी उपलब्ध आहेत.'
  },
  ta: {
    appName: 'சக்தி தளம்',
    tagline: 'கிராமப்புற பெண்களுக்கான டிஜிட்டல் கல்வி மற்றும் தொழில் முன்னேற்றம்',
    home: 'முகப்பு',
    opportunities: 'வாய்ப்புகள்',
    jobs: 'வேலைகள்',
    courses: 'பயிற்சி',
    schemes: 'அரசு திட்டங்கள்',
    chat: 'AI வழிகாட்டி',
    roadmap: 'தொழில் பாதை',
    entrepreneurship: 'சுயதொழில்',
    dashboard: 'டாஷ்போர்டு',
    profile: 'என் சுயவிவரம்',
    applications: 'விண்ணப்பங்கள்',
    saved: 'சேமிக்கப்பட்டவை',
    login: 'உள்நுழைக',
    register: 'பதிவு செய்க',
    logout: 'வெளியேறு',
    settings: 'அமைப்புகள்',
    getStarted: 'தொடங்குங்கள்',
    exploreOpportunities: 'வாய்ப்புகளை காண்க',
    forFoundations: 'அறக்கட்டளைகள் மற்றும் தொண்டு நிறுவனங்களுக்கு',
    registerFoundation: 'நிறுவனமாக பதிவு செய்க',
    continueAsWoman: 'பெண்ணாக தொடரவும்',
    continueAsFoundation: 'நிறுவனமாக தொடரவும்',
    searchJobs: 'வேலை அல்லது திறன்களை தேடுங்கள்...',
    applyNow: 'விண்ணப்பிக்கவும்',
    enrollNow: 'சேரவும்',
    checkEligibility: 'தகுதியை சரிபார்க்கவும்',
    whyMatches: 'இது உங்களுக்கு ஏன் பொருந்துகிறது',
    matchScore: 'பொருத்தம்',
    offlineNotice: 'நீங்கள் தற்போது ஆஃப்லைனில் உள்ளீர்கள்.'
  },
  te: {
    appName: 'శక్తి ప్లాట్‌ఫారమ్',
    tagline: 'గ్రామీణ మహిళల కోసం డిజిటల్ అక్షరాస్యత మరియు కెరీర్ సాధికారత',
    home: 'హోమ్',
    opportunities: 'అవకాశాలు',
    jobs: 'ఉద్యోగాలు',
    courses: 'శిక్షణ',
    schemes: 'ప్రభుత్వ పథకాలు',
    chat: 'AI గైడ్',
    roadmap: 'కెరీర్ రోడ్‌మ్యాప్',
    entrepreneurship: 'వ్యాపారం',
    dashboard: 'డాష్‌బోర్డ్',
    profile: 'నా ప్రొఫైల్',
    applications: 'దరఖాస్తులు',
    saved: 'సేవ్ చేసినవి',
    login: 'లాగిన్',
    register: 'రిజిస్టర్',
    logout: 'లాగౌట్',
    settings: 'సెట్టింగ్‌లు',
    getStarted: 'ప్రారంభించండి',
    exploreOpportunities: 'అవకాశాలను అన్వేషించండి',
    forFoundations: 'సంస్థలు మరియు స్వచ్ఛంద సంస్థల కోసం',
    registerFoundation: 'సంస్థగా నమోదు చేయండి',
    continueAsWoman: 'మహిళగా కొనసాగండి',
    continueAsFoundation: 'సంస్థగా కొనసాగండి',
    searchJobs: 'ఉద్యోగాలు, నైపుణ్యాలు శోధించండి...',
    applyNow: 'దరఖాస్తు చేసుకోండి',
    enrollNow: 'చేరండి',
    checkEligibility: 'అర్హత తనిఖీ చేయండి',
    whyMatches: 'ఇది మీకు ఎందుకు సరిపోతుంది',
    matchScore: 'మ్యాచ్ స్కోర్',
    offlineNotice: 'మీరు ప్రస్తుతం ఆఫ్‌లైన్‌లో ఉన్నారు.'
  },
  kn: {
    appName: 'ಶಕ್ತಿ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್',
    tagline: 'ಗ್ರಾಮೀಣ ಮಹಿಳೆಯರ ಡಿಜಿಟಲ್ ಸಾಕ್ಷರತೆ ಮತ್ತು ವೃತ್ತಿ ಸಬಲೀಕರಣ',
    home: 'ಮುಖಪುಟ',
    opportunities: 'ಅವಕಾಶಗಳು',
    jobs: 'ಉದ್ಯೋಗಗಳು',
    courses: 'ತರಬೇತಿ',
    schemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
    chat: 'AI ಮಾರ್ಗದರ್ಶಿ',
    roadmap: 'ವೃತ್ತಿ ಮಾರ್ಗಸೂಚಿ',
    entrepreneurship: 'ವ್ಯವಹಾರ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    profile: 'ನನ್ನ ಪ್ರೊಫೈಲ್',
    applications: 'ಅರ್ಜಿಗಳು',
    saved: 'ಉಳಿಸಿದವು',
    login: 'ಲಾಗಿನ್',
    register: 'ನೋಂದಣಿ',
    logout: 'ಲಾಗೌಟ್',
    settings: 'ಸೆಟ್ಟಿಂಗ್ಸ್',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    exploreOpportunities: 'ಅವಕಾಶಗಳನ್ನು ನೋಡಿ',
    forFoundations: 'ಸಂಸ್ಥೆಗಳು ಮತ್ತು ಎನ್‌ಜಿಒಗಳಿಗೆ',
    registerFoundation: 'ಸಂಸ್ಥೆಯಾಗಿ ನೋಂದಾಯಿಸಿ',
    continueAsWoman: 'ಮಹಿಳೆಯಾಗಿ ಮುಂದುವರಿಯಿರಿ',
    continueAsFoundation: 'ಸಂಸ್ಥೆಯಾಗಿ ಮುಂದುವರಿಯಿರಿ',
    searchJobs: 'ಉದ್ಯೋಗಗಳನ್ನು ಹುಡುಕಿ...',
    applyNow: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    enrollNow: 'ದಾಖಲಾಗಿ',
    checkEligibility: 'ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ',
    whyMatches: 'ಇದು ನಿಮಗೆ ಏಕೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ',
    matchScore: 'ಹೊಂದಾಣಿಕೆ',
    offlineNotice: 'ನೀವು ಪ್ರಸ್ತುತ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದೀರಿ.'
  },
  bn: {
    appName: 'শক্তি প্ল্যাটফর্ম',
    tagline: 'গ্রামীণ নারীদের জন্য ডিজিটাল সাক্ষরতা ও কর্মসংস্থান ক্ষমতায়ন',
    home: 'হোম',
    opportunities: 'সুযোগ',
    jobs: 'চাকরি',
    courses: 'প্রশিক্ষণ',
    schemes: 'সরকারি প্রকল্প',
    chat: 'এআই গাইড',
    roadmap: 'ক্যারিয়ার রোডম্যাপ',
    entrepreneurship: 'ব্যবসা',
    dashboard: 'ড্যাশবোর্ড',
    profile: 'প্রোফাইল',
    applications: 'আবেদনপত্র',
    saved: 'সংরক্ষিত',
    login: 'লগইন',
    register: 'নিবন্ধন',
    logout: 'লগআউট',
    settings: 'সেটিংস',
    getStarted: 'শুরু করুন',
    exploreOpportunities: 'সুযোগ সন্ধান করুন',
    forFoundations: 'ফাউন্ডেশন ও এনজিওদের জন্য',
    registerFoundation: 'ফাউন্ডেশন হিসেবে যুক্ত হোন',
    continueAsWoman: 'নারী হিসেবে এগিয়ে যান',
    continueAsFoundation: 'ফাউন্ডেশন হিসেবে এগিয়ে যান',
    searchJobs: 'চাকরি বা দক্ষতা খুঁজুন...',
    applyNow: 'আবেদন করুন',
    enrollNow: 'ভর্তি হোন',
    checkEligibility: 'যোগ্যতা যাচাই করুন',
    whyMatches: 'কেন এটি আপনার জন্য উপযুক্ত',
    matchScore: 'ম্যাচ স্কোর',
    offlineNotice: 'আপনি বর্তমানে অফলাইনে আছেন।'
  }
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('shakti_lang') || 'en';
  });

  const [showLanguageModal, setShowLanguageModal] = useState(() => {
    return !localStorage.getItem('shakti_lang_selected');
  });

  const setLanguage = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem('shakti_lang', langCode);
    localStorage.setItem('shakti_lang_selected', 'true');
    setShowLanguageModal(false);
  };

  const t = (key) => {
    const langDict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  const currentLangObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{
      currentLang,
      currentLangObj,
      setLanguage,
      t,
      languages: LANGUAGES,
      showLanguageModal,
      setShowLanguageModal
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
