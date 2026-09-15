const DEMO_FACILITIES = [
  {
    _id: 'fac-1',
    name: 'City General Hospital',
    type: 'hospital',
    address: 'MG Road, Near Central Park',
    city: 'Mumbai',
    phone: '022-28001200',
    location: { lat: 19.076, lng: 72.877 },
    isOpen24h: true,
    hasEmergency: true,
    rating: 4.5,
    openHours: '24/7',
    distance: 1.2,
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'],
    beds: 450,
  },
  {
    _id: 'fac-2',
    name: 'Apollo Health Clinic',
    type: 'clinic',
    address: '14 Park Street',
    city: 'Mumbai',
    phone: '022-45001500',
    location: { lat: 19.082, lng: 72.868 },
    isOpen24h: false,
    hasEmergency: false,
    rating: 4.7,
    openHours: '8:00 AM – 8:00 PM',
    distance: 0.8,
  },
  {
    _id: 'fac-3',
    name: 'MedPlus Pharmacy',
    type: 'pharmacy',
    address: '5 Station Road',
    city: 'Mumbai',
    phone: '022-22001100',
    location: { lat: 19.073, lng: 72.880 },
    isOpen24h: true,
    hasEmergency: false,
    rating: 4.3,
    openHours: '24/7',
    distance: 0.3,
  },
  {
    _id: 'fac-4',
    name: 'LabCorp Diagnostic Center',
    type: 'diagnostic',
    address: '22 Health Colony',
    city: 'Mumbai',
    phone: '022-33005500',
    location: { lat: 19.068, lng: 72.874 },
    isOpen24h: false,
    hasEmergency: false,
    rating: 4.6,
    openHours: '6:00 AM – 9:00 PM',
    distance: 2.1,
  },
  {
    _id: 'fac-5',
    name: 'Lilavati Hospital',
    type: 'hospital',
    address: 'Bandra West',
    city: 'Mumbai',
    phone: '022-26861000',
    location: { lat: 19.050, lng: 72.826 },
    isOpen24h: true,
    hasEmergency: true,
    rating: 4.8,
    openHours: '24/7',
    distance: 3.4,
    specialties: ['Oncology', 'Cardiology', 'Critical Care'],
    beds: 320,
  },
];

// GET /api/facilities/nearby
const getNearbyFacilities = async (req, res, next) => {
  try {
    const { type, lat, lng } = req.query;
    let facilities = DEMO_FACILITIES;
    if (type) {
      facilities = facilities.filter(f => f.type === type);
    }
    // Sort by distance
    facilities = facilities.sort((a, b) => a.distance - b.distance);
    res.json({ success: true, facilities });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNearbyFacilities };
