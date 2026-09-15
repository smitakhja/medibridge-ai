import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, Star, MapPin, Clock, Video, Building2,
  ChevronDown, CheckCircle, Phone, Calendar, Stethoscope, X
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { doctorsApi, appointmentsApi } from '../services/api';
import type { Doctor } from '../types';

const SPECIALTIES = [
  'All', 'General Physician', 'Cardiologist', 'Dermatologist',
  'Neurologist', 'Orthopedic Specialist', 'Psychiatrist', 'Pulmonologist',
  'Gastroenterologist', 'Endocrinologist', 'Pediatrician', 'Gynecologist',
];

const DEMO_DOCTORS: Doctor[] = [
  { _id: 'doc-1', name: 'Dr. Priya Sharma', specialty: 'Cardiologist', experience: 12, rating: 4.8, reviewCount: 248, location: { address: '14 Medical Park, Sector 12', city: 'Mumbai', state: 'Maharashtra' }, isAvailableNow: true, consultationType: ['in-person', 'online'], hospital: 'City Heart Institute', fee: 800, languages: ['English', 'Hindi', 'Marathi'] },
  { _id: 'doc-2', name: 'Dr. Rahul Mehta', specialty: 'General Physician', experience: 8, rating: 4.6, reviewCount: 312, location: { address: '23 Health Avenue', city: 'Ahmedabad', state: 'Gujarat' }, isAvailableNow: false, consultationType: ['in-person', 'online'], hospital: 'Apollo Clinic', fee: 500, languages: ['English', 'Hindi', 'Gujarati'] },
  { _id: 'doc-3', name: 'Dr. Ananya Krishnan', specialty: 'Neurologist', experience: 15, rating: 4.9, reviewCount: 187, location: { address: '5 Brain & Spine Center', city: 'Chennai', state: 'Tamil Nadu' }, isAvailableNow: true, consultationType: ['in-person'], hospital: 'Neuro Care Hospital', fee: 1200, languages: ['English', 'Tamil'] },
  { _id: 'doc-4', name: 'Dr. Vikram Singh', specialty: 'Orthopedic Specialist', experience: 10, rating: 4.7, reviewCount: 156, location: { address: '8 Bone & Joint Clinic', city: 'Delhi', state: 'Delhi' }, isAvailableNow: true, consultationType: ['in-person', 'online'], hospital: 'Joint Care Center', fee: 900, languages: ['English', 'Hindi'] },
  { _id: 'doc-5', name: 'Dr. Meera Patel', specialty: 'Dermatologist', experience: 7, rating: 4.5, reviewCount: 203, location: { address: '11 Skin Care Hub', city: 'Surat', state: 'Gujarat' }, isAvailableNow: false, consultationType: ['in-person', 'online'], hospital: 'DermaCare Clinic', fee: 600, languages: ['English', 'Hindi', 'Gujarati'] },
  { _id: 'doc-6', name: 'Dr. Arjun Nair', specialty: 'Psychiatrist', experience: 9, rating: 4.8, reviewCount: 134, location: { address: '3 Mind & Wellness Center', city: 'Bangalore', state: 'Karnataka' }, isAvailableNow: true, consultationType: ['online'], hospital: 'MindCare Institute', fee: 1000, languages: ['English', 'Hindi', 'Kannada'] },
  { _id: 'doc-7', name: 'Dr. Kavya Reddy', specialty: 'Gynecologist', experience: 11, rating: 4.9, reviewCount: 278, location: { address: '20 Women Health Center', city: 'Hyderabad', state: 'Telangana' }, isAvailableNow: true, consultationType: ['in-person', 'online'], hospital: "Women's Care Hospital", fee: 750, languages: ['English', 'Telugu', 'Hindi'] },
  { _id: 'doc-8', name: 'Dr. Suresh Kumar', specialty: 'Pulmonologist', experience: 13, rating: 4.6, reviewCount: 165, location: { address: '7 Lung Health Clinic', city: 'Pune', state: 'Maharashtra' }, isAvailableNow: false, consultationType: ['in-person'], hospital: 'Breath Easy Clinic', fee: 850, languages: ['English', 'Hindi', 'Marathi'] },
];

const SPECIALTY_COLORS: Record<string, string> = {
  'Cardiologist': 'bg-red-100 text-red-700',
  'General Physician': 'bg-blue-100 text-blue-700',
  'Neurologist': 'bg-purple-100 text-purple-700',
  'Orthopedic Specialist': 'bg-orange-100 text-orange-700',
  'Dermatologist': 'bg-pink-100 text-pink-700',
  'Psychiatrist': 'bg-indigo-100 text-indigo-700',
  'Gynecologist': 'bg-rose-100 text-rose-700',
  'Pulmonologist': 'bg-cyan-100 text-cyan-700',
  'Gastroenterologist': 'bg-amber-100 text-amber-700',
  'Endocrinologist': 'bg-teal-100 text-teal-700',
};

function DoctorCard({ doctor, onBook }: { doctor: Doctor; onBook: (d: Doctor) => void }) {
  const colorClass = SPECIALTY_COLORS[doctor.specialty] || 'bg-gray-100 text-gray-700';
  const initials = doctor.name.split(' ').filter(p => p.startsWith('Dr.') === false).map(p => p[0]).join('').slice(0, 2);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-gray-900 text-sm leading-tight">{doctor.name}</h3>
          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${colorClass}`}>
            {doctor.specialty}
          </span>
          {doctor.hospital && (
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <Building2 className="w-3 h-3" /> {doctor.hospital}
            </p>
          )}
        </div>
        {/* Availability dot */}
        <div className={`flex items-center gap-1 text-xs font-semibold shrink-0 ${doctor.isAvailableNow ? 'text-green-600' : 'text-gray-400'}`}>
          <span className={`w-2 h-2 rounded-full ${doctor.isAvailableNow ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          {doctor.isAvailableNow ? 'Available' : 'Busy'}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="font-bold text-gray-900">{doctor.rating?.toFixed(1)}</span>
          <span className="text-gray-400">({doctor.reviewCount})</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          <span>{doctor.experience} yrs</span>
        </div>
        <div className="text-gray-500">
          ₹{doctor.fee}
        </div>
      </div>

      {/* Location */}
      {doctor.location?.city && (
        <p className="text-xs text-gray-400 flex items-center gap-1 mb-4">
          <MapPin className="w-3 h-3" /> {doctor.location.city}, {doctor.location.state}
        </p>
      )}

      {/* Consultation type badges */}
      <div className="flex gap-2 mb-4">
        {(doctor.consultationType || []).map(type => (
          <span key={type} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium ${type === 'online' ? 'bg-purple-50 text-purple-700' : 'bg-gray-50 text-gray-600'}`}>
            {type === 'online' ? <Video className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
            {type === 'online' ? 'Online' : 'In-Person'}
          </span>
        ))}
      </div>

      {/* Languages */}
      <p className="text-xs text-gray-400 mb-4">
        🌐 {(doctor.languages || []).join(', ')}
      </p>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onBook(doctor)}
          id={`book-${doctor._id}`}
          className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5" /> Book Appointment
        </button>
        <button className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all border border-gray-100">
          <Phone className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function BookingModal({ doctor, onClose, onConfirm }: { doctor: Doctor; onClose: () => void; onConfirm: (data: Record<string, string>) => void }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('in-person');
  const [reason, setReason] = useState('');
  const [booked, setBooked] = useState(false);

  const handleBook = async () => {
    if (!date || !time) return;
    await onConfirm({ date, time, type, reason });
    setBooked(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {booked ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Appointment Booked!</h2>
            <p className="text-gray-500 text-sm mb-6">Your appointment with {doctor.name} has been scheduled for {date} at {time}.</p>
            <button onClick={onClose} className="btn-primary w-full">Done</button>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-5 flex items-center justify-between">
              <div>
                <p className="text-white/70 text-xs">Book Appointment</p>
                <h2 className="text-white font-bold">{doctor.name}</h2>
                <p className="text-blue-100 text-xs">{doctor.specialty}</p>
              </div>
              <button onClick={onClose} className="p-2 bg-white/20 rounded-xl text-white hover:bg-white/30 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} className="form-input" id="booking-date" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time Slot</label>
                <div className="grid grid-cols-4 gap-2">
                  {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'].map(t => (
                    <button key={t} type="button" onClick={() => setTime(t)}
                      className={`py-2 text-xs font-medium rounded-lg border transition-all ${time === t ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Consultation Type</label>
                <div className="flex gap-3">
                  {(doctor.consultationType || ['in-person']).map(ct => (
                    <button key={ct} type="button" onClick={() => setType(ct)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${type === ct ? 'bg-blue-50 text-blue-700 border-blue-300' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {ct === 'online' ? <Video className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                      {ct === 'online' ? 'Online' : 'In-Person'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason for Visit</label>
                <textarea value={reason} onChange={e => setReason(e.target.value)}
                  placeholder="Briefly describe your symptoms or reason..." className="form-input h-20 resize-none" id="booking-reason" />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Consultation fee</p>
                  <p className="font-bold text-gray-900">₹{doctor.fee}</p>
                </div>
                <button onClick={handleBook} disabled={!date || !time} id="confirm-booking-btn"
                  className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Confirm Booking
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(DEMO_DOCTORS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await doctorsApi.getAll();
        if (data.doctors?.length > 0) setDoctors(data.doctors);
      } catch { /* Use demo data */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = doctors.filter(d => {
    const matchesSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()) || d.hospital?.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = selectedSpecialty === 'All' || d.specialty === selectedSpecialty;
    const matchesAvail = !availableOnly || d.isAvailableNow;
    return matchesSearch && matchesSpec && matchesAvail;
  });

  const handleBook = async (data: Record<string, string>) => {
    if (!bookingDoctor) return;
    try {
      await appointmentsApi.create({ doctorId: bookingDoctor._id, ...data });
    } catch { /* Demo mode */ }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-1 flex items-center gap-3">
              <Stethoscope className="w-7 h-7" /> Find Your Doctor
            </h1>
            <p className="text-orange-100 text-sm">Connect with verified specialists near you</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 mb-6 flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="flex-1 min-w-48 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search doctors, specialties, hospitals..."
                className="form-input pl-9 py-2.5" id="doctor-search" />
            </div>

            {/* Specialty filter */}
            <div className="relative">
              <select value={selectedSpecialty} onChange={e => setSelectedSpecialty(e.target.value)}
                className="form-input py-2.5 pr-8 appearance-none cursor-pointer text-sm min-w-40" id="specialty-filter">
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Available toggle */}
            <button
              type="button"
              onClick={() => setAvailableOnly(v => !v)}
              id="available-filter"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${availableOnly ? 'bg-green-50 text-green-700 border-green-300' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
            >
              <span className={`w-2 h-2 rounded-full ${availableOnly ? 'bg-green-500' : 'bg-gray-300'}`} />
              Available Now
            </button>

            <p className="text-sm text-gray-400 ml-auto">{filtered.length} doctors found</p>
          </div>

          {/* Specialty quick-filters */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
            {SPECIALTIES.slice(0, 8).map(s => (
              <button key={s} onClick={() => setSelectedSpecialty(s)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${selectedSpecialty === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                {s}
              </button>
            ))}
          </div>

          {/* Doctors grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
                  <div className="skeleton h-14 w-14 rounded-2xl mb-4" />
                  <div className="skeleton h-4 w-3/4 rounded mb-2" />
                  <div className="skeleton h-3 w-1/2 rounded mb-4" />
                  <div className="skeleton h-8 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((doc, i) => (
                <motion.div key={doc._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <DoctorCard doctor={doc} onBook={setBookingDoctor} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No doctors found matching your filters.</p>
              <button onClick={() => { setSearch(''); setSelectedSpecialty('All'); setAvailableOnly(false); }}
                className="mt-3 text-blue-600 text-sm font-semibold hover:text-blue-700">Clear filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Booking modal */}
      {bookingDoctor && (
        <BookingModal doctor={bookingDoctor} onClose={() => setBookingDoctor(null)} onConfirm={handleBook} />
      )}
    </div>
  );
}
