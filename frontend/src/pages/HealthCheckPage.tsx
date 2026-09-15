import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  Activity, Mic, MicOff, ChevronRight, ChevronLeft, Plus, X,
  User, Heart, Pill, Dumbbell, Moon, Utensils, Info
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { healthApi } from '../services/api';

const COMMON_SYMPTOMS = [
  'Headache', 'Fever', 'Cough', 'Fatigue', 'Chest Pain', 'Shortness of Breath',
  'Nausea', 'Dizziness', 'Back Pain', 'Joint Pain', 'Stomach Pain', 'Skin Rash',
  'Sore Throat', 'Runny Nose', 'Loss of Appetite', 'Insomnia', 'Anxiety', 'Palpitations',
];

const STEP_CONFIG = [
  { id: 'symptoms', label: 'Symptoms', icon: Activity },
  { id: 'lifestyle', label: 'Lifestyle', icon: Dumbbell },
  { id: 'history', label: 'Medical History', icon: Pill },
  { id: 'basics', label: 'Basic Info', icon: User },
];

export default function HealthCheckPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any | null>(null);

  // Form state
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [symptomsText, setSymptomsText] = useState('');
  const [voiceText, setVoiceText] = useState('');
  const [showVoiceConfirm, setShowVoiceConfirm] = useState(false);

  const [lifestyle, setLifestyle] = useState({
    diet: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
    sleep: 7,
    exercise: 'weekly' as 'daily' | 'weekly' | 'rarely' | 'never',
    smoking: false,
    alcohol: 'none' as 'none' | 'occasional' | 'moderate' | 'heavy',
    stressLevel: 5,
  });

  const [medicalHistory, setMedicalHistory] = useState({
    existingConditions: [] as string[],
    previousSurgeries: [] as string[],
    allergies: [] as string[],
    currentMedications: [] as string[],
    familyHistory: [] as string[],
  });

  const [basicInfo, setBasicInfo] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
  });

  // Symptom chip toggle
  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const addCustom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  // Voice input
  const toggleVoice = () => {
    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new (SpeechRecognitionAPI as unknown as { new(): any })();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setVoiceText(transcript);
      setShowVoiceConfirm(true);
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const acceptVoice = () => {
    setSymptomsText(voiceText);
    setShowVoiceConfirm(false);
    setVoiceText('');
  };

  // Add to list helper for medical history
  const addToList = (field: keyof typeof medicalHistory, value: string) => {
    if (!value.trim()) return;
    setMedicalHistory(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));
  };
  const removeFromList = (field: keyof typeof medicalHistory, index: number) => {
    setMedicalHistory(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        symptoms: selectedSymptoms,
        symptomsText: symptomsText || undefined,
        lifestyle,
        medicalHistory,
        basicInfo: {
          age: basicInfo.age ? Number(basicInfo.age) : undefined,
          gender: basicInfo.gender || undefined,
          height: basicInfo.height ? Number(basicInfo.height) : undefined,
          weight: basicInfo.weight ? Number(basicInfo.weight) : undefined,
        },
      };
      const { data } = await healthApi.analyze(payload);
      navigate(`/analysis/${data.assessment._id}`);
    } catch (err) {
      // Demo mode: generate a mock result
      const mockId = 'demo-' + Date.now();
      sessionStorage.setItem('pendingAnalysis', JSON.stringify({
        symptoms: selectedSymptoms,
        symptomsText,
        lifestyle,
        medicalHistory,
        basicInfo,
      }));
      navigate(`/analysis/${mockId}`);
    } finally {
      setLoading(false);
    }
  };

  const next = () => setStep(s => Math.min(s + 1, 3));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">Tell Us About Your Health</h1>
            <p className="text-blue-100 text-sm">Complete this 4-step form for your personalized AI health assessment</p>

            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {STEP_CONFIG.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2">
                  <button
                    onClick={() => setStep(i)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      i === step ? 'bg-white text-blue-700 shadow-sm' :
                      i < step ? 'bg-blue-500 text-white' :
                      'bg-blue-700/50 text-blue-200'
                    }`}
                  >
                    <s.icon className="w-3 h-3" />
                    {s.label}
                  </button>
                  {i < 3 && <ChevronRight className="w-3 h-3 text-blue-300" />}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1.5 bg-blue-700/30 rounded-full max-w-xs mx-auto overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                animate={{ width: `${((step + 1) / 4) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {/* ── Step 0: Symptoms ────────────────────────────────── */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <h2 className="font-display font-bold text-xl text-gray-900 mb-1">What symptoms are you experiencing?</h2>
                <p className="text-gray-500 text-sm mb-5">Select all that apply, or describe in your own words.</p>

                {/* Voice input */}
                <div className="flex gap-3 mb-5">
                  <button
                    type="button"
                    onClick={toggleVoice}
                    id="voice-input-btn"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      isRecording
                        ? 'bg-red-100 text-red-700 border-2 border-red-300 animate-pulse'
                        : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    {isRecording ? <><MicOff className="w-4 h-4" /> Stop Recording</> : <><Mic className="w-4 h-4" /> Voice Input</>}
                  </button>
                  <p className="text-xs text-gray-400 self-center">Or describe symptoms by voice using your microphone</p>
                </div>

                {/* Voice confirm */}
                <AnimatePresence>
                  {showVoiceConfirm && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4"
                    >
                      <p className="text-sm font-semibold text-blue-800 mb-1">Did we understand you correctly?</p>
                      <p className="text-sm text-blue-700 italic mb-3">"{voiceText}"</p>
                      <div className="flex gap-2">
                        <button onClick={acceptVoice} id="voice-accept-btn" className="px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all">
                          Yes, use this
                        </button>
                        <button onClick={() => setShowVoiceConfirm(false)} className="px-4 py-1.5 bg-white text-gray-600 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-all">
                          Try again
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Text input */}
                <textarea
                  value={symptomsText}
                  onChange={e => setSymptomsText(e.target.value)}
                  id="symptoms-text-input"
                  placeholder="Describe your symptoms in detail (e.g., I have a persistent headache and mild fever since yesterday...)"
                  className="form-input mb-4 h-24 resize-none"
                />

                {/* Symptom chips */}
                <p className="text-sm font-semibold text-gray-700 mb-3">Common Symptoms</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {COMMON_SYMPTOMS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSymptom(s)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                        selectedSymptoms.includes(s)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Custom symptom input */}
                <div className="flex gap-2">
                  <input
                    value={customSymptom}
                    onChange={e => setCustomSymptom(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustom()}
                    placeholder="Add custom symptom..."
                    className="form-input flex-1"
                    id="custom-symptom-input"
                  />
                  <button type="button" onClick={addCustom} className="btn-primary px-4 py-2 text-sm">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Selected symptoms display */}
                {selectedSymptoms.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedSymptoms.map(s => (
                      <span key={s} className="flex items-center gap-1.5 bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                        {s}
                        <button onClick={() => toggleSymptom(s)} className="hover:text-blue-900">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Step 1: Lifestyle ────────────────────────────────── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <h2 className="font-display font-bold text-xl text-gray-900 mb-1">Your Lifestyle</h2>
                <p className="text-gray-500 text-sm mb-6">Help us understand your daily habits for a more accurate assessment.</p>

                <div className="space-y-6">
                  {/* Diet */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"><Utensils className="w-4 h-4 text-green-500" /> Diet Quality</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['excellent', 'good', 'fair', 'poor'] as const).map(d => (
                        <button key={d} type="button" onClick={() => setLifestyle(prev => ({ ...prev, diet: d }))}
                          className={`py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${lifestyle.diet === d ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sleep */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"><Moon className="w-4 h-4 text-blue-500" /> Sleep Duration: <span className="text-blue-600">{lifestyle.sleep} hours</span></label>
                    <input type="range" min="3" max="12" step="0.5" value={lifestyle.sleep}
                      onChange={e => setLifestyle(prev => ({ ...prev, sleep: Number(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                      id="sleep-slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1"><span>3h</span><span>12h</span></div>
                  </div>

                  {/* Exercise */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"><Dumbbell className="w-4 h-4 text-orange-500" /> Exercise Frequency</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['daily', 'weekly', 'rarely', 'never'] as const).map(e => (
                        <button key={e} type="button" onClick={() => setLifestyle(prev => ({ ...prev, exercise: e }))}
                          className={`py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${lifestyle.exercise === e ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}>
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Smoking */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">🚬 Do you smoke?</label>
                    <button type="button" onClick={() => setLifestyle(prev => ({ ...prev, smoking: !prev.smoking }))}
                      id="smoking-toggle"
                      className={`relative w-12 h-6 rounded-full transition-colors ${lifestyle.smoking ? 'bg-red-500' : 'bg-gray-300'}`}>
                      <motion.span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                        animate={{ x: lifestyle.smoking ? 24 : 0 }} transition={{ duration: 0.2 }} />
                    </button>
                  </div>

                  {/* Alcohol */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">🍷 Alcohol Consumption</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['none', 'occasional', 'moderate', 'heavy'] as const).map(a => (
                        <button key={a} type="button" onClick={() => setLifestyle(prev => ({ ...prev, alcohol: a }))}
                          className={`py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${lifestyle.alcohol === a ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'}`}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stress */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">😰 Stress Level: <span className="text-purple-600">{lifestyle.stressLevel}/10</span></label>
                    <input type="range" min="1" max="10" value={lifestyle.stressLevel}
                      onChange={e => setLifestyle(prev => ({ ...prev, stressLevel: Number(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-purple-600"
                      id="stress-slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1"><span>😌 Relaxed</span><span>😰 Very Stressed</span></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Medical History ──────────────────────────── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <h2 className="font-display font-bold text-xl text-gray-900 mb-1">Medical History</h2>
                <p className="text-gray-500 text-sm mb-5">All information is securely stored and used only for your health assessment.</p>

                {(Object.keys(medicalHistory) as Array<keyof typeof medicalHistory>).map((field) => {
                  const labels: Record<keyof typeof medicalHistory, string> = {
                    existingConditions: '🏥 Existing Conditions',
                    previousSurgeries: '🔪 Previous Surgeries',
                    allergies: '⚠️ Allergies',
                    currentMedications: '💊 Current Medications',
                    familyHistory: '👨‍👩‍👦 Family Health History',
                  };
                  const placeholders: Record<keyof typeof medicalHistory, string> = {
                    existingConditions: 'e.g., Diabetes, Hypertension',
                    previousSurgeries: 'e.g., Appendectomy 2020',
                    allergies: 'e.g., Penicillin, Peanuts',
                    currentMedications: 'e.g., Metformin 500mg',
                    familyHistory: 'e.g., Heart Disease, Cancer',
                  };
                  return (
                    <div key={field} className="mb-5">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{labels[field]}</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          id={`history-${field}`}
                          onKeyDown={(e) => { if (e.key === 'Enter') { addToList(field, (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ''; } }}
                          placeholder={placeholders[field]}
                          className="form-input flex-1"
                        />
                        <button type="button"
                          onClick={(e) => {
                            const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                            addToList(field, input.value); input.value = '';
                          }}
                          className="btn-secondary px-4 py-2 text-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {medicalHistory[field].map((item, i) => (
                          <span key={i} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                            {item}
                            <button onClick={() => removeFromList(field, i)} className="hover:text-red-600"><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3 mt-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">Skip any section that doesn't apply to you. All fields are optional.</p>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Basic Info ───────────────────────────────── */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <h2 className="font-display font-bold text-xl text-gray-900 mb-1">Basic Information</h2>
                <p className="text-gray-500 text-sm mb-6">Used to calculate BMI and age-based risk factors.</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age</label>
                    <input type="number" id="basic-age" value={basicInfo.age}
                      onChange={e => setBasicInfo(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="25" min="1" max="120" className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
                    <select id="basic-gender" value={basicInfo.gender}
                      onChange={e => setBasicInfo(prev => ({ ...prev, gender: e.target.value }))}
                      className="form-input">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Height (cm)</label>
                    <input type="number" id="basic-height" value={basicInfo.height}
                      onChange={e => setBasicInfo(prev => ({ ...prev, height: e.target.value }))}
                      placeholder="170" className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Weight (kg)</label>
                    <input type="number" id="basic-weight" value={basicInfo.weight}
                      onChange={e => setBasicInfo(prev => ({ ...prev, weight: e.target.value }))}
                      placeholder="70" className="form-input" />
                  </div>
                </div>

                {/* BMI preview */}
                {basicInfo.height && basicInfo.weight && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-500">
                      Your BMI:{' '}
                      <strong className="text-gray-900">
                        {(Number(basicInfo.weight) / ((Number(basicInfo.height) / 100) ** 2)).toFixed(1)}
                      </strong>
                      {' '}—{' '}
                      <span className="text-blue-600">
                        {(() => {
                          const bmi = Number(basicInfo.weight) / ((Number(basicInfo.height) / 100) ** 2);
                          if (bmi < 18.5) return 'Underweight';
                          if (bmi < 25) return 'Normal weight ✓';
                          if (bmi < 30) return 'Overweight';
                          return 'Obese';
                        })()}
                      </span>
                    </p>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-5 border border-blue-100">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" /> Assessment Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Symptoms selected</p>
                      <p className="font-semibold text-gray-900">{selectedSymptoms.length || (symptomsText ? '1 (text)' : 0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Voice description</p>
                      <p className="font-semibold text-gray-900">{symptomsText ? 'Yes ✓' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Conditions</p>
                      <p className="font-semibold text-gray-900">{medicalHistory.existingConditions.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Lifestyle data</p>
                      <p className="font-semibold text-gray-900">Complete ✓</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={prev}
              disabled={step === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                step === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {step < 3 ? (
              <button type="button" onClick={next} id="next-step-btn"
                className="btn-primary flex items-center gap-2 px-6 py-3">
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                id="analyze-health-btn"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-teal-500 to-purple-600 text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg text-sm"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
                ) : (
                  <><Activity className="w-4 h-4" /> Analyze My Health</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
