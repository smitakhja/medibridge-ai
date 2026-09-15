import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Clock, Navigation, Filter, Search,
  Building2, Pill, Microscope, AlertCircle, Star, ChevronRight,
  X, Shield, Info
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { facilitiesApi } from '../services/api';
import type { HealthcareFacility } from '../types';

const FACILITY_TYPES = ['all', 'hospital', 'clinic', 'pharmacy', 'diagnostic'] as const;

const TYPE_CONFIG = {
  hospital: { label: 'Hospital', icon: Building2, color: 'text-red-600', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700' },
  clinic: { label: 'Clinic', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
  pharmacy: { label: 'Pharmacy', icon: Pill, color: 'text-green-600', bg: 'bg-green-50', badge: 'bg-green-100 text-green-700' },
  diagnostic: { label: 'Diagnostic', icon: Microscope, color: 'text-purple-600', bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-700' },
};

const DEMO_FACILITIES: HealthcareFacility[] = [
  { _id: 'fac-1', name: 'City General Hospital', type: 'hospital', address: 'MG Road, Near Central Park', city: 'Mumbai', phone: '022-28001200', location: { lat: 19.076, lng: 72.877 }, isOpen24h: true, hasEmergency: true, rating: 4.5, openHours: '24/7', distance: 1.2, specialties: ['Cardiology', 'Neurology', 'Orthopedics'], beds: 450 },
  { _id: 'fac-2', name: 'Apollo Health Clinic', type: 'clinic', address: '14 Park Street', city: 'Mumbai', phone: '022-45001500', location: { lat: 19.082, lng: 72.868 }, isOpen24h: false, hasEmergency: false, rating: 4.7, openHours: '8:00 AM – 8:00 PM', distance: 0.8 },
  { _id: 'fac-3', name: 'MedPlus Pharmacy', type: 'pharmacy', address: '5 Station Road', city: 'Mumbai', phone: '022-22001100', location: { lat: 19.073, lng: 72.880 }, isOpen24h: true, hasEmergency: false, rating: 4.3, openHours: '24/7', distance: 0.3 },
  { _id: 'fac-4', name: 'LabCorp Diagnostic Center', type: 'diagnostic', address: '22 Health Colony', city: 'Mumbai', phone: '022-33005500', location: { lat: 19.068, lng: 72.874 }, isOpen24h: false, hasEmergency: false, rating: 4.6, openHours: '6:00 AM – 9:00 PM', distance: 2.1 },
  { _id: 'fac-5', name: 'Lilavati Hospital', type: 'hospital', address: 'Bandra West', city: 'Mumbai', phone: '022-26861000', location: { lat: 19.050, lng: 72.826 }, isOpen24h: true, hasEmergency: true, rating: 4.8, openHours: '24/7', distance: 3.4, specialties: ['Oncology', 'Cardiology', 'Critical Care'], beds: 320 },
  { _id: 'fac-6', name: 'Wellness Pharmacy Plus', type: 'pharmacy', address: 'Andheri West', city: 'Mumbai', phone: '022-40001234', location: { lat: 19.130, lng: 72.838 }, isOpen24h: false, hasEmergency: false, rating: 4.1, openHours: '7:00 AM – 11:00 PM', distance: 4.5 },
  { _id: 'fac-7', name: 'SRL Diagnostics', type: 'diagnostic', address: 'Malad East', city: 'Mumbai', phone: '022-60001900', location: { lat: 19.187, lng: 72.864 }, isOpen24h: false, hasEmergency: false, rating: 4.4, openHours: '6:00 AM – 10:00 PM', distance: 5.2 },
  { _id: 'fac-8', name: 'Fortis Medical Center', type: 'hospital', address: 'Mulund West', city: 'Mumbai', phone: '022-21801800', location: { lat: 19.175, lng: 72.957 }, isOpen24h: true, hasEmergency: true, rating: 4.6, openHours: '24/7', distance: 6.1, specialties: ['Pediatrics', 'Orthopedics', 'Obstetrics'], beds: 280 },
];

function FacilityCard({ facility }: { facility: HealthcareFacility }) {
  const cfg = TYPE_CONFIG[facility.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.clinic;
  const isOpenNow = facility.isOpen24h || (() => {
    const now = new Date();
    const h = now.getHours();
    return h >= 8 && h < 20;
  })();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-start gap-4 mb-3">
        <div className={`w-12 h-12 ${cfg.bg} rounded-2xl flex items-center justify-center shrink-0`}>
          <cfg.icon className={`w-6 h-6 ${cfg.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-gray-900 text-sm leading-tight">{facility.name}</h3>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${cfg.badge}`}>
              {cfg.label}
            </span>
          </div>
          {facility.address && (
            <p className="text-xs text-gray-400 mt-1 flex items-start gap-1">
              <MapPin className="w-3 h-3 mt-0.5 shrink-0" /> {facility.address}, {facility.city}
            </p>
          )}
        </div>
      </div>

      {/* Status row */}
      <div className="flex items-center gap-3 mb-3">
        <span className={`flex items-center gap-1.5 text-xs font-semibold ${isOpenNow ? 'text-green-600' : 'text-red-500'}`}>
          <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-green-500' : 'bg-red-400'}`} />
          {isOpenNow ? 'Open Now' : 'Closed'}
        </span>
        {facility.isOpen24h && <span className="text-xs text-gray-400">• 24/7</span>}
        {facility.hasEmergency && (
          <span className="flex items-center gap-1 text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" /> Emergency
          </span>
        )}
        <span className="ml-auto flex items-center gap-1 text-xs text-gray-500">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {facility.rating?.toFixed(1)}
        </span>
      </div>

      {/* Distance + hours */}
      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
        {facility.distance && (
          <span className="flex items-center gap-1">
            <Navigation className="w-3 h-3" /> {facility.distance} km away
          </span>
        )}
        {facility.openHours && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {facility.openHours}
          </span>
        )}
        {facility.beds && <span>🛏 {facility.beds} beds</span>}
      </div>

      {/* Specialties */}
      {facility.specialties && facility.specialties.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-4">
          {facility.specialties.slice(0, 3).map(s => (
            <span key={s} className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.name + ' ' + facility.city)}`}
          target="_blank"
          rel="noopener noreferrer"
          id={`directions-${facility._id}`}
          className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold py-2 rounded-xl hover:bg-blue-100 transition-all"
        >
          <Navigation className="w-3.5 h-3.5" /> Directions
        </a>
        {facility.phone && (
          <a
            href={`tel:${facility.phone}`}
            id={`call-${facility._id}`}
            className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 text-xs font-semibold rounded-xl hover:bg-green-100 transition-all"
          >
            <Phone className="w-3.5 h-3.5" /> Call
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function NearbyCare() {
  const [facilities, setFacilities] = useState<HealthcareFacility[]>(DEMO_FACILITIES);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<typeof FACILITY_TYPES[number]>('all');
  const [search, setSearch] = useState('');
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationAllowed(true);
          setShowLocationPrompt(false);
          loadFacilities(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          setShowLocationPrompt(false);
          loadFacilities();
        }
      );
    } else {
      setShowLocationPrompt(false);
      loadFacilities();
    }
  };

  const loadFacilities = async (lat?: number, lng?: number) => {
    try {
      const params: Record<string, string> = {};
      if (lat) params.lat = String(lat);
      if (lng) params.lng = String(lng);
      const { data } = await facilitiesApi.getNearby(params);
      if (data.facilities?.length > 0) setFacilities(data.facilities);
    } catch { /* Use demo */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    // Load demo data immediately without waiting for location
    setTimeout(() => setLoading(false), 800);
  }, []);

  const filtered = facilities.filter(f => {
    const matchType = activeType === 'all' || f.type === activeType;
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.city?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const stats = {
    hospitals: facilities.filter(f => f.type === 'hospital').length,
    emergency: facilities.filter(f => f.hasEmergency).length,
    open24h: facilities.filter(f => f.isOpen24h).length,
    pharmacies: facilities.filter(f => f.type === 'pharmacy').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-1 flex items-center gap-3">
              <MapPin className="w-7 h-7" /> Nearby Healthcare
            </h1>
            <p className="text-teal-100 text-sm">Find hospitals, clinics, pharmacies and diagnostic centers near you</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Location permission prompt */}
          {showLocationPrompt && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900">Allow Location Access?</p>
                  <p className="text-xs text-blue-700 mt-0.5">Enable location to find healthcare facilities nearest to you. Your location is used locally and not stored.</p>
                  <div className="flex items-start gap-2 mt-2">
                    <Shield className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-600">Your precise location is never stored on our servers.</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={requestLocation} id="allow-location-btn"
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-all">Allow</button>
                <button onClick={() => { setShowLocationPrompt(false); loadFacilities(); }}
                  className="p-2 text-blue-400 hover:text-blue-600 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Hospitals', value: stats.hospitals, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Emergency', value: stats.emergency, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'Open 24/7', value: stats.open24h, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Pharmacies', value: stats.pharmacies, color: 'text-teal-600', bg: 'bg-teal-50' },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} rounded-2xl p-3 text-center`}>
                <p className={`text-xl font-display font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 mb-6 flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-48 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search facilities..." className="form-input pl-9 py-2.5" id="facility-search" />
            </div>
            <div className="flex gap-2">
              {FACILITY_TYPES.map(type => (
                <button key={type} onClick={() => setActiveType(type)} id={`filter-${type}`}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${activeType === type ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'}`}>
                  {type === 'all' ? 'All' : TYPE_CONFIG[type as keyof typeof TYPE_CONFIG]?.label || type}
                </button>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-gradient-to-br from-blue-100 via-teal-50 to-green-100 rounded-2xl h-48 mb-6 flex items-center justify-center border border-blue-200 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="absolute w-px bg-gray-300" style={{ left: `${12.5 * (i + 1)}%`, top: 0, bottom: 0 }} />
              ))}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="absolute h-px bg-gray-300" style={{ top: `${20 * (i + 1)}%`, left: 0, right: 0 }} />
              ))}
            </div>
            {/* Mock pins */}
            {[
              { x: '30%', y: '40%', type: 'hospital', label: 'City General' },
              { x: '50%', y: '35%', type: 'clinic', label: 'Apollo Clinic' },
              { x: '20%', y: '60%', type: 'pharmacy', label: 'MedPlus' },
              { x: '65%', y: '55%', type: 'diagnostic', label: 'LabCorp' },
            ].map((pin, i) => (
              <div key={i} className="absolute flex flex-col items-center" style={{ left: pin.x, top: pin.y }}>
                <div className={`w-8 h-8 ${pin.type === 'hospital' ? 'bg-red-500' : pin.type === 'pharmacy' ? 'bg-green-500' : pin.type === 'diagnostic' ? 'bg-purple-500' : 'bg-blue-500'} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}>
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full shadow mt-1 whitespace-nowrap">{pin.label}</div>
              </div>
            ))}
            {/* You are here */}
            <div className="absolute" style={{ left: '45%', top: '50%' }}>
              <div className="w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">You</div>
              <div className="absolute inset-0 w-20 h-20 -translate-x-1/4 -translate-y-1/4 bg-blue-400/20 rounded-full animate-ping" />
            </div>
            <div className="absolute bottom-3 right-3">
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow text-xs text-gray-600">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                Demo map — Enable location for real positions
              </div>
            </div>
          </div>

          {/* Facilities grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
                  <div className="skeleton h-12 w-12 rounded-2xl mb-4" />
                  <div className="skeleton h-4 w-3/4 rounded mb-2" />
                  <div className="skeleton h-3 w-1/2 rounded mb-4" />
                  <div className="skeleton h-8 rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.sort((a, b) => (a.distance || 99) - (b.distance || 99)).map((fac, i) => (
                <motion.div key={fac._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <FacilityCard facility={fac} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
