// Client-side risk engine for demo mode (no backend needed)
// DISCLAIMER: NOT a medical diagnosis — risk indicators only

const HIGH_RISK_SYMPTOMS = ['chest pain', 'chest discomfort', 'difficulty breathing', 'shortness of breath', 'heart attack', 'unconscious', 'severe bleeding', 'seizure', 'severe headache', 'sudden vision loss', 'paralysis', 'fainting'];
const MODERATE_SYMPTOMS = ['fever', 'persistent cough', 'abdominal pain', 'vomiting', 'diarrhea', 'joint pain', 'back pain', 'rash', 'swelling', 'dizziness', 'headache', 'fatigue', 'palpitations', 'irregular heartbeat'];
const LOW_RISK_SYMPTOMS = ['mild cold', 'runny nose', 'sore throat', 'mild cough', 'mild headache', 'mild fever', 'muscle ache', 'tiredness', 'stress', 'anxiety', 'insomnia'];

interface RiskInput {
  symptoms?: string[];
  symptomsText?: string;
  lifestyle?: Record<string, unknown>;
  medicalHistory?: Record<string, unknown>;
  basicInfo?: Record<string, unknown>;
}

export function calculateDemoRisk(input: RiskInput) {
  const { symptoms = [], symptomsText = '', lifestyle = {}, medicalHistory = {}, basicInfo = {} } = input;
  const allText = [...symptoms, symptomsText].join(' ').toLowerCase();

  let score = 0;
  const riskFactors: string[] = [];
  const warningSigns: string[] = [];
  const homecareTips: string[] = [];
  const lifestyleTips: string[] = [];
  const doctorQuestions: string[] = [];

  const foundHigh = HIGH_RISK_SYMPTOMS.filter(s => allText.includes(s));
  const foundModerate = MODERATE_SYMPTOMS.filter(s => allText.includes(s));
  const foundLow = LOW_RISK_SYMPTOMS.filter(s => allText.includes(s));

  if (foundHigh.length > 0) {
    score += Math.min(60 + foundHigh.length * 10, 85);
    riskFactors.push(...foundHigh.map(s => `High-risk symptom: ${s}`));
    warningSigns.push('Seek emergency medical care immediately if symptoms are severe or worsening.');
  } else if (foundModerate.length > 0) {
    score += Math.min(foundModerate.length * 8, 45);
    riskFactors.push(...foundModerate.map(s => `Symptom: ${s}`));
    doctorQuestions.push('How do my current symptoms relate to my medical history?');
    doctorQuestions.push('What tests should I have done?');
  } else if (foundLow.length > 0) {
    score += Math.min(foundLow.length * 3, 20);
  } else if (symptoms.length === 0 && !symptomsText) {
    // No symptoms entered — low risk demo
    score = 15;
    homecareTips.push('Stay hydrated with 8–10 glasses of water daily.', 'Get 7–8 hours of quality sleep.', 'Exercise for 30 minutes daily.');
  }

  // Age risk
  const age = Number((basicInfo as Record<string, unknown>).age || 0);
  if (age > 65) { score += 10; riskFactors.push('Age over 65'); }
  else if (age > 50) { score += 5; }

  // BMI
  const h = Number((basicInfo as Record<string, unknown>).height || 0);
  const w = Number((basicInfo as Record<string, unknown>).weight || 0);
  if (h > 0 && w > 0) {
    const bmi = w / ((h / 100) ** 2);
    if (bmi > 30) { score += 8; riskFactors.push(`Obesity (BMI: ${bmi.toFixed(1)})`); }
    else if (bmi < 18.5) { score += 4; riskFactors.push(`Underweight (BMI: ${bmi.toFixed(1)})`); }
  }

  // Lifestyle
  if ((lifestyle as Record<string, unknown>).smoking) { score += 8; riskFactors.push('Smoking'); lifestyleTips.push('Consider a smoking cessation program.'); }
  if ((lifestyle as Record<string, unknown>).alcohol === 'heavy') { score += 6; riskFactors.push('Heavy alcohol consumption'); }
  if (Number((lifestyle as Record<string, unknown>).stressLevel) >= 8) { score += 5; riskFactors.push('Very high stress'); lifestyleTips.push('Try mindfulness or yoga for stress management.'); }
  if ((lifestyle as Record<string, unknown>).exercise === 'never') { score += 4; lifestyleTips.push('Start with 20-minute walks daily.'); }
  if ((lifestyle as Record<string, unknown>).sleep && Number((lifestyle as Record<string, unknown>).sleep) < 5) { score += 4; lifestyleTips.push('Aim for 7-8 hours of sleep.'); }

  // Conditions
  const conditions = ((medicalHistory as Record<string, string[]>).existingConditions || []);
  score += conditions.length * 3;
  if (conditions.length > 0) {
    riskFactors.push(`Existing conditions: ${conditions.slice(0, 2).join(', ')}`);
    doctorQuestions.push('Should I adjust medications given current symptoms?');
  }

  score = Math.min(Math.max(Math.round(score), 0), 100);

  let riskLevel: 'low' | 'moderate' | 'high' | 'urgent';
  let action: 'self-care' | 'routine' | 'doctor' | 'emergency';
  let specialty = 'General Physician';

  if (score >= 81 || foundHigh.length > 0) {
    riskLevel = 'urgent'; action = 'emergency';
    warningSigns.push('Chest pain or pressure', 'Difficulty breathing', 'Loss of consciousness', 'Signs of stroke (FAST)');
  } else if (score >= 61) {
    riskLevel = 'high'; action = 'doctor';
    warningSigns.push('Seek medical attention if symptoms worsen.');
    specialty = determineSpec(allText);
  } else if (score >= 31) {
    riskLevel = 'moderate'; action = 'routine';
    specialty = determineSpec(allText);
    homecareTips.push('Monitor symptoms and track changes daily.', 'Stay hydrated and rest adequately.');
    warningSigns.push('Seek medical attention if symptoms worsen or persist beyond 3 days.');
  } else {
    riskLevel = 'low'; action = 'self-care';
    if (homecareTips.length === 0) {
      homecareTips.push('Stay hydrated, sleep 7-8 hours, exercise 30 minutes daily.', 'Eat a balanced diet rich in fruits and vegetables.');
    }
    warningSigns.push('Seek medical attention if symptoms worsen or new symptoms develop.');
  }

  if (lifestyleTips.length === 0) {
    lifestyleTips.push('Maintain a balanced diet.', 'Practice stress-relief techniques.', 'Get regular health checkups.');
  }

  const aiSummary = `AI Health Risk Assessment — Risk Score: ${score}/100 (${riskLevel.toUpperCase()} RISK).\n\n${
    foundHigh.length > 0 ? `⚠️ HIGH-PRIORITY SYMPTOMS: ${foundHigh.join(', ')}. Immediate care recommended.\n\n` :
    foundModerate.length > 0 ? `Symptoms noted: ${foundModerate.join(', ')}. Medical evaluation recommended.\n\n` :
    'No critical symptoms detected based on your input.\n\n'
  }Recommended action: ${
    action === 'emergency' ? 'Seek emergency medical care immediately.' :
    action === 'doctor' ? 'Consult a doctor within 24-48 hours.' :
    action === 'routine' ? 'Schedule a routine checkup within 1-2 weeks.' :
    'Continue home care with healthy lifestyle habits.'
  }\n\n⚠️ DISCLAIMER: This AI assessment provides risk indicators for informational purposes only. It is NOT a medical diagnosis. Always consult a qualified healthcare professional.`;

  return {
    _id: 'demo-' + Date.now(),
    userId: 'demo',
    symptoms,
    symptomsText,
    riskScore: score,
    riskLevel,
    recommendations: {
      action,
      specialty,
      warningSigns: [...new Set(warningSigns)],
      possibleRiskFactors: [...new Set(riskFactors)].slice(0, 6),
      doctorQuestions: [...new Set(doctorQuestions)].slice(0, 5),
      homecareTips: [...new Set(homecareTips)].slice(0, 5),
      lifestyleTips: [...new Set(lifestyleTips)].slice(0, 5),
    },
    aiSummary,
    createdAt: new Date().toISOString(),
  };
}

function determineSpec(text: string): string {
  if (text.includes('heart') || text.includes('chest') || text.includes('blood pressure')) return 'Cardiologist';
  if (text.includes('breathing') || text.includes('lung') || text.includes('cough')) return 'Pulmonologist';
  if (text.includes('stomach') || text.includes('abdomen')) return 'Gastroenterologist';
  if (text.includes('skin') || text.includes('rash')) return 'Dermatologist';
  if (text.includes('headache') || text.includes('neuro')) return 'Neurologist';
  if (text.includes('joint') || text.includes('bone')) return 'Orthopedic Specialist';
  return 'General Physician';
}
