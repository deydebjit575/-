import { VerifiedHospital } from '../types';

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const JIS_UNIVERSITY_COORDINATES = {
  lat: 22.6845,
  lng: 88.3802,
  name: 'JIS University, Agarpara'
};

export const verifiedPanihatiHospitals: VerifiedHospital[] = [
  {
    id: 'pan-01',
    name: 'Panihati State General Hospital',
    nameBn: 'পানিহাটি স্টেট জেনারেল হাসপাতাল',
    type: 'Hospital',
    area: 'Panihati',
    locality: 'Panihati / Sodepur',
    address: 'Nilgunj Road, Barasat Road Crossing, Panihati, Kolkata, West Bengal 700114',
    phone: '033 2553 1243',
    distanceKm: 1.1,
    distanceFromJisKm: 2.3,
    travelTimeMins: 4,
    latitude: 22.6958,
    longitude: 88.3742,
    mapsUrl: 'https://maps.google.com/?q=Panihati+State+General+Hospital',
    verifiedDate: 'April 2026',
    rating: 4.1,
    openHours: 'Open 24x7 (Emergency & IPD)',
    specialities: ['24x7 Emergency Care', 'General Medicine', 'General Surgery', 'Obstetrics & Gynecology', 'Pediatrics'],
    isVerifiedPartner: true,
    emergencyAvailable: true,
    totalBeds: 150,
    availableBeds: 18,
    icuBedsAvailable: 2,
    isBedVerified: true,
    bedSource: 'Hospital Duty MO Portal',
    lastBedUpdate: '15 mins ago'
  },
  {
    id: 'pan-02',
    name: 'College of Medicine & Sagore Dutta Hospital (CMSDH)',
    nameBn: 'সাগর দত্ত মেডিকেল কলেজ ও হাসপাতাল',
    type: 'Medical College & Hospital',
    area: 'Panihati',
    locality: 'Kamarhati / Agarpara',
    address: '578, B.T. Road, Kamarhati, Kolkata, West Bengal 700058 (Near Agarpara)',
    phone: '033 2583 5435',
    distanceKm: 3.4,
    distanceFromJisKm: 2.1,
    travelTimeMins: 8,
    latitude: 22.6732,
    longitude: 88.3752,
    mapsUrl: 'https://maps.google.com/?q=College+of+Medicine+and+Sagore+Dutta+Hospital+Kolkata',
    verifiedDate: 'April 2026',
    rating: 4.3,
    openHours: 'Open 24x7 (Tertiary Care & Trauma)',
    specialities: ['24x7 Trauma & Emergency', 'Cardiology & CCU', 'Neurology', 'Orthopedics', 'ICU/HDU/NICU'],
    isVerifiedPartner: true,
    emergencyAvailable: true,
    totalBeds: 500,
    availableBeds: 45,
    icuBedsAvailable: 6,
    isBedVerified: true,
    bedSource: 'CMSDH Central Bed Management System',
    lastBedUpdate: '10 mins ago'
  },
  {
    id: 'pan-03',
    name: 'Ghola State General Hospital',
    nameBn: 'ঘোলা স্টেট জেনারেল হাসপাতাল',
    type: 'Hospital',
    area: 'Panihati',
    locality: 'Ghola, Panihati',
    address: 'T.B. Hospital Road, Ghola, Panihati, Kolkata, West Bengal 700111',
    phone: '033 2595 2445',
    distanceKm: 2.8,
    distanceFromJisKm: 3.8,
    travelTimeMins: 7,
    latitude: 22.7042,
    longitude: 88.3965,
    mapsUrl: 'https://maps.google.com/?q=Ghola+State+General+Hospital+Panihati',
    verifiedDate: 'April 2026',
    rating: 4.0,
    openHours: 'Open 24x7',
    specialities: ['General Medicine', 'Emergency First Response', 'Pulmonology', 'Daycare & Pathology'],
    isVerifiedPartner: true,
    emergencyAvailable: true,
    totalBeds: 120,
    availableBeds: 14,
    icuBedsAvailable: 1,
    isBedVerified: true,
    bedSource: 'Govt Health Portal (Swasthya Bhawan)',
    lastBedUpdate: '25 mins ago'
  },
  {
    id: 'pan-04',
    name: 'Kalyani General Hospital & Nursing Home',
    nameBn: 'কল্যাণী জেনারেল হাসপাতাল ও নার্সিং হোম',
    type: 'Nursing Home',
    area: 'Panihati',
    locality: 'Peerless Nagar, Panihati / Sodepur',
    address: 'Peerless Nagar Road, Panihati, Sodepur, Kolkata, West Bengal 700114',
    phone: '033 2565 4422',
    distanceKm: 1.2,
    distanceFromJisKm: 2.0,
    travelTimeMins: 4,
    latitude: 22.6980,
    longitude: 88.3810,
    mapsUrl: 'https://maps.google.com/?q=Kalyani+General+Hospital+Sodepur',
    verifiedDate: 'April 2026',
    rating: 4.2,
    openHours: 'Open 24x7',
    specialities: ['General Surgery', 'Maternity & Childcare', 'Laparoscopy', 'Dialysis Unit'],
    isVerifiedPartner: true,
    emergencyAvailable: true,
    totalBeds: 60,
    availableBeds: 8,
    icuBedsAvailable: 2,
    isBedVerified: true,
    bedSource: 'Hospital Admin Desk',
    lastBedUpdate: '35 mins ago'
  },
  {
    id: 'pan-05',
    name: 'Peerless Diagnostic & Healthcare Centre, Sodepur',
    nameBn: 'পিয়ারলেস ডায়াগনস্টিক অ্যান্ড হেলথকেয়ার, সোদপুর',
    type: 'Diagnostic & Clinic',
    area: 'Panihati',
    locality: 'Sodepur',
    address: 'Sodepur Station Road, Near Traffic More, Sodepur, Kolkata, West Bengal 700110',
    phone: '033 2565 8900',
    distanceKm: 1.8,
    distanceFromJisKm: 2.6,
    travelTimeMins: 5,
    latitude: 22.6965,
    longitude: 88.3845,
    mapsUrl: 'https://maps.google.com/?q=Peerless+Diagnostic+Centre+Sodepur',
    verifiedDate: 'April 2026',
    rating: 4.4,
    openHours: '7:00 AM – 9:00 PM',
    specialities: ['Cardiology Consultations', 'Pathology & Imaging', 'Geriatric Health OPD', 'Ultrasonography'],
    isVerifiedPartner: true,
    emergencyAvailable: false,
    isBedVerified: false,
    bedSource: 'Daycare/OPD Clinic (No overnight emergency beds)'
  },
  {
    id: 'pan-06',
    name: 'Suraksha Diagnostics & Healthcare, Sodepur',
    nameBn: 'সুরক্ষা ডায়াগনস্টিকস ও পলিক্লিনিক, সোদপুর',
    type: 'Diagnostic & Clinic',
    area: 'Panihati',
    locality: 'Sodepur Traffic More',
    address: '21/1, BT Road, Sodepur Cross Road, Sodepur, Kolkata, West Bengal 700110',
    phone: '033 6619 1000',
    distanceKm: 1.5,
    distanceFromJisKm: 2.4,
    travelTimeMins: 5,
    latitude: 22.6972,
    longitude: 88.3790,
    mapsUrl: 'https://maps.google.com/?q=Suraksha+Diagnostics+Sodepur',
    verifiedDate: 'April 2026',
    rating: 4.5,
    openHours: '24 Hours Sample Collection & OPD',
    specialities: ['Multi-speciality OPD', 'Digital X-Ray & MRI', 'Cardiology & ECG', 'Home Blood Collection'],
    isVerifiedPartner: true,
    emergencyAvailable: false,
    isBedVerified: false,
    bedSource: 'Daycare Diagnostic Centre'
  },
  {
    id: 'pan-07',
    name: 'Balaram Seva Mandir State General Hospital',
    nameBn: 'বলরাম সেবা মন্দির স্টেট জেনারেল হাসপাতাল, খড়দহ',
    type: 'Hospital',
    area: 'Panihati',
    locality: 'Khardaha',
    address: 'Khardaha Station Road, Khardaha, North 24 Parganas, West Bengal 700117',
    phone: '033 2583 2341',
    distanceKm: 3.2,
    distanceFromJisKm: 4.5,
    travelTimeMins: 9,
    latitude: 22.7210,
    longitude: 88.3735,
    mapsUrl: 'https://maps.google.com/?q=Balaram+Seva+Mandir+State+General+Hospital+Khardaha',
    verifiedDate: 'April 2026',
    rating: 4.1,
    openHours: 'Open 24x7',
    specialities: ['24x7 Emergency Care', 'General Medicine', 'Swasthya Sathi Unit', 'Orthopedics'],
    isVerifiedPartner: true,
    emergencyAvailable: true,
    totalBeds: 100,
    availableBeds: 12,
    icuBedsAvailable: 1,
    isBedVerified: true,
    bedSource: 'Govt Health Portal',
    lastBedUpdate: '18 mins ago'
  },
  {
    id: 'pan-08',
    name: 'Disha Eye Hospital, Sodepur',
    nameBn: 'দিশা আই হসপিটাল, সোদপুর',
    type: 'Hospital',
    area: 'Panihati',
    locality: 'Sodepur Barasat Road',
    address: '86/1, Barasat Road, Near Sodepur Traffic More, Sodepur, Kolkata, West Bengal 700110',
    phone: '033 6636 0000',
    distanceKm: 1.4,
    distanceFromJisKm: 2.5,
    travelTimeMins: 4,
    latitude: 22.6990,
    longitude: 88.3805,
    mapsUrl: 'https://maps.google.com/?q=Disha+Eye+Hospital+Sodepur',
    verifiedDate: 'April 2026',
    rating: 4.7,
    openHours: '8:00 AM – 7:30 PM',
    specialities: ['Super Speciality Ophthalmology', 'Cataract Surgery', 'Retina & Glaucoma', 'Cornea Unit'],
    isVerifiedPartner: true,
    emergencyAvailable: false,
    totalBeds: 40,
    availableBeds: 10,
    icuBedsAvailable: 0,
    isBedVerified: true,
    bedSource: 'Eye Specialty Daycare Beds',
    lastBedUpdate: '1 hour ago'
  },
  {
    id: 'pan-09',
    name: 'Zenith Super Specialist Hospital',
    nameBn: 'জেনিথ সুপার স্পেশালিস্ট হাসপাতাল, বেলঘরিয়া / আগরপাড়া',
    type: 'Hospital',
    area: 'Panihati',
    locality: 'Belgharia / Agarpara Border (Near JIS University)',
    address: '9/3, Feeder Road, Belgharia, Kolkata, West Bengal 700056',
    phone: '033 2564 4040',
    distanceKm: 4.2,
    distanceFromJisKm: 1.8,
    travelTimeMins: 6,
    latitude: 22.6648,
    longitude: 88.3840,
    mapsUrl: 'https://maps.google.com/?q=Zenith+Super+Specialist+Hospital+Belgharia',
    verifiedDate: 'April 2026',
    rating: 4.6,
    openHours: 'Open 24x7',
    specialities: ['Cardiology & Cath Lab', 'Critical Care ICU', 'Nephrology & Dialysis', 'Neuro Surgery', '24x7 Pharmacy'],
    isVerifiedPartner: true,
    emergencyAvailable: true,
    totalBeds: 180,
    availableBeds: 22,
    icuBedsAvailable: 4,
    isBedVerified: true,
    bedSource: 'Zenith Emergency Triage Dashboard',
    lastBedUpdate: '8 mins ago'
  },
  {
    id: 'pan-10',
    name: 'Matri Bhavan Hospital & Maternity Home',
    nameBn: 'মাতৃভবন হাসপাতাল, বরানগর',
    type: 'Hospital',
    area: 'Panihati',
    locality: 'Baranagar / Kamarhati',
    address: '267, B.T. Road, Baranagar, Kolkata, West Bengal 700036',
    phone: '033 2557 2367',
    distanceKm: 5.1,
    distanceFromJisKm: 3.5,
    travelTimeMins: 11,
    latitude: 22.6450,
    longitude: 88.3710,
    mapsUrl: 'https://maps.google.com/?q=Matri+Bhavan+Hospital+Baranagar',
    verifiedDate: 'April 2026',
    rating: 4.2,
    openHours: 'Open 24x7',
    specialities: ['Mother & Child Care', 'General Medicine', 'Gynecology Surgery', 'Neonatal Care'],
    isVerifiedPartner: true,
    emergencyAvailable: true,
    totalBeds: 90,
    availableBeds: 15,
    icuBedsAvailable: 1,
    isBedVerified: true,
    bedSource: 'Maternity Unit Desk',
    lastBedUpdate: '40 mins ago'
  }
];

export const verifiedDumDumHospitals: VerifiedHospital[] = [
  {
    id: 'dum-01',
    name: 'Dum Dum Municipal Specialized Hospital',
    nameBn: 'দমদম মিউনিসিপ্যাল স্পেশালাইজড হাসপাতাল',
    type: 'Hospital',
    area: 'Dum Dum',
    locality: 'Cantonment, Dum Dum',
    address: '2, Harimohan Dutta Lane, Cantonment, Dum Dum, Kolkata, West Bengal 700028',
    phone: '033 2549 2030',
    distanceKm: 0.9,
    travelTimeMins: 3,
    latitude: 22.6285,
    longitude: 88.4060,
    mapsUrl: 'https://maps.google.com/?q=Dum+Dum+Municipal+Specialized+Hospital',
    verifiedDate: 'April 2026',
    rating: 4.2,
    openHours: 'Open 24x7',
    specialities: ['24x7 Emergency Care', 'General Medicine', 'Orthopedics', 'Swasthya Sathi Care', 'Pathology'],
    isVerifiedPartner: true,
    emergencyAvailable: true,
    totalBeds: 110,
    availableBeds: 16,
    icuBedsAvailable: 2,
    isBedVerified: true,
    bedSource: 'Municipal Hospital Duty Officer',
    lastBedUpdate: '12 mins ago'
  },
  {
    id: 'dum-02',
    name: 'South Dum Dum Municipal Hospital',
    nameBn: 'দক্ষিণ দমদম পুর হাসপাতাল',
    type: 'Hospital',
    area: 'Dum Dum',
    locality: 'Nagerbazar / P.K. Guha Road',
    address: '14, P.K. Guha Road, Nagerbazar, Dum Dum, Kolkata, West Bengal 700028',
    phone: '033 2549 5500',
    distanceKm: 1.4,
    travelTimeMins: 5,
    latitude: 22.6210,
    longitude: 88.4110,
    mapsUrl: 'https://maps.google.com/?q=South+Dum+Dum+Municipal+Hospital',
    verifiedDate: 'April 2026',
    rating: 4.1,
    openHours: 'Open 24x7',
    specialities: ['General Medicine', 'Pediatrics', 'Obstetrics & Gynecology', 'Emergency Triage', 'Dialysis'],
    isVerifiedPartner: true,
    emergencyAvailable: true,
    totalBeds: 130,
    availableBeds: 20,
    icuBedsAvailable: 3,
    isBedVerified: true,
    bedSource: 'South Dum Dum Municipal Health Desk',
    lastBedUpdate: '20 mins ago'
  },
  {
    id: 'dum-03',
    name: 'ILS Hospitals, Dum Dum',
    nameBn: 'আই এল এস হসপিটালস, দমদম',
    type: 'Hospital',
    area: 'Dum Dum',
    locality: 'Mall Road, Nagerbazar',
    address: '1, Mall Road, Near Nagerbazar Flyover, Dum Dum, Kolkata, West Bengal 700080',
    phone: '033 4031 5000',
    distanceKm: 1.2,
    travelTimeMins: 4,
    latitude: 22.6195,
    longitude: 88.4140,
    mapsUrl: 'https://maps.google.com/?q=ILS+Hospitals+Dumdum+Kolkata',
    verifiedDate: 'April 2026',
    rating: 4.6,
    openHours: 'Open 24x7 (Tertiary Care & Emergency)',
    specialities: ['24x7 Emergency & Trauma', 'Advanced Laparoscopic Surgery', 'Cardiology & CCU', 'Gastroenterology', 'Critical Care ICU'],
    isVerifiedPartner: true,
    emergencyAvailable: true,
    totalBeds: 155,
    availableBeds: 24,
    icuBedsAvailable: 5,
    isBedVerified: true,
    bedSource: 'ILS Emergency Coordination Desk',
    lastBedUpdate: '5 mins ago'
  },
  {
    id: 'dum-04',
    name: 'Charnock Hospital, VIP Road / Major Arterial Road',
    nameBn: 'চার্নক সুপার স্পেশালিটি হাসপাতাল',
    type: 'Hospital',
    area: 'Dum Dum',
    locality: 'Teghoria / Airport Border',
    address: 'BMC 195, Biswa Bangla Sarani, Teghoria, Major Arterial Road, Kolkata, West Bengal 700157',
    phone: '033 4050 0500',
    distanceKm: 3.8,
    travelTimeMins: 10,
    latitude: 22.6290,
    longitude: 88.4380,
    mapsUrl: 'https://maps.google.com/?q=Charnock+Hospital+Kolkata',
    verifiedDate: 'April 2026',
    rating: 4.8,
    openHours: 'Open 24x7 (Super Speciality & Cardiac)',
    specialities: ['24x7 Cardiac Emergency & Cath Lab', 'Neurosciences', 'Kidney Transplant & Dialysis', 'Advanced ICU & ECMO'],
    isVerifiedPartner: true,
    emergencyAvailable: true,
    totalBeds: 300,
    availableBeds: 38,
    icuBedsAvailable: 8,
    isBedVerified: true,
    bedSource: 'Charnock Super Speciality Live Dashboard',
    lastBedUpdate: '7 mins ago'
  },
  {
    id: 'dum-05',
    name: 'Renaissance Hospital, Teghoria / Airport',
    nameBn: 'রেনেসাঁ হাসপাতাল, ভিআইপি রোড',
    type: 'Hospital',
    area: 'Dum Dum',
    locality: 'Raghunathpur / VIP Road',
    address: 'VIP Road, Raghunathpur, Near Airport Gate, Kolkata, West Bengal 700059',
    phone: '033 2500 5000',
    distanceKm: 4.1,
    travelTimeMins: 11,
    latitude: 22.6320,
    longitude: 88.4410,
    mapsUrl: 'https://maps.google.com/?q=Renaissance+Hospital+VIP+Road+Kolkata',
    verifiedDate: 'April 2026',
    rating: 4.4,
    openHours: 'Open 24x7',
    specialities: ['General & Laparoscopic Surgery', 'Orthopedic Joint Replacement', 'Critical Care ICU', 'Oncology Care'],
    isVerifiedPartner: true,
    emergencyAvailable: true,
    totalBeds: 120,
    availableBeds: 15,
    icuBedsAvailable: 3,
    isBedVerified: true,
    bedSource: 'Hospital Operations Portal',
    lastBedUpdate: '19 mins ago'
  },
  {
    id: 'dum-06',
    name: 'Apex General Hospital & Nursing Home',
    nameBn: 'এপেক্স জেনারেল হাসপাতাল ও নার্সিং হোম, নাগেরবাজার',
    type: 'Nursing Home',
    area: 'Dum Dum',
    locality: 'Nagerbazar Crossing',
    address: '124, Baguiati Main Road / Nagerbazar Crossing, Dum Dum, Kolkata, West Bengal 700074',
    phone: '033 2570 0300',
    distanceKm: 1.9,
    travelTimeMins: 6,
    latitude: 22.6180,
    longitude: 88.4190,
    mapsUrl: 'https://maps.google.com/?q=Apex+General+Hospital+Nagerbazar+Dum+Dum',
    verifiedDate: 'April 2026',
    rating: 4.0,
    openHours: 'Open 24x7',
    specialities: ['General Surgery', 'Urology', 'Internal Medicine', 'Maternity & Daycare'],
    isVerifiedPartner: true,
    emergencyAvailable: true,
    totalBeds: 50,
    availableBeds: 8,
    icuBedsAvailable: 1,
    isBedVerified: true,
    bedSource: 'Nursing Home Reception',
    lastBedUpdate: '45 mins ago'
  },
  {
    id: 'dum-07',
    name: 'Dum Dum Cantonment Sub-Divisional Hospital',
    nameBn: 'দমদম ক্যান্টনমেন্ট মহকুমা হাসপাতাল',
    type: 'Hospital',
    area: 'Dum Dum',
    locality: 'Subhash Nagar, Cantonment',
    address: 'Subhash Nagar, Dum Dum Cantonment, Kolkata, West Bengal 700065',
    phone: '033 2549 1122',
    distanceKm: 1.1,
    travelTimeMins: 4,
    latitude: 22.6360,
    longitude: 88.4130,
    mapsUrl: 'https://maps.google.com/?q=Dum+Dum+Cantonment+Hospital',
    verifiedDate: 'April 2026',
    rating: 4.0,
    openHours: 'Open 24x7',
    specialities: ['24x7 Emergency First Aid', 'General Medicine', 'Swasthya Sathi Care', 'Maternity Ward'],
    isVerifiedPartner: true,
    emergencyAvailable: true,
    totalBeds: 80,
    availableBeds: 12,
    icuBedsAvailable: 1,
    isBedVerified: true,
    bedSource: 'Govt Sub-Divisional Portal',
    lastBedUpdate: '22 mins ago'
  },
  {
    id: 'dum-08',
    name: 'Apollo Clinic, Nagerbazar (Diamond Plaza)',
    nameBn: 'অ্যাপোলো ক্লিনিক, নাগেরবাজার',
    type: 'Diagnostic & Clinic',
    area: 'Dum Dum',
    locality: 'Diamond Plaza Complex, Jessore Road',
    address: '13, Jessore Road, Diamond Plaza Complex, Nagerbazar, Dum Dum, Kolkata, West Bengal 700055',
    phone: '033 4004 0500',
    distanceKm: 1.6,
    travelTimeMins: 5,
    latitude: 22.6145,
    longitude: 88.4085,
    mapsUrl: 'https://maps.google.com/?q=Apollo+Clinic+Diamond+Plaza+Nagerbazar',
    verifiedDate: 'April 2026',
    rating: 4.5,
    openHours: '7:30 AM – 8:30 PM',
    specialities: ['Multi-speciality Doctor Consultations', 'Diagnostic Cardiology', 'Digital Imaging & Pathology', 'Preventive Geriatric Health'],
    isVerifiedPartner: true,
    emergencyAvailable: false,
    isBedVerified: false,
    bedSource: 'Daycare Polyclinic (No Emergency IPD Beds)'
  },
  {
    id: 'dum-09',
    name: 'KMC Maternity Home & Health Clinic, Gorabazar',
    nameBn: 'কেএমসি মাতৃসদন ও স্বাস্থ্য কেন্দ্র, গোরাবাজার',
    type: 'Hospital',
    area: 'Dum Dum',
    locality: 'Gorabazar Main Road',
    address: 'Gorabazar Main Road, Dum Dum, Kolkata, West Bengal 700028',
    phone: '033 2549 0880',
    distanceKm: 0.8,
    travelTimeMins: 3,
    latitude: 22.6240,
    longitude: 88.4020,
    mapsUrl: 'https://maps.google.com/?q=Gorabazar+Health+Centre+Dum+Dum',
    verifiedDate: 'April 2026',
    rating: 4.1,
    openHours: 'Open 24x7',
    specialities: ['Maternity & Obstetrics', 'Child Immunization', 'Geriatric Health OPD', 'Primary Emergency'],
    isVerifiedPartner: true,
    emergencyAvailable: true,
    totalBeds: 65,
    availableBeds: 10,
    icuBedsAvailable: 0,
    isBedVerified: true,
    bedSource: 'KMC Health Network',
    lastBedUpdate: '30 mins ago'
  },
  {
    id: 'dum-10',
    name: 'Care & Cure Nursing Home & Surgical Centre',
    nameBn: 'কেয়ার অ্যান্ড কিউর নার্সিং হোম, মতিঝিল',
    type: 'Nursing Home',
    area: 'Dum Dum',
    locality: 'Motijheel Avenue',
    address: '32, Motijheel Avenue, Dum Dum, Kolkata, West Bengal 700074',
    phone: '033 2560 4120',
    distanceKm: 1.3,
    travelTimeMins: 4,
    latitude: 22.6225,
    longitude: 88.4160,
    mapsUrl: 'https://maps.google.com/?q=Care+and+Cure+Nursing+Home+Dum+Dum',
    verifiedDate: 'April 2026',
    rating: 4.2,
    openHours: 'Open 24x7',
    specialities: ['General Surgery', 'Orthopedic Care', 'Post-Op Recovery Ward', '24x7 Nursing Care'],
    isVerifiedPartner: true,
    emergencyAvailable: true,
    totalBeds: 45,
    availableBeds: 7,
    icuBedsAvailable: 1,
    isBedVerified: true,
    bedSource: 'Care & Cure Front Desk',
    lastBedUpdate: '50 mins ago'
  }
];

export const allVerifiedHospitals: VerifiedHospital[] = [
  ...verifiedPanihatiHospitals,
  ...verifiedDumDumHospitals
];

export function getVerifiedHospitalsByLocation(
  location: string,
  userCoordinates?: { lat: number; lng: number } | null
): VerifiedHospital[] {
  if (!location || !location.trim()) {
    return [];
  }

  const locLower = location.toLowerCase().trim();

  const isDumDumArea =
    locLower.includes('dum dum') ||
    locLower.includes('dumdum') ||
    locLower.includes('nagerbazar') ||
    locLower.includes('airport') ||
    locLower.includes('teghoria') ||
    locLower.includes('cantonment') ||
    locLower.includes('motijheel') ||
    locLower.includes('gorabazar') ||
    ['700028', '700080', '700074', '700079', '700052', '700030', '700055', '700065'].some(p => locLower.includes(p));

  const isPanihatiArea =
    locLower.includes('panihati') ||
    locLower.includes('sodepur') ||
    locLower.includes('agarpara') ||
    locLower.includes('khardaha') ||
    locLower.includes('ghola') ||
    locLower.includes('belgharia') ||
    locLower.includes('kamarhati') ||
    locLower.includes('baranagar') ||
    ['700114', '700110', '700111', '700058', '700056', '700109', '700115', '700036', '700118'].some(p => locLower.includes(p));

  let matched: VerifiedHospital[] = [];
  if (isDumDumArea) {
    matched = [...verifiedDumDumHospitals];
  } else if (isPanihatiArea) {
    matched = [...verifiedPanihatiHospitals];
  } else {
    // Custom location search over all facilities matching query
    const results = allVerifiedHospitals.filter(
      h =>
        h.name.toLowerCase().includes(locLower) ||
        h.nameBn.includes(location) ||
        h.address.toLowerCase().includes(locLower) ||
        h.locality.toLowerCase().includes(locLower) ||
        h.area.toLowerCase().includes(locLower) ||
        h.specialities.some(s => s.toLowerCase().includes(locLower))
    );
    matched = results;
  }

  // If user coordinates provided, calculate actual distances and sort nearest first
  if (userCoordinates && userCoordinates.lat && userCoordinates.lng) {
    return matched
      .map(h => {
        const dist = calculateDistanceKm(userCoordinates.lat, userCoordinates.lng, h.latitude, h.longitude);
        const estMins = Math.max(2, Math.round(dist * 2.8));
        return {
          ...h,
          distanceKm: dist,
          travelTimeMins: estMins
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return matched.sort((a, b) => a.distanceKm - b.distanceKm);
}

export function isMatchingHospital(hospitalIdA?: string, hospitalIdB?: string): boolean {
  if (!hospitalIdA || !hospitalIdB) return false;
  if (hospitalIdA === hospitalIdB) return true;
  const canonical = (id: string) => {
    if (id === 'pan-hosp-1' || id === 'pan-01') return 'pan-01';
    if (id === 'pan-hosp-2' || id === 'pan-02') return 'pan-02';
    if (id === 'pan-hosp-3' || id === 'pan-09') return 'pan-09';
    if (id === 'dum-hosp-1' || id === 'dum-01') return 'dum-01';
    if (id === 'dum-hosp-2' || id === 'dum-02') return 'dum-02';
    if (id === 'dum-hosp-3' || id === 'dum-03') return 'dum-03';
    return id;
  };
  return canonical(hospitalIdA) === canonical(hospitalIdB);
}

