// In-memory data store for Sri Lankan Recovery Lorry operations
// Used when MongoDB is running in fallback development mode or as seamless seed source.

export const initialProviders = [
  {
    _id: 'prov-001',
    userId: 'user-p1',
    businessName: 'Lanka Quick Tow & Flatbed Recovery',
    businessAddress: '142 Kandy Road, Peliyagoda / Colombo',
    phone: '+94771234567',
    description: '24/7 hydraulic flatbed recovery service covering Colombo, Gampaha and Expressway networks.',
    serviceAreas: ['Colombo', 'Peliyagoda', 'Kadawatha', 'Katunayake Expressway', 'Southern Expressway'],
    operatingHours: '24 Hours / 7 Days',
    verificationStatus: 'approved',
    averageRating: 4.9,
    totalRescues: 482
  },
  {
    _id: 'prov-002',
    userId: 'user-p2',
    businessName: 'Highway Angels Rescue Service',
    businessAddress: 'Expressway Interchange, Kottawa',
    phone: '+94719876543',
    description: 'Specialized in E01 Southern Expressway & E02 Outer Circular accident recovery and rapid towing.',
    serviceAreas: ['Kottawa', 'Gelanigama', 'Dodangoda', 'Welipenna', 'Southern Expressway'],
    operatingHours: '24 Hours / 7 Days',
    verificationStatus: 'approved',
    averageRating: 4.8,
    totalRescues: 329
  },
  {
    _id: 'prov-003',
    userId: 'user-p3',
    businessName: 'Kandy Hill Country Auto Rescue',
    businessAddress: 'Peradeniya Road, Kandy',
    phone: '+94754567890',
    description: 'Heavy winch and steep gradient tilt-tray recovery for Kandy, Nuwara Eliya, and Central hills.',
    serviceAreas: ['Kandy', 'Peradeniya', 'Katugastota', 'Gampola', 'Kadugannawa'],
    operatingHours: '24 Hours / 7 Days',
    verificationStatus: 'approved',
    averageRating: 4.9,
    totalRescues: 215
  },
  {
    _id: 'prov-004',
    userId: 'user-p4',
    businessName: 'Southern Coastline Recovery & Towing',
    businessAddress: 'Pinnaduwa Expressway Exit, Galle',
    phone: '+94762345678',
    description: 'Reliable flatbed recovery along Galle, Unawatuna, Hikkaduwa, and Southern Expressway.',
    serviceAreas: ['Galle', 'Hikkaduwa', 'Unawatuna', 'Pinnaduwa', 'Matara'],
    operatingHours: '24 Hours / 7 Days',
    verificationStatus: 'approved',
    averageRating: 4.7,
    totalRescues: 184
  },
  {
    _id: 'prov-005',
    userId: 'user-p5',
    businessName: 'Wayamba Heavy Winch & Tow Solutions',
    businessAddress: 'Colombo Road, Kurunegala',
    phone: '+94783456789',
    description: 'Accident recovery, wheel-lift, and heavy flatbed for Wayamba & Central Expressway corridor.',
    serviceAreas: ['Kurunegala', 'Mirigama', 'Narammala', 'Pothuhera'],
    operatingHours: '24 Hours / 7 Days',
    verificationStatus: 'approved',
    averageRating: 4.8,
    totalRescues: 142
  }
];

export const initialVehicles = [
  {
    _id: 'veh-001',
    providerId: 'prov-001',
    registrationNumber: 'WP LF-8241',
    vehicleType: 'Hydraulic Flatbed (Tilt Tray)',
    make: 'Isuzu',
    model: 'Forward FTR 12T',
    capacity: 'Cars, SUVs, Vans, Luxury Sedans, EVs (up to 5 Tons)',
    images: ['/images/flatbed_lorry.jpg'],
    baseFee: 4500,
    pricePerKm: 200,
    availabilityStatus: 'available',
    currentLocation: { type: 'Point', coordinates: [79.8612, 6.9271] }, // Colombo Fort
    locationUpdatedAt: new Date(),
    serviceAreas: ['Colombo', 'Peliyagoda', 'Kelaniya', 'Kadawatha'],
    isActive: true,
    driverName: 'Nuwan Perera',
    driverPhone: '+94771234567',
    features: ['Hydraulic Slide Bed', 'Electric Winch', 'Soft-Wheel Straps', 'Jumpstart Kit', 'Air Compressor']
  },
  {
    _id: 'veh-002',
    providerId: 'prov-002',
    registrationNumber: 'WP LG-3190',
    vehicleType: 'Rapid Response Flatbed Recovery',
    make: 'Mitsubishi Fuso',
    model: 'Canter Tilt-Tray',
    capacity: 'Sedans, Hatchbacks, SUVs (up to 3.5 Tons)',
    images: ['/images/hero_recovery_lorry.jpg'],
    baseFee: 4000,
    pricePerKm: 180,
    availabilityStatus: 'available',
    currentLocation: { type: 'Point', coordinates: [79.9575, 6.8415] }, // Kottawa (Expressway interchange)
    locationUpdatedAt: new Date(),
    serviceAreas: ['Kottawa', 'Maharagama', 'Homagama', 'Southern Expressway E01'],
    isActive: true,
    driverName: 'Sunil Rathnayake',
    driverPhone: '+94719876543',
    features: ['High-Speed Expressway Spec', 'Dual Amber Light Bar', 'Hydraulic Winch', 'Wheel Chocks']
  },
  {
    _id: 'veh-003',
    providerId: 'prov-003',
    registrationNumber: 'CP LF-5512',
    vehicleType: 'Hill-Country Heavy Winch Recovery',
    make: 'Hino',
    model: '500 Series Crane & Flatbed',
    capacity: 'All Passenger Vehicles, Pickups & Light Trucks (up to 6 Tons)',
    images: ['/images/flatbed_lorry.jpg'],
    baseFee: 5000,
    pricePerKm: 220,
    availabilityStatus: 'available',
    currentLocation: { type: 'Point', coordinates: [80.6337, 7.2906] }, // Kandy Town
    locationUpdatedAt: new Date(),
    serviceAreas: ['Kandy', 'Peradeniya', 'Katugastota', 'Kadugannawa'],
    isActive: true,
    driverName: 'Bandara Jayasundara',
    driverPhone: '+94754567890',
    features: ['10-Ton Rescue Winch', 'Hiab Boom Crane', 'Off-Road Cable Rigging', 'Tire Support']
  },
  {
    _id: 'veh-004',
    providerId: 'prov-004',
    registrationNumber: 'SP LH-1098',
    vehicleType: 'Coastal Highway Flatbed Lorry',
    make: 'Isuzu',
    model: 'Elf Slide-Bed',
    capacity: 'Cars, SUVs, Tourist Vans (up to 4 Tons)',
    images: ['/images/hero_recovery_lorry.jpg'],
    baseFee: 3800,
    pricePerKm: 190,
    availabilityStatus: 'available',
    currentLocation: { type: 'Point', coordinates: [80.2210, 6.0535] }, // Galle Fort
    locationUpdatedAt: new Date(),
    serviceAreas: ['Galle', 'Hikkaduwa', 'Pinnaduwa', 'Unawatuna'],
    isActive: true,
    driverName: 'Dinesh Wickramasinghe',
    driverPhone: '+94762345678',
    features: ['Corrosion Proof Bed', 'Low Clearance Loading', '24/7 Breakdown Crew']
  },
  {
    _id: 'veh-005',
    providerId: 'prov-005',
    registrationNumber: 'NW LF-6420',
    vehicleType: 'Heavy Wheel-Lift & Flatbed Tow',
    make: 'Tata',
    model: 'Ultra Recovery',
    capacity: 'Cars, Jeeps, Delivery Lorries (up to 5.5 Tons)',
    images: ['/images/flatbed_lorry.jpg'],
    baseFee: 4200,
    pricePerKm: 185,
    availabilityStatus: 'available',
    currentLocation: { type: 'Point', coordinates: [80.3629, 7.4863] }, // Kurunegala Town
    locationUpdatedAt: new Date(),
    serviceAreas: ['Kurunegala', 'Central Expressway E04', 'Mirigama'],
    isActive: true,
    driverName: 'Chaminda Silva',
    driverPhone: '+94783456789',
    features: ['Under-lift boom', 'Tilt slide bed', 'Night searchlights', 'Emergency fuel supply']
  },
  {
    _id: 'veh-006',
    providerId: 'prov-001',
    registrationNumber: 'WP LF-9902',
    vehicleType: 'Airport Expressway Rapid Lorry',
    make: 'Isuzu',
    model: 'NPR Flatbed',
    capacity: 'Cars, Vans, Hybrid & EV Vehicles',
    images: ['/images/hero_recovery_lorry.jpg'],
    baseFee: 4000,
    pricePerKm: 190,
    availabilityStatus: 'available',
    currentLocation: { type: 'Point', coordinates: [79.8997, 7.0873] }, // Ja-Ela / Airport Expressway
    locationUpdatedAt: new Date(),
    serviceAreas: ['Ja-Ela', 'Katunayake', 'Negombo', 'Wattala'],
    isActive: true,
    driverName: 'Roshan Fernando',
    driverPhone: '+94773456123',
    features: ['Expressway Approved', 'Low Angle Ramp', 'Motorcycle Chock Racks']
  }
];

export const initialBookings = [
  {
    _id: 'book-001',
    bookingReference: 'RN-LK-8942',
    customerId: 'user-c1',
    providerId: 'prov-001',
    recoveryVehicleId: 'veh-001',
    customerName: 'Kamal Gunawardena',
    customerPhone: '+94778899001',
    customerVehicleDetails: 'Toyota Prius (WP CAD-4421) - White',
    issueType: 'Engine Breakdown / Hybrid Warning',
    issueDescription: 'Car suddenly lost power and warning lights came on near Peliyagoda flyover.',
    pickupLocation: {
      address: 'Peliyagoda Flyover, Kandy Road',
      latitude: 6.9620,
      longitude: 79.8890
    },
    destinationLocation: {
      address: 'Toyota Lanka Service Center, Wattala',
      latitude: 6.9850,
      longitude: 79.8920
    },
    estimatedDistanceKm: 6.5,
    estimatedPrice: 5800,
    status: 'completed',
    statusHistory: [
      { status: 'pending', changedAt: new Date(Date.now() - 7200000), note: 'Booking submitted' },
      { status: 'accepted', changedAt: new Date(Date.now() - 6600000), note: 'Provider accepted' },
      { status: 'on_the_way', changedAt: new Date(Date.now() - 5400000), note: 'Driver dispatched' },
      { status: 'arrived', changedAt: new Date(Date.now() - 4200000), note: 'Lorry arrived at scene' },
      { status: 'completed', changedAt: new Date(Date.now() - 1800000), note: 'Safely delivered to Toyota Wattala' }
    ],
    createdAt: new Date(Date.now() - 7200000)
  }
];

class MockStore {
  constructor() {
    this.providers = [...initialProviders];
    this.vehicles = [...initialVehicles];
    this.bookings = [...initialBookings];
    this.users = [
      {
        _id: 'user-c1',
        fullName: 'Demo Customer (Kamal)',
        email: 'customer@rescuenow.lk',
        phone: '+94778899001',
        role: 'customer',
        accountStatus: 'active'
      },
      {
        _id: 'user-p1',
        fullName: 'Nuwan Perera (Lanka Quick Tow)',
        email: 'provider@rescuenow.lk',
        phone: '+94771234567',
        role: 'provider',
        accountStatus: 'active'
      },
      {
        _id: 'user-admin',
        fullName: 'RescueNow Admin',
        email: 'admin@rescuenow.lk',
        phone: '+94112345678',
        role: 'admin',
        accountStatus: 'active'
      }
    ];
  }

  // Haversine formula distance calculation in kilometers
  calcDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  }

  getNearbyVehicles(latitude, longitude, radiusKm = 50) {
    const results = [];
    for (const vehicle of this.vehicles) {
      if (!vehicle.isActive) continue;
      const [vLon, vLat] = vehicle.currentLocation.coordinates;
      const distanceKm = this.calcDistanceKm(latitude, longitude, vLat, vLon);

      if (distanceKm <= radiusKm) {
        const provider = this.providers.find(p => p._id === vehicle.providerId);
        results.push({
          ...vehicle,
          distanceKm,
          estimatedMinutes: Math.max(5, Math.round(distanceKm * 2.2)),
          provider: provider ? {
            _id: provider._id,
            businessName: provider.businessName,
            phone: provider.phone,
            averageRating: provider.averageRating,
            verificationStatus: provider.verificationStatus,
            totalRescues: provider.totalRescues
          } : null
        });
      }
    }
    return results.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  createBooking(bookingData) {
    const ref = `RN-LK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      _id: `book-${Date.now()}`,
      bookingReference: ref,
      status: 'pending',
      createdAt: new Date(),
      statusHistory: [
        { status: 'pending', changedAt: new Date(), note: 'Rescue request created' }
      ],
      ...bookingData
    };
    this.bookings.unshift(newBooking);

    // mark vehicle as busy
    const vehicle = this.vehicles.find(v => v._id === bookingData.recoveryVehicleId);
    if (vehicle) {
      vehicle.availabilityStatus = 'busy';
    }

    return newBooking;
  }

  updateBookingStatus(bookingId, newStatus, note = '') {
    const booking = this.bookings.find(b => b._id === bookingId || b.bookingReference === bookingId);
    if (!booking) return null;

    booking.status = newStatus;
    booking.statusHistory.push({
      status: newStatus,
      changedAt: new Date(),
      note: note || `Status updated to ${newStatus}`
    });

    if (newStatus === 'accepted') booking.acceptedAt = new Date();
    if (newStatus === 'completed') {
      booking.completedAt = new Date();
      const vehicle = this.vehicles.find(v => v._id === booking.recoveryVehicleId);
      if (vehicle) vehicle.availabilityStatus = 'available';
    }
    if (newStatus === 'cancelled' || newStatus === 'rejected') {
      const vehicle = this.vehicles.find(v => v._id === booking.recoveryVehicleId);
      if (vehicle) vehicle.availabilityStatus = 'available';
    }

    return booking;
  }

  getBookingById(id) {
    return this.bookings.find(b => b._id === id || b.bookingReference === id);
  }

  getAllBookings() {
    return this.bookings;
  }

  updateVehicleLocation(vehicleId, latitude, longitude) {
    const v = this.vehicles.find(item => item._id === vehicleId);
    if (v) {
      v.currentLocation = { type: 'Point', coordinates: [Number(longitude), Number(latitude)] };
      v.locationUpdatedAt = new Date();
      return v;
    }
    return null;
  }

  updateVehicleAvailability(vehicleId, status) {
    const v = this.vehicles.find(item => item._id === vehicleId);
    if (v) {
      v.availabilityStatus = status;
      if (status === 'available') v.locationUpdatedAt = new Date();
      return v;
    }
    return null;
  }
}

export const mockStore = new MockStore();
