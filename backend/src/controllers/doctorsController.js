const Doctor = require('../models/Doctor');

const DEMO_DOCTORS = [
  {
    _id: 'demo-doc-1',
    name: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    experience: 12,
    rating: 4.8,
    reviewCount: 248,
    location: { address: '14 Medical Park, Sector 12', city: 'Mumbai', state: 'Maharashtra' },
    isAvailableNow: true,
    consultationType: ['in-person', 'online'],
    hospital: 'City Heart Institute',
    fee: 800,
    languages: ['English', 'Hindi', 'Marathi'],
    photo: null,
  },
  {
    _id: 'demo-doc-2',
    name: 'Dr. Rahul Mehta',
    specialty: 'General Physician',
    experience: 8,
    rating: 4.6,
    reviewCount: 312,
    location: { address: '23 Health Avenue', city: 'Ahmedabad', state: 'Gujarat' },
    isAvailableNow: false,
    consultationType: ['in-person', 'online'],
    hospital: 'Apollo Clinic',
    fee: 500,
    languages: ['English', 'Hindi', 'Gujarati'],
    photo: null,
  },
  {
    _id: 'demo-doc-3',
    name: 'Dr. Ananya Krishnan',
    specialty: 'Neurologist',
    experience: 15,
    rating: 4.9,
    reviewCount: 187,
    location: { address: '5 Brain & Spine Center', city: 'Chennai', state: 'Tamil Nadu' },
    isAvailableNow: true,
    consultationType: ['in-person'],
    hospital: 'Neuro Care Hospital',
    fee: 1200,
    languages: ['English', 'Tamil'],
    photo: null,
  },
  {
    _id: 'demo-doc-4',
    name: 'Dr. Vikram Singh',
    specialty: 'Orthopedic Specialist',
    experience: 10,
    rating: 4.7,
    reviewCount: 156,
    location: { address: '8 Bone & Joint Clinic', city: 'Delhi', state: 'Delhi' },
    isAvailableNow: true,
    consultationType: ['in-person', 'online'],
    hospital: 'Joint Care Center',
    fee: 900,
    languages: ['English', 'Hindi'],
    photo: null,
  },
  {
    _id: 'demo-doc-5',
    name: 'Dr. Meera Patel',
    specialty: 'Dermatologist',
    experience: 7,
    rating: 4.5,
    reviewCount: 203,
    location: { address: '11 Skin Care Hub', city: 'Surat', state: 'Gujarat' },
    isAvailableNow: false,
    consultationType: ['in-person', 'online'],
    hospital: 'DermaCare Clinic',
    fee: 600,
    languages: ['English', 'Hindi', 'Gujarati'],
    photo: null,
  },
  {
    _id: 'demo-doc-6',
    name: 'Dr. Arjun Nair',
    specialty: 'Psychiatrist',
    experience: 9,
    rating: 4.8,
    reviewCount: 134,
    location: { address: '3 Mind & Wellness Center', city: 'Bangalore', state: 'Karnataka' },
    isAvailableNow: true,
    consultationType: ['online'],
    hospital: 'MindCare Institute',
    fee: 1000,
    languages: ['English', 'Hindi', 'Kannada', 'Malayalam'],
    photo: null,
  },
];

// GET /api/doctors
const getDoctors = async (req, res, next) => {
  try {
    const { specialty, available } = req.query;

    // Try DB first, fall back to demo data
    let doctors = [];
    try {
      const query = {};
      if (specialty) query.specialty = { $regex: specialty, $options: 'i' };
      if (available === 'true') query.isAvailableNow = true;
      doctors = await Doctor.find(query).limit(20);
    } catch (_) {}

    if (doctors.length === 0) {
      doctors = DEMO_DOCTORS.filter(d => {
        if (specialty && !d.specialty.toLowerCase().includes(specialty.toLowerCase())) return false;
        if (available === 'true' && !d.isAvailableNow) return false;
        return true;
      });
    }

    res.json({ success: true, doctors });
  } catch (error) {
    next(error);
  }
};

// GET /api/doctors/:id
const getDoctor = async (req, res, next) => {
  try {
    let doctor = null;
    try {
      doctor = await Doctor.findById(req.params.id);
    } catch (_) {}

    if (!doctor) {
      doctor = DEMO_DOCTORS.find(d => d._id === req.params.id);
    }
    if (!doctor) return res.status(404).json({ error: 'Doctor not found.' });
    res.json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDoctors, getDoctor };
