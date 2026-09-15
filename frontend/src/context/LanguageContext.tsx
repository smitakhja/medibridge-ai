import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../types';

interface Translations {
  [key: string]: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appName: 'MediBridge AI',
    tagline: 'Intelligent Early Health Risk & Care Navigation System',
    hero_title: 'Intelligent Early Health Risk & Care Navigation',
    hero_sub: 'From symptom reporting to intelligent care navigation — before the condition becomes critical.',
    check_health: 'Check My Health Risk',
    explore: 'Explore MediBridge AI',
    login: 'Login',
    register: 'Create Account',
    dashboard: 'Dashboard',
    health_check: 'Health Check',
    reports: 'Reports',
    nearby_care: 'Nearby Care',
    history: 'Health History',
    profile: 'Profile',
    logout: 'Logout',
    risk_low: 'Low Risk',
    risk_moderate: 'Moderate Risk',
    risk_high: 'High Risk',
    risk_urgent: 'Emergency',
    disclaimer: 'This AI assessment provides risk indicators for informational purposes only. It is NOT a medical diagnosis. Always consult a qualified healthcare professional.',
    analyze: 'Analyze My Health',
    step_symptoms: 'Symptoms',
    step_lifestyle: 'Lifestyle',
    step_history: 'Medical History',
    step_basics: 'Basic Info',
    emergency_title: 'Potential Emergency Detected',
    find_hospital: 'Find Nearest Hospital',
    call_emergency: 'Call Emergency Services',
    loading: 'Loading...',
    no_data: 'No data available',
  },
  hi: {
    appName: 'मेडीब्रिज AI',
    tagline: 'बुद्धिमान स्वास्थ्य जोखिम और देखभाल नेविगेशन प्रणाली',
    hero_title: 'बुद्धिमान स्वास्थ्य जोखिम और देखभाल नेविगेशन',
    hero_sub: 'लक्षण रिपोर्टिंग से बुद्धिमान देखभाल नेविगेशन तक — स्थिति गंभीर होने से पहले।',
    check_health: 'मेरा स्वास्थ्य जोखिम जांचें',
    explore: 'मेडीब्रिज AI एक्सप्लोर करें',
    login: 'लॉगिन',
    register: 'अकाउंट बनाएं',
    dashboard: 'डैशबोर्ड',
    health_check: 'स्वास्थ्य जांच',
    reports: 'रिपोर्ट',
    nearby_care: 'पास की देखभाल',
    history: 'स्वास्थ्य इतिहास',
    profile: 'प्रोफाइल',
    logout: 'लॉगआउट',
    risk_low: 'कम जोखिम',
    risk_moderate: 'मध्यम जोखिम',
    risk_high: 'उच्च जोखिम',
    risk_urgent: 'आपातकाल',
    disclaimer: 'यह AI मूल्यांकन केवल सूचनात्मक उद्देश्यों के लिए जोखिम संकेतक प्रदान करता है। यह चिकित्सा निदान नहीं है।',
    analyze: 'मेरे स्वास्थ्य का विश्लेषण करें',
    step_symptoms: 'लक्षण',
    step_lifestyle: 'जीवनशैली',
    step_history: 'चिकित्सा इतिहास',
    step_basics: 'बुनियादी जानकारी',
    emergency_title: 'संभावित आपातकाल का पता चला',
    find_hospital: 'निकटतम अस्पताल खोजें',
    call_emergency: 'आपातकालीन सेवाएं कॉल करें',
    loading: 'लोड हो रहा है...',
    no_data: 'कोई डेटा उपलब्ध नहीं',
  },
  gu: {
    appName: 'મેડીબ્રિજ AI',
    tagline: 'બુદ્ધિશાળી આરોગ્ય જોખમ અને સંભાળ નેવિગેશન સિસ્ટમ',
    hero_title: 'બુદ્ધિશાળી આરોગ્ય જોખમ અને સંભાળ નેવિગેશન',
    hero_sub: 'લક્ષણ રિપોર્ટિંગથી બુદ્ધિશાળી સંભાળ નેવિગેશન — સ્થિતિ ગંભીર બને તે પહેલાં.',
    check_health: 'મારું સ્વાસ્થ્ય જોખમ તપાસો',
    explore: 'મેડીબ્રિજ AI એક્સ્પ્લોર કરો',
    login: 'લૉગિન',
    register: 'એકાઉન્ટ બનાવો',
    dashboard: 'ડૅશબૉર્ડ',
    health_check: 'આરોગ્ય તપાસ',
    reports: 'અહેવાલો',
    nearby_care: 'નજીકની સંભાળ',
    history: 'આરોગ્ય ઇતિહાસ',
    profile: 'પ્રોફાઇલ',
    logout: 'લૉગઆઉટ',
    risk_low: 'ઓછું જોખમ',
    risk_moderate: 'મધ્યમ જોખમ',
    risk_high: 'ઉચ્ચ જોખમ',
    risk_urgent: 'કટોકટી',
    disclaimer: 'આ AI મૂલ્યાંકન માત્ર માહિતીના હેતુ માટે જોખમ સૂચકો પ્રદાન કરે છે. તે તબીબી નિદાન નથી.',
    analyze: 'મારા આરોગ્યનું વિશ્લેષણ કરો',
    step_symptoms: 'લક્ષણો',
    step_lifestyle: 'જીવનશૈલી',
    step_history: 'તબીબી ઇતિહાસ',
    step_basics: 'મૂળભૂત માહિતી',
    emergency_title: 'સંભવિત કટોકટી શોધી',
    find_hospital: 'નજીકની હૉસ્પિટલ શોધો',
    call_emergency: 'ઇમર્જન્સી સેવાઓ કૉલ કરો',
    loading: 'લોડ થઈ રહ્યું છે...',
    no_data: 'કોઈ ડેટા ઉપલબ્ધ નથી',
  },
  mr: {
    appName: 'मेडीब्रिज AI',
    tagline: 'बुद्धिमान आरोग्य जोखीम आणि काळजी नेव्हिगेशन प्रणाली',
    hero_title: 'बुद्धिमान आरोग्य जोखीम आणि काळजी नेव्हिगेशन',
    hero_sub: 'लक्षण नोंदणीपासून बुद्धिमान काळजी नेव्हिगेशनपर्यंत — स्थिती गंभीर होण्यापूर्वी.',
    check_health: 'माझे आरोग्य धोका तपासा',
    explore: 'मेडीब्रिज AI एक्सप्लोर करा',
    login: 'लॉगिन',
    register: 'खाते तयार करा',
    dashboard: 'डॅशबोर्ड',
    health_check: 'आरोग्य तपासणी',
    reports: 'अहवाल',
    nearby_care: 'जवळची काळजी',
    history: 'आरोग्य इतिहास',
    profile: 'प्रोफाइल',
    logout: 'लॉगआउट',
    risk_low: 'कमी जोखीम',
    risk_moderate: 'मध्यम जोखीम',
    risk_high: 'उच्च जोखीम',
    risk_urgent: 'आपत्कालीन',
    disclaimer: 'हे AI मूल्यांकन केवळ माहितीच्या उद्देशाने जोखीम निर्देशक प्रदान करते. हे वैद्यकीय निदान नाही.',
    analyze: 'माझ्या आरोग्याचे विश्लेषण करा',
    step_symptoms: 'लक्षणे',
    step_lifestyle: 'जीवनशैली',
    step_history: 'वैद्यकीय इतिहास',
    step_basics: 'मूलभूत माहिती',
    emergency_title: 'संभाव्य आपत्कालीन परिस्थिती आढळली',
    find_hospital: 'जवळचे रुग्णालय शोधा',
    call_emergency: 'आपत्कालीन सेवा कॉल करा',
    loading: 'लोड होत आहे...',
    no_data: 'कोणताही डेटा उपलब्ध नाही',
  },
  bn: {
    appName: 'মেডিব্রিজ AI',
    tagline: 'বুদ্ধিমান স্বাস্থ্য ঝুঁকি ও যত্ন নেভিগেশন সিস্টেম',
    hero_title: 'বুদ্ধিমান স্বাস্থ্য ঝুঁকি ও যত্ন নেভিগেশন',
    hero_sub: 'উপসর্গ রিপোর্টিং থেকে বুদ্ধিমান যত্ন নেভিগেশন — অবস্থা জটিল হওয়ার আগে।',
    check_health: 'আমার স্বাস্থ্য ঝুঁকি পরীক্ষা করুন',
    explore: 'মেডিব্রিজ AI অন্বেষণ করুন',
    login: 'লগইন',
    register: 'অ্যাকাউন্ট তৈরি করুন',
    dashboard: 'ড্যাশবোর্ড',
    health_check: 'স্বাস্থ্য পরীক্ষা',
    reports: 'রিপোর্ট',
    nearby_care: 'কাছের যত্ন',
    history: 'স্বাস্থ্য ইতিহাস',
    profile: 'প্রোফাইল',
    logout: 'লগআউট',
    risk_low: 'কম ঝুঁকি',
    risk_moderate: 'মাঝারি ঝুঁকি',
    risk_high: 'উচ্চ ঝুঁকি',
    risk_urgent: 'জরুরি',
    disclaimer: 'এই AI মূল্যায়ন শুধুমাত্র তথ্যের উদ্দেশ্যে ঝুঁকি সূচক প্রদান করে। এটি চিকিৎসা নির্ণয় নয়।',
    analyze: 'আমার স্বাস্থ্য বিশ্লেষণ করুন',
    step_symptoms: 'উপসর্গ',
    step_lifestyle: 'জীবনধারা',
    step_history: 'চিকিৎসা ইতিহাস',
    step_basics: 'মৌলিক তথ্য',
    emergency_title: 'সম্ভাব্য জরুরি পরিস্থিতি সনাক্ত',
    find_hospital: 'নিকটতম হাসপাতাল খুঁজুন',
    call_emergency: 'জরুরি সেবায় ফোন করুন',
    loading: 'লোড হচ্ছে...',
    no_data: 'কোন তথ্য উপলব্ধ নেই',
  },
  ta: {
    appName: 'மெடிப்ரிட்ஜ் AI',
    tagline: 'அறிவார்ந்த ஆரோக்கிய ஆபத்து மற்றும் பராமரிப்பு வழிகாட்டல் அமைப்பு',
    hero_title: 'அறிவார்ந்த ஆரோக்கிய ஆபத்து மற்றும் பராமரிப்பு வழிகாட்டல்',
    hero_sub: 'அறிகுறி அறிக்கையிடலில் இருந்து அறிவார்ந்த பராமரிப்பு வழிகாட்டல் வரை.',
    check_health: 'என் ஆரோக்கிய ஆபத்தை சரிபார்க்கவும்',
    explore: 'மெடிப்ரிட்ஜ் AI ஐ ஆராயுங்கள்',
    login: 'உள்நுழைவு',
    register: 'கணக்கு உருவாக்கு',
    dashboard: 'டாஷ்போர்டு',
    health_check: 'ஆரோக்கிய சோதனை',
    reports: 'அறிக்கைகள்',
    nearby_care: 'அருகிலுள்ள பராமரிப்பு',
    history: 'ஆரோக்கிய வரலாறு',
    profile: 'சுயவிவரம்',
    logout: 'வெளியேறு',
    risk_low: 'குறைந்த ஆபத்து',
    risk_moderate: 'மிதமான ஆபத்து',
    risk_high: 'அதிக ஆபத்து',
    risk_urgent: 'அவசரநிலை',
    disclaimer: 'இந்த AI மதிப்பீடு தகவல் நோக்கங்களுக்கு மட்டுமே ஆபத்து குறிகாட்டிகளை வழங்குகிறது. இது மருத்துவ கண்டறிதல் அல்ல.',
    analyze: 'என் ஆரோக்கியத்தை பகுப்பாய்வு செய்யுங்கள்',
    step_symptoms: 'அறிகுறிகள்',
    step_lifestyle: 'வாழ்க்கை முறை',
    step_history: 'மருத்துவ வரலாறு',
    step_basics: 'அடிப்படை தகவல்',
    emergency_title: 'சாத்தியமான அவசரநிலை கண்டறியப்பட்டது',
    find_hospital: 'அருகிலுள்ள மருத்துவமனையைக் கண்டறியுங்கள்',
    call_emergency: 'அவசர சேவைகளை அழைக்கவும்',
    loading: 'ஏற்றுகிறது...',
    no_data: 'தரவு கிடைக்கவில்லை',
  },
  te: {
    appName: 'మెడిబ్రిడ్జ్ AI',
    tagline: 'తెలివైన ఆరోగ్య ప్రమాద మరియు సంరక్షణ నావిగేషన్ వ్యవస్థ',
    hero_title: 'తెలివైన ఆరోగ్య ప్రమాద మరియు సంరక్షణ నావిగేషన్',
    hero_sub: 'లక్షణ నివేదికల నుండి తెలివైన సంరక్షణ నావిగేషన్ వరకు — పరిస్థితి తీవ్రమవ్వడానికి ముందే.',
    check_health: 'నా ఆరోగ్య ప్రమాదాన్ని తనిఖీ చేయండి',
    explore: 'మెడిబ్రిడ్జ్ AI అన్వేషించండి',
    login: 'లాగిన్',
    register: 'ఖాతా సృష్టించండి',
    dashboard: 'డాష్‌బోర్డ్',
    health_check: 'ఆరోగ్య తనిఖీ',
    reports: 'నివేదికలు',
    nearby_care: 'సమీప సంరక్షణ',
    history: 'ఆరోగ్య చరిత్ర',
    profile: 'ప్రొఫైల్',
    logout: 'లాగ్అవుట్',
    risk_low: 'తక్కువ ప్రమాదం',
    risk_moderate: 'మధ్యస్థ ప్రమాదం',
    risk_high: 'అధిక ప్రమాదం',
    risk_urgent: 'అత్యవసర',
    disclaimer: 'ఈ AI మూల్యాంకనం సమాచార ప్రయోజనాల కోసం మాత్రమే ప్రమాద సూచికలను అందిస్తుంది. ఇది వైద్య నిర్ధారణ కాదు.',
    analyze: 'నా ఆరోగ్యాన్ని విశ్లేషించండి',
    step_symptoms: 'లక్షణాలు',
    step_lifestyle: 'జీవనశైలి',
    step_history: 'వైద్య చరిత్ర',
    step_basics: 'ప్రాథమిక సమాచారం',
    emergency_title: 'సంభావ్య అత్యవసర పరిస్థితి గుర్తించబడింది',
    find_hospital: 'సమీప ఆసుపత్రిని కనుగొనండి',
    call_emergency: 'అత్యవసర సేవలను కాల్ చేయండి',
    loading: 'లోడ్ అవుతోంది...',
    no_data: 'డేటా అందుబాటులో లేదు',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: { code: Language; name: string; nativeName: string }[];
}

const LanguageContext = React.createContext<LanguageContextType | null>(null);

const LANGUAGES = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'gu' as Language, name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'mr' as Language, name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn' as Language, name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta' as Language, name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te' as Language, name: 'Telugu', nativeName: 'తెలుగు' },
];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(
    (localStorage.getItem('medibridge_lang') as Language) || 'en'
  );

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('medibridge_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
