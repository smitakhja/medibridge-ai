/**
 * MediBridge AI Risk Engine
 * Demo mode: Rule-based scoring (no external API needed)
 * Production mode: Integrates with OpenAI/Gemini API
 *
 * IMPORTANT: This system provides risk indicators and triage guidance ONLY.
 * It does NOT diagnose diseases or replace professional medical advice.
 */

const HIGH_RISK_SYMPTOMS = [
  'chest pain', 'chest discomfort', 'difficulty breathing', 'shortness of breath',
  'heart attack', 'stroke', 'unconscious', 'severe bleeding', 'seizure',
  'severe headache', 'sudden vision loss', 'arm pain', 'jaw pain', 'fainting',
  'loss of consciousness', 'paralysis', 'severe allergic reaction', 'anaphylaxis',
];

const MODERATE_SYMPTOMS = [
  'fever', 'high temperature', 'persistent cough', 'abdominal pain', 'vomiting',
  'diarrhea', 'joint pain', 'back pain', 'rash', 'swelling', 'dizziness',
  'headache', 'fatigue', 'weakness', 'palpitations', 'irregular heartbeat',
  'blood in urine', 'blood in stool', 'difficulty swallowing',
];

const LOW_RISK_SYMPTOMS = [
  'mild cold', 'runny nose', 'sore throat', 'mild cough', 'mild headache',
  'mild fever', 'muscle ache', 'tiredness', 'minor cut', 'bruise',
  'upset stomach', 'mild nausea', 'insomnia', 'stress', 'anxiety',
];

const RISK_CONDITIONS = [
  'diabetes', 'hypertension', 'heart disease', 'cancer', 'kidney disease',
  'liver disease', 'copd', 'asthma', 'autoimmune', 'immunocompromised',
];

function calculateRiskScore(input) {
  const {
    symptoms = [],
    symptomsText = '',
    lifestyle = {},
    medicalHistory = {},
    basicInfo = {},
  } = input;

  let score = 0;
  const riskFactors = [];
  const warningSigns = [];
  const homecareTips = [];
  const lifestyleTips = [];
  const doctorQuestions = [];

  // Combine all symptom text for analysis
  const allSymptomText = [
    ...symptoms,
    symptomsText,
  ].join(' ').toLowerCase();

  // Check high-risk symptoms (max 50 points)
  const foundHighRisk = HIGH_RISK_SYMPTOMS.filter(s => allSymptomText.includes(s));
  if (foundHighRisk.length > 0) {
    score += Math.min(50 + foundHighRisk.length * 10, 80);
    riskFactors.push(...foundHighRisk.map(s => `High-risk symptom: ${s}`));
    warningSigns.push('Seek emergency medical care immediately if symptoms are severe or worsening.');
  }

  // Check moderate symptoms
  const foundModerate = MODERATE_SYMPTOMS.filter(s => allSymptomText.includes(s));
  if (foundHighRisk.length === 0 && foundModerate.length > 0) {
    score += Math.min(foundModerate.length * 8, 40);
    riskFactors.push(...foundModerate.map(s => `Symptom requiring attention: ${s}`));
  }

  // Check low-risk symptoms
  const foundLow = LOW_RISK_SYMPTOMS.filter(s => allSymptomText.includes(s));
  if (foundHighRisk.length === 0 && foundModerate.length === 0 && foundLow.length > 0) {
    score += Math.min(foundLow.length * 3, 20);
  }

  // Age risk factor
  const age = basicInfo.age || 0;
  if (age > 65) { score += 10; riskFactors.push('Age over 65 (higher risk group)'); }
  else if (age > 50) { score += 5; riskFactors.push('Age over 50 (moderate risk group)'); }
  else if (age < 5) { score += 8; riskFactors.push('Age under 5 (pediatric risk)'); }

  // BMI calculation
  if (basicInfo.height && basicInfo.weight) {
    const heightM = basicInfo.height / 100;
    const bmi = basicInfo.weight / (heightM * heightM);
    if (bmi > 30) { score += 8; riskFactors.push(`High BMI: ${bmi.toFixed(1)} (obesity)`); }
    else if (bmi < 18.5) { score += 5; riskFactors.push(`Low BMI: ${bmi.toFixed(1)} (underweight)`); }
  }

  // Medical history risk
  const conditions = (medicalHistory.existingConditions || []).map(c => c.toLowerCase());
  const foundConditions = RISK_CONDITIONS.filter(rc => conditions.some(c => c.includes(rc)));
  if (foundConditions.length > 0) {
    score += foundConditions.length * 5;
    riskFactors.push(...foundConditions.map(c => `Pre-existing condition: ${c}`));
    doctorQuestions.push('How do my current symptoms relate to my existing condition?');
    doctorQuestions.push('Should I adjust my current medications?');
  }

  // Lifestyle risk factors
  if (lifestyle.smoking) { score += 8; riskFactors.push('Smoking increases cardiovascular and respiratory risk'); }
  if (lifestyle.alcohol === 'heavy') { score += 6; riskFactors.push('Heavy alcohol consumption'); }
  if (lifestyle.stressLevel >= 8) { score += 5; riskFactors.push('Very high stress levels'); }
  if (lifestyle.exercise === 'never') { score += 4; riskFactors.push('Sedentary lifestyle'); }
  if (lifestyle.sleep < 5) { score += 4; riskFactors.push('Insufficient sleep (< 5 hours)'); }
  if (lifestyle.diet === 'poor') { score += 3; riskFactors.push('Poor dietary habits'); }

  // Family history
  const familyHistory = medicalHistory.familyHistory || [];
  if (familyHistory.length > 0) {
    score += familyHistory.length * 2;
    riskFactors.push(`Family history: ${familyHistory.join(', ')}`);
  }

  // Clamp score
  score = Math.min(Math.max(Math.round(score), 0), 100);

  // Determine risk level and action
  let riskLevel, action, specialty;
  if (score >= 81 || foundHighRisk.length > 0) {
    riskLevel = 'urgent';
    action = 'emergency';
    specialty = 'Emergency Medicine';
    warningSigns.push(
      'Chest pain or pressure', 'Difficulty breathing',
      'Loss of consciousness', 'Sudden severe headache',
      'Signs of stroke (FAST: Face, Arms, Speech, Time)'
    );
  } else if (score >= 61) {
    riskLevel = 'high';
    action = 'doctor';
    specialty = determineSpecialty(allSymptomText, conditions);
    warningSigns.push('If symptoms worsen, seek emergency care immediately.');
    doctorQuestions.push('What tests should I have to understand these symptoms?');
    doctorQuestions.push('Are there any red-flag symptoms I should watch for?');
  } else if (score >= 31) {
    riskLevel = 'moderate';
    action = 'routine';
    specialty = determineSpecialty(allSymptomText, conditions);
    homecareTips.push('Monitor symptoms daily and track any changes.');
    lifestyleTips.push('Stay hydrated, rest adequately, and maintain a balanced diet.');
    doctorQuestions.push('Should I come in for a routine checkup?');
  } else {
    riskLevel = 'low';
    action = 'self-care';
    homecareTips.push(
      'Drink 8–10 glasses of water daily.',
      'Get 7–8 hours of quality sleep.',
      'Engage in 30 minutes of moderate exercise daily.',
      'Practice stress-relief techniques: meditation, deep breathing.',
    );
    lifestyleTips.push(
      'Maintain a balanced diet rich in fruits, vegetables, and whole grains.',
      'Limit processed foods, sugar, and saturated fats.',
    );
    warningSigns.push(
      'Seek medical attention if symptoms worsen or persist beyond 3 days.',
      'Go to emergency if you experience chest pain, difficulty breathing, or fainting.',
    );
  }

  // Common lifestyle tips
  if (lifestyle.smoking) lifestyleTips.push('Consider a smoking cessation program — significant health benefit within weeks.');
  if (lifestyle.exercise === 'never' || lifestyle.exercise === 'rarely') {
    lifestyleTips.push('Start with 20-minute walks daily. Build up gradually.');
  }
  if (lifestyle.stressLevel >= 7) {
    lifestyleTips.push('Consider mindfulness, yoga, or speaking with a mental health professional.');
  }

  const aiSummary = generateSummary(score, riskLevel, foundHighRisk, foundModerate, riskFactors, action);

  return {
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
  };
}

function determineSpecialty(symptomText, conditions) {
  if (symptomText.includes('heart') || symptomText.includes('chest') || symptomText.includes('blood pressure'))
    return 'Cardiologist';
  if (symptomText.includes('breathing') || symptomText.includes('lung') || symptomText.includes('cough'))
    return 'Pulmonologist';
  if (symptomText.includes('stomach') || symptomText.includes('abdomen') || symptomText.includes('digestive'))
    return 'Gastroenterologist';
  if (symptomText.includes('skin') || symptomText.includes('rash') || symptomText.includes('itch'))
    return 'Dermatologist';
  if (symptomText.includes('headache') || symptomText.includes('neuro') || symptomText.includes('seizure'))
    return 'Neurologist';
  if (symptomText.includes('joint') || symptomText.includes('bone') || symptomText.includes('muscle'))
    return 'Orthopedic Specialist';
  if (conditions.includes('diabetes')) return 'Endocrinologist';
  return 'General Physician';
}

function generateSummary(score, riskLevel, highRisk, moderate, riskFactors, action) {
  const levelMap = {
    low: 'LOW', moderate: 'MODERATE', high: 'HIGH', urgent: 'URGENT'
  };
  let summary = `AI Health Risk Assessment — Risk Score: ${score}/100 (${levelMap[riskLevel]} RISK).\n\n`;

  if (highRisk.length > 0) {
    summary += `⚠️ HIGH-PRIORITY SYMPTOMS DETECTED: ${highRisk.join(', ')}. Immediate medical attention is strongly recommended.\n\n`;
  } else if (moderate.length > 0) {
    summary += `Symptoms identified: ${moderate.join(', ')}. These warrant medical evaluation.\n\n`;
  }

  if (riskFactors.length > 0) {
    summary += `Key risk factors: ${riskFactors.slice(0, 3).join('; ')}.\n\n`;
  }

  const actionMap = {
    'emergency': 'Seek emergency medical care immediately.',
    'doctor': 'Consult a doctor within 24–48 hours.',
    'routine': 'Schedule a routine checkup within 1–2 weeks.',
    'self-care': 'Continue home care with healthy lifestyle habits. Monitor for changes.',
  };
  summary += `Recommended action: ${actionMap[action]}\n\n`;
  summary += `⚠️ DISCLAIMER: This AI assessment provides risk indicators for informational purposes only. It is NOT a medical diagnosis. Always consult a qualified healthcare professional for medical advice.`;

  return summary;
}

module.exports = { calculateRiskScore };
