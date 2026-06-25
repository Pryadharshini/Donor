// COUNTRIES, STATES, DISTRICTS, CITIES removed — use `country-state-city` library at runtime

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const DONORS = [
  { id: 1, name: 'Rajan Kumar', bloodGroup: 'O+', location: 'Chennai, Tamil Nadu', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', country: 'India', phone: '+91 98765 43210', available: true, lastDonation: '2024-12-15', age: 28, gender: 'Male', donations: 8 },
  { id: 2, name: 'Priya Devi', bloodGroup: 'A+', location: 'Coimbatore, Tamil Nadu', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', country: 'India', phone: '+91 87654 32109', available: true, lastDonation: '2025-01-20', age: 25, gender: 'Female', donations: 5 },
  { id: 3, name: 'Suresh Babu', bloodGroup: 'B+', location: 'Madurai, Tamil Nadu', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu', country: 'India', phone: '+91 76543 21098', available: false, lastDonation: '2025-02-10', age: 35, gender: 'Male', donations: 12 },
  { id: 4, name: 'Kavitha S', bloodGroup: 'AB+', location: 'Bangalore, Karnataka', city: 'Bangalore', district: 'Bangalore', state: 'Karnataka', country: 'India', phone: '+91 65432 10987', available: true, lastDonation: '2024-11-05', age: 30, gender: 'Female', donations: 3 },
  { id: 5, name: 'Murugan P', bloodGroup: 'O-', location: 'Salem, Tamil Nadu', city: 'Salem', district: 'Salem', state: 'Tamil Nadu', country: 'India', phone: '+91 54321 09876', available: true, lastDonation: '2025-03-01', age: 40, gender: 'Male', donations: 20 },
  { id: 6, name: 'Anitha R', bloodGroup: 'A-', location: 'Trichy, Tamil Nadu', city: 'Trichy', district: 'Trichy', state: 'Tamil Nadu', country: 'India', phone: '+91 43210 98765', available: false, lastDonation: '2024-10-22', age: 27, gender: 'Female', donations: 6 },
  { id: 7, name: 'Vijay Kumar', bloodGroup: 'B-', location: 'Kochi, Kerala', city: 'Kochi', district: 'Kochi', state: 'Kerala', country: 'India', phone: '+91 32109 87654', available: true, lastDonation: '2025-01-15', age: 32, gender: 'Male', donations: 9 },
  { id: 8, name: 'Deepa M', bloodGroup: 'AB-', location: 'Mysore, Karnataka', city: 'Mysore', district: 'Mysore', state: 'Karnataka', country: 'India', phone: '+91 21098 76543', available: true, lastDonation: '2024-12-01', age: 29, gender: 'Female', donations: 4 },
];

export const BLOOD_REQUESTS = [
  { id: 1, patientName: 'Arun S', bloodGroup: 'O+', hospital: 'Apollo Hospital', units: 2, urgency: 'Critical', contact: '+91 98765 11111', city: 'Chennai', status: 'Active', createdAt: '2025-03-10', notes: 'Surgery scheduled tomorrow morning' },
  { id: 2, patientName: 'Baby Girl', bloodGroup: 'A+', hospital: 'AIIMS', units: 1, urgency: 'Urgent', contact: '+91 87654 22222', city: 'Delhi', status: 'Active', createdAt: '2025-03-09', notes: 'Newborn in NICU' },
  { id: 3, patientName: 'Ramesh K', bloodGroup: 'B+', hospital: 'Fortis Hospital', units: 3, urgency: 'Normal', contact: '+91 76543 33333', city: 'Bangalore', status: 'Fulfilled', createdAt: '2025-03-08', notes: 'Thalassemia patient' },
  { id: 4, patientName: 'Meena D', bloodGroup: 'AB+', hospital: 'Vijaya Hospital', units: 2, urgency: 'Urgent', contact: '+91 65432 44444', city: 'Chennai', status: 'Active', createdAt: '2025-03-10', notes: 'Post accident surgery' },
];

export const STATS = {
  totalDonors: 12847,
  livesSaved: 38521,
  activeRequests: 234,
  citiesCovered: 156,
};

export const TESTIMONIALS = [
  { id: 1, name: 'Dr. Selvaraj', role: 'Cardiologist, Apollo Hospital', text: 'Nanbargal Blood Foundation has been instrumental in saving countless lives. Their quick response during emergencies is commendable.', avatar: 'S' },
  { id: 2, name: 'Lakshmi Priya', role: 'Blood Recipient', text: 'When my son needed urgent blood during surgery, Nanbargal connected us with donors within 30 minutes. They saved his life!', avatar: 'L' },
  { id: 3, name: 'Karthik V', role: 'Regular Donor', text: 'I have been donating blood through this platform for 3 years. The process is seamless and knowing I am saving lives motivates me.', avatar: 'K' },
];

export const DONATION_HISTORY = [
  { id: 1, date: '2025-01-15', hospital: 'Apollo Hospital', units: 1, bloodGroup: 'O+', recipient: 'Anonymous', status: 'Completed' },
  { id: 2, date: '2024-09-20', hospital: 'Fortis Hospital', units: 1, bloodGroup: 'O+', recipient: 'Anonymous', status: 'Completed' },
  { id: 3, date: '2024-05-10', hospital: 'AIIMS', units: 1, bloodGroup: 'O+', recipient: 'Anonymous', status: 'Completed' },
];

export const ADMIN_STATS = {
  totalDonors: 12847,
  activeRequests: 234,
  fulfilledRequests: 38287,
  newDonorsThisMonth: 342,
};

export const BLOOD_GROUP_ANALYTICS = [
  { group: 'O+', count: 3842, percentage: 38 },
  { group: 'A+', count: 2569, percentage: 25 },
  { group: 'B+', count: 2056, percentage: 20 },
  { group: 'AB+', count: 770, percentage: 8 },
  { group: 'O-', count: 385, percentage: 4 },
  { group: 'A-', count: 257, percentage: 2.5 },
  { group: 'B-', count: 205, percentage: 2 },
  { group: 'AB-', count: 63, percentage: 0.5 },
];