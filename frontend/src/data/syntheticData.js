// ============================================
// PawPulse Synthetic Data
// All data is fabricated for demo purposes.
// Matches the mockup KPIs and chart shapes.
// ============================================

// Helper: generate random number in range
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ---- KPI CARDS ----
export const kpiData = {
  consultations30d: 1842,
  consultationsChange: 12.4,
  avgReferralTatHours: 3.1,
  rxCompliancePct: 78,
  repeatVisitRate: 34,
  repeatVisitChange: 3.0,
  noShowRate: 9.2,
  noShowChange: -1.1,
  revenue30d: 640000, // Rs 6.4 Lakh
  revenueChange: 8.7,
  totalPets: 3245,
  totalDogs: 2013,
  totalCats: 1006,
  totalOther: 226,
};

// ---- DAILY CONSULTATIONS (30 days) ----
export const dailyConsultations = (() => {
  const data = [];
  const base = [28, 32, 35, 38, 42, 45, 48, 40, 44, 50, 53, 48, 45, 50, 55, 52, 58, 54, 50, 56, 60, 55, 58, 62, 55, 60, 65, 58, 62, 68];
  
  for (let i = 0; i < 30; i++) {
    const day = i + 1;
    const count = base[i] + rand(-3, 5);
    
    // Calculate 7-day moving average
    let sum = 0;
    let n = 0;
    for (let j = Math.max(0, i - 6); j <= i; j++) {
      sum += base[j] + rand(-1, 1);
      n++;
    }
    const movingAvg = Math.round((sum / n) * 10) / 10;
    
    data.push({ day, count, movingAvg });
  }
  return data;
})();

// ---- BY SERVICE TYPE ----
export const byServiceType = [
  { name: 'Teleconsult', value: 920, fill: '#818cf8' },
  { name: 'Home Visit', value: 410, fill: '#22d3ee' },
  { name: 'Clinic', value: 512, fill: '#34d399' },
];

// ---- SPECIES MIX ----
export const speciesMix = [
  { name: 'Dog', value: 62, count: 2013, fill: '#818cf8' },
  { name: 'Cat', value: 31, count: 1006, fill: '#22d3ee' },
  { name: 'Other', value: 7, count: 226, fill: '#a0a0b8' },
];

// ---- REFERRAL TAT BY CLINIC ----
export const referralTatByClinic = [
  { clinic: 'Clinic A', tat: 2.1, breached: false },
  { clinic: 'Clinic B', tat: 2.8, breached: false },
  { clinic: 'Clinic C', tat: 3.4, breached: false },
  { clinic: 'Clinic D', tat: 4.6, breached: true },
  { clinic: 'Clinic E', tat: 5.2, breached: true },
];

// ---- RX COMPLIANCE BY WEEK ----
export const rxComplianceByWeek = [
  { week: 'W1', compliance: 62 },
  { week: 'W2', compliance: 65 },
  { week: 'W3', compliance: 68 },
  { week: 'W4', compliance: 70 },
  { week: 'W5', compliance: 72 },
  { week: 'W6', compliance: 75 },
  { week: 'W7', compliance: 78 },
  { week: 'W8', compliance: 80 },
];

// ---- TOP PERFORMING VETS ----
export const topPerformingVets = [
  { name: 'Dr. Ananya Sharma', specialization: 'General', clinic: 'PawCare Mumbai', consults: 287, rating: 4.9 },
  { name: 'Dr. Vikram Patel', specialization: 'Surgery', clinic: 'VetLife Pune', consults: 245, rating: 4.8 },
  { name: 'Dr. Priya Nair', specialization: 'Dermatology', clinic: 'PetFirst Bangalore', consults: 223, rating: 4.8 },
  { name: 'Dr. Rahul Desai', specialization: 'Internal Medicine', clinic: 'PawCare Delhi', consults: 198, rating: 4.7 },
  { name: 'Dr. Meera Iyer', specialization: 'Oncology', clinic: 'VetLife Chennai', consults: 176, rating: 4.9 },
  { name: 'Dr. Arjun Reddy', specialization: 'Orthopedics', clinic: 'PetFirst Hyderabad', consults: 165, rating: 4.6 },
  { name: 'Dr. Sneha Kulkarni', specialization: 'Cardiology', clinic: 'PawCare Mumbai', consults: 154, rating: 4.7 },
  { name: 'Dr. Karthik Menon', specialization: 'General', clinic: 'VetLife Pune', consults: 143, rating: 4.5 },
];

// ---- BEST PERFORMING CLINICS ----
export const bestPerformingClinics = [
  { name: 'PawCare Mumbai', consults: 441, revenue: 185000, city: 'Mumbai' },
  { name: 'VetLife Pune', consults: 388, revenue: 162000, city: 'Pune' },
  { name: 'PetFirst Bangalore', consults: 334, revenue: 140000, city: 'Bangalore' },
  { name: 'PawCare Delhi', consults: 298, revenue: 125000, city: 'Delhi' },
  { name: 'VetLife Chennai', consults: 210, revenue: 88000, city: 'Chennai' },
  { name: 'PetFirst Hyderabad', consults: 171, revenue: 72000, city: 'Hyderabad' },
];

// ---- PET PARENTS BY LOCATION ----
export const petParentsByLocation = [
  { city: 'Mumbai', count: 842 },
  { city: 'Bangalore', count: 625 },
  { city: 'Delhi', count: 534 },
  { city: 'Pune', count: 412 },
  { city: 'Chennai', count: 345 },
  { city: 'Hyderabad', count: 298 },
  { city: 'Kolkata', count: 187 },
  { city: 'Ahmedabad', count: 156 },
  { city: 'Jaipur', count: 98 },
  { city: 'Lucknow', count: 72 },
];

// ---- MOST SOLD SERVICES ----
export const mostSoldServices = [
  { name: 'Teleconsult', count: 920, revenue: 276000 },
  { name: 'Clinic Visit', count: 512, revenue: 204800 },
  { name: 'Home Visit', count: 410, revenue: 159900 },
  { name: 'Vaccination', count: 345, revenue: 103500 },
  { name: 'Grooming', count: 298, revenue: 59600 },
  { name: 'Lab Tests', count: 212, revenue: 84800 },
  { name: 'Surgery', count: 87, revenue: 348000 },
];

// ---- DEMO USER ACCOUNTS ----
export const demoUsers = {
  admin: {
    email: 'admin@pawpulse.in',
    password: 'admin123',
    name: 'Dr. Soham (Admin)',
    role: 'ADMIN',
  },
  coordinator: {
    email: 'coordinator@pawpulse.in',
    password: 'coord123',
    name: 'Priya Nair',
    role: 'COORDINATOR',
  },
  vet: {
    email: 'vet@pawpulse.in',
    password: 'vet123',
    name: 'Dr. Ananya Sharma',
    role: 'VET',
  },
  owner: {
    email: 'owner@pawpulse.in',
    password: 'owner123',
    name: 'Rahul Mehta',
    role: 'OWNER',
  },
};

// ---- SAMPLE APPOINTMENTS (for Vet Console & Owner Portal) ----
export const sampleAppointments = [
  {
    id: '1',
    petName: 'Bruno',
    petSpecies: 'dog',
    ownerName: 'Rahul Mehta',
    vetName: 'Dr. Ananya Sharma',
    clinic: 'PawCare Mumbai',
    serviceType: 'teleconsult',
    status: 'completed',
    scheduledAt: '2026-10-18T10:00:00',
    notes: 'Routine checkup. Pet is healthy. Prescribed multivitamins.',
  },
  {
    id: '2',
    petName: 'Whiskers',
    petSpecies: 'cat',
    ownerName: 'Sneha Iyer',
    vetName: 'Dr. Ananya Sharma',
    clinic: 'PawCare Mumbai',
    serviceType: 'clinic',
    status: 'booked',
    scheduledAt: '2026-10-18T14:30:00',
    notes: '',
  },
  {
    id: '3',
    petName: 'Max',
    petSpecies: 'dog',
    ownerName: 'Arjun Singh',
    vetName: 'Dr. Vikram Patel',
    clinic: 'VetLife Pune',
    serviceType: 'home_visit',
    status: 'completed',
    scheduledAt: '2026-10-17T11:00:00',
    notes: 'Skin infection detected. Prescribed medicated shampoo and antibiotics.',
  },
  {
    id: '4',
    petName: 'Coco',
    petSpecies: 'dog',
    ownerName: 'Priya Kulkarni',
    vetName: 'Dr. Ananya Sharma',
    clinic: 'PawCare Mumbai',
    serviceType: 'teleconsult',
    status: 'no_show',
    scheduledAt: '2026-10-17T15:00:00',
    notes: '',
  },
  {
    id: '5',
    petName: 'Milo',
    petSpecies: 'cat',
    ownerName: 'Karthik Menon',
    vetName: 'Dr. Priya Nair',
    clinic: 'PetFirst Bangalore',
    serviceType: 'clinic',
    status: 'booked',
    scheduledAt: '2026-10-19T09:00:00',
    notes: '',
  },
  {
    id: '6',
    petName: 'Rocky',
    petSpecies: 'dog',
    ownerName: 'Vikram Desai',
    vetName: 'Dr. Rahul Desai',
    clinic: 'PawCare Delhi',
    serviceType: 'home_visit',
    status: 'booked',
    scheduledAt: '2026-10-19T16:00:00',
    notes: '',
  },
  {
    id: '7',
    petName: 'Simba',
    petSpecies: 'cat',
    ownerName: 'Meera Sharma',
    vetName: 'Dr. Meera Iyer',
    clinic: 'VetLife Chennai',
    serviceType: 'teleconsult',
    status: 'completed',
    scheduledAt: '2026-10-16T12:00:00',
    notes: 'Digestive issues. Switched to hypoallergenic diet.',
  },
  {
    id: '8',
    petName: 'Polly',
    petSpecies: 'bird',
    ownerName: 'Anita Joshi',
    vetName: 'Dr. Sneha Kulkarni',
    clinic: 'PawCare Mumbai',
    serviceType: 'clinic',
    status: 'completed',
    scheduledAt: '2026-10-16T10:30:00',
    notes: 'Wing injury treated. Follow-up in 2 weeks.',
  },
];

// ---- SAMPLE REFERRALS (for Coordinator View) ----
export const sampleReferrals = [
  {
    id: '1',
    petName: 'Bruno',
    ownerName: 'Rahul Mehta',
    fromVet: 'Dr. Ananya Sharma',
    toVet: 'Dr. Vikram Patel',
    toClinic: 'VetLife Pune',
    reason: 'Suspected ligament tear — needs orthopedic assessment',
    status: 'accepted',
    referredAt: '2026-10-15T10:00:00',
    acceptedAt: '2026-10-15T12:05:00',
    tatHours: 2.1,
  },
  {
    id: '2',
    petName: 'Max',
    ownerName: 'Arjun Singh',
    fromVet: 'Dr. Vikram Patel',
    toVet: 'Dr. Priya Nair',
    toClinic: 'PetFirst Bangalore',
    reason: 'Chronic skin condition — dermatology specialist needed',
    status: 'referred',
    referredAt: '2026-10-18T09:30:00',
    acceptedAt: null,
    tatHours: null,
  },
  {
    id: '3',
    petName: 'Simba',
    ownerName: 'Meera Sharma',
    fromVet: 'Dr. Meera Iyer',
    toVet: 'Dr. Sneha Kulkarni',
    toClinic: 'PawCare Mumbai',
    reason: 'Heart murmur detected — cardiology referral',
    status: 'completed',
    referredAt: '2026-10-12T14:00:00',
    acceptedAt: '2026-10-12T18:30:00',
    tatHours: 4.5,
  },
  {
    id: '4',
    petName: 'Coco',
    ownerName: 'Priya Kulkarni',
    fromVet: 'Dr. Ananya Sharma',
    toVet: 'Dr. Arjun Reddy',
    toClinic: 'PetFirst Hyderabad',
    reason: 'Post-fracture follow-up — orthopedic review',
    status: 'accepted',
    referredAt: '2026-10-14T11:00:00',
    acceptedAt: '2026-10-14T13:45:00',
    tatHours: 2.75,
  },
];

// ---- SAMPLE PETS (for Owner Portal) ----
export const samplePets = [
  {
    id: '1',
    name: 'Bruno',
    species: 'dog',
    breed: 'Golden Retriever',
    dob: '2022-03-15',
    weightKg: 32,
    ownerName: 'Rahul Mehta',
  },
  {
    id: '2',
    name: 'Whiskers',
    species: 'cat',
    breed: 'Persian',
    dob: '2023-07-22',
    weightKg: 4.5,
    ownerName: 'Sneha Iyer',
  },
  {
    id: '3',
    name: 'Max',
    species: 'dog',
    breed: 'German Shepherd',
    dob: '2021-11-08',
    weightKg: 38,
    ownerName: 'Arjun Singh',
  },
  {
    id: '4',
    name: 'Polly',
    species: 'bird',
    breed: 'Cockatiel',
    dob: '2024-01-10',
    weightKg: 0.09,
    ownerName: 'Anita Joshi',
  },
];

// ---- SAMPLE PRESCRIPTIONS ----
export const samplePrescriptions = [
  {
    id: '1',
    appointmentId: '1',
    petName: 'Bruno',
    medication: 'Multivitamin Supplement',
    dosage: '1 tablet daily',
    durationDays: 30,
    uploaded: true,
    prescribedAt: '2026-10-18T10:30:00',
  },
  {
    id: '2',
    appointmentId: '3',
    petName: 'Max',
    medication: 'Cephalexin 500mg',
    dosage: '2 tablets daily',
    durationDays: 14,
    uploaded: true,
    prescribedAt: '2026-10-17T11:30:00',
  },
  {
    id: '3',
    appointmentId: '3',
    petName: 'Max',
    medication: 'Medicated Shampoo',
    dosage: 'Bathe twice weekly',
    durationDays: 28,
    uploaded: false,
    prescribedAt: '2026-10-17T11:30:00',
  },
  {
    id: '4',
    appointmentId: '7',
    petName: 'Simba',
    medication: 'Hypoallergenic Diet Plan',
    dosage: 'As directed',
    durationDays: 60,
    uploaded: true,
    prescribedAt: '2026-10-16T12:30:00',
  },
];
