import { DrugInteractionResult, HealthCheckinResult } from '../types';

export const commonSymptomsList = [
  { id: 'fatigue', labelBn: 'অতিরিক্ত ক্লান্তি বা দুর্বলতা', labelEn: 'Fatigue & Generalized Weakness', category: 'General' },
  { id: 'headache', labelBn: 'মাথাব্যথা বা মাথা ঘোরা', labelEn: 'Headache or Lightheadedness', category: 'Neurological' },
  { id: 'joint_pain', labelBn: 'হাঁটু বা গাঁটে ব্যথা (বাত)', labelEn: 'Joint / Knee Pain (Arthritis)', category: 'Musculoskeletal' },
  { id: 'breathlessness_mild', labelBn: 'হাঁটলে মৃদু শ্বাসকষ্ট', labelEn: 'Mild Breathlessness on Exertion', category: 'Respiratory/Cardiac' },
  { id: 'chest_discomfort', labelBn: 'বুকে ভারী ভাব বা মৃদু অস্বস্তি', labelEn: 'Chest Heaviness or Tightness', category: 'Cardiac Emergency' },
  { id: 'sleep_issues', labelBn: 'রাতে ঘুমের ব্যাঘাত / অনিদ্রা', labelEn: 'Insomnia / Sleep Disturbance', category: 'Psychological' },
  { id: 'digestion', labelBn: 'অম্বল, গ্যাস বা বুকজ্বালা', labelEn: 'Acid Reflux / Indigestion', category: 'Gastrointestinal' },
  { id: 'frequent_urination', labelBn: 'ঘন ঘন প্রস্রাবের বেগ (বিশেষ করে রাতে)', labelEn: 'Frequent Urination (Nocturia)', category: 'Urological' },
  { id: 'blood_pressure_high', labelBn: 'উচ্চ রক্তচাপের অনুভূতি', labelEn: 'Elevated Blood Pressure Sensations', category: 'Cardiovascular' },
  { id: 'memory_lapse', labelBn: 'স্বল্পমেয়াদী বিস্মৃতি / ভুলে যাওয়া', labelEn: 'Mild Memory Forgetfulness', category: 'Geriatric Cognitive' }
];

export function assessSymptomsAI(selectedSymptomIds: string[], patientAge: number = 70): HealthCheckinResult {
  if (selectedSymptomIds.includes('chest_discomfort')) {
    return {
      riskLevel: 'Emergency Alert',
      primaryAssessment: 'বুকে অস্বস্তি বা ভারী অনুভূতি কার্ডিয়াক ইস্কেমিয়া বা এনজাইনার সম্ভাব্য সংকেত হতে পারে। প্রবীণ বয়সে এটিকে অবহেলা করা ঝুঁকিপূর্ণ।',
      recommendedActions: [
        'তাৎক্ষণিকভাবে বিশ্রাম নিন এবং শারীরিক পরিশ্রম বন্ধ করুন।',
        'নিকটস্থ হাসপাতালের জরুরি কার্ডিওলজি বিভাগে যাওয়ার জন্য প্ল্যাটফর্মের "জরুরি SOS" বা 112 বোতামে চাপ দিন।',
        'পূর্বে চিকিৎসকের নির্দেশিত সরবিট্রেইট / নাইট্রেট ওষুধ থাকলে নিয়মমাফিক গ্রহণ করুন।'
      ],
      lifestyleAndHomeCare: [
        'উত্তেজিত হবেন না, শান্ত পরিবেশে গভীর শ্বাস নিন।',
        'ভারী আহার বা অতিরিক্ত হাঁটা অবিলম্বে পরিহার করুন।'
      ],
      urgencyWarning: 'সতর্কতা: এটি কোনো চূড়ান্ত চিকিৎসা মূল্যায়ন নয়। অবিলম্বে ইসিজি ও জরুরি ট্রায়াজ দলের পরামর্শ নিন।',
      suggestedDoctorSpeciality: 'কার্ডিওলজিস্ট / জরুরি মেডিসিন বিশেষজ্ঞ (Cardiologist)'
    };
  }

  if (selectedSymptomIds.includes('breathlessness_mild') && selectedSymptomIds.includes('fatigue')) {
    return {
      riskLevel: 'Seek Prompt Care',
      primaryAssessment: 'হাঁটাহাঁটিতে শ্বাসকষ্ট ও ক্লান্তির সংমিশ্রণ হৃদপিণ্ডের কর্মক্ষমতা হ্রাস, রক্তস্বল্পতা (Anemia), বা রক্তচাপের তারতম্যের কারণে হতে পারে।',
      recommendedActions: [
        'পরবর্তী ২৪ থেকে ৪৮ ঘণ্টার মধ্যে আপনার চিকিৎসকের সাথে রুটিন চেকআপের অ্যাপয়েন্টমেন্ট নিন।',
        'রক্তচাপ, পালস ও SpO2 অক্সিমিটার দিয়ে পরীক্ষা করে MediVault-এ নোট রাখুন।',
        'হিমোগ্লোবিন ও সিরাম ক্রিয়েটিনিন টেস্ট করার পরামর্শ বিবেচনা করুন।'
      ],
      lifestyleAndHomeCare: [
        'লবণের পরিমাণ প্রতিদিন ৫ গ্রামের নিচে রাখুন।',
        'পরিমিত পানি পান করুন এবং একটানা সিঁড়ি ভাঙা এড়িয়ে চলুন।'
      ],
      urgencyWarning: 'স্বাস্থ্য পরামর্শ: লক্ষণ তীব্র হলে বা শ্বাস নিতে কষ্ট হলে জরুরি সাড়াদান বিকল্প ব্যবহার করুন।',
      suggestedDoctorSpeciality: 'জেনারেল ফিজিশিয়ান / পালমোনোলজিস্ট (General Physician)'
    };
  }

  if (selectedSymptomIds.includes('joint_pain')) {
    return {
      riskLevel: 'Low',
      primaryAssessment: 'প্রবীণ বয়সে হাঁটু ও জয়েন্টে ব্যথা সাধারণত অস্টিওআর্থ্রাইটিস বা কার্টিলেজ ক্ষয়ের সাধারণ উপসর্গ।',
      recommendedActions: [
        'ফিজিওথেরাপিস্টের পরামর্শ অনুযায়ী মৃদু স্ট্রেচিং ও হাঁটুর ব্যায়াম করুন।',
        'খালি পেটে ব্যথানাশক (NSAID) গ্রহণ থেকে বিরত থাকুন, কারণ এটি কিডনি ও গ্যাস্ট্রিকের ক্ষতি করতে পারে।',
        'ভিটামিন D3 ও ক্যালসিয়ামের মাত্রা পরীক্ষা করান।'
      ],
      lifestyleAndHomeCare: [
        'হাঁটুর উপর গরম সেঁক বা উষ্ণ পানির ভাপ আরামদায়ক হতে পারে।',
        'আরামদায়ক ও নন-স্লিপ নরম সোলের জুতো ব্যবহার করুন।'
      ],
      urgencyWarning: 'তথ্যমূলক নির্দেশিকা: অসহ্য ফোলাভাব বা লাল হয়ে গেলে অর্থোপেডিক বিশেষজ্ঞের পরামর্শ নিন।',
      suggestedDoctorSpeciality: 'অর্থোপেডিক / জেরিয়াট্রিক বিশেষজ্ঞ (Orthopedic)'
    };
  }

  return {
    riskLevel: 'Low',
    primaryAssessment: 'আপনার নির্বাচিত লক্ষণগুলো জীবনযাত্রার অভ্যাস, পানিশূন্যতা বা হালকা বার্ধক্যজনিত পরিবর্তনের সাথে সম্পর্কিত হতে পারে।',
    recommendedActions: [
      'দৈনিক রক্তচাপ ও রক্তের শর্করার রুটিন পর্যবেক্ষণ বজায় রাখুন।',
      'প্রতিদিন সময়মতো সুষম পুষ্টিকর খাবার ও পর্যাপ্ত পানি পান করুন।',
      'নিয়মিত নির্ধারিত ওষুধ চিকিৎসকের পরামর্শ ছাড়া বন্ধ করবেন না।'
    ],
    lifestyleAndHomeCare: [
      'প্রতিদিন ২০-৩০ মিনিট হালকা হাঁটাচলা করুন।',
      'রাতে নিরবচ্ছিন্ন ৬-৭ ঘণ্টা ঘুমের অভ্যাস বজায় রাখুন।'
    ],
    urgencyWarning: 'স্মারক: এই এআই স্বাস্থ্য চেক-ইন কোনো চূড়ান্ত ডায়াগনোসিস নয়, এটি প্রবীণদের স্বাস্থ্য সচেতনতার জন্য সহায়ক নির্দেশিকা।',
    suggestedDoctorSpeciality: 'জেনারেল ফিজিশিয়ান (General Physician / Geriatrician)'
  };
}

// Known Drug Interaction Database
const drugInteractionDatabase: {
  pair: [string, string];
  severity: 'High' | 'Moderate' | 'Minor';
  descriptionBn: string;
  mechanismBn: string;
  adviceBn: string;
}[] = [
  {
    pair: ['aspirin', 'warfarin'],
    severity: 'High',
    descriptionBn: 'অ্যাসপিরিন ও ওয়ারফারিন একসাথে গ্রহণ করলে রক্তক্ষরণের (Bleeding) ঝুঁকি মারাত্মকভাবে বৃদ্ধি পায়।',
    mechanismBn: 'উভয় ওষুধই রক্তের জমাট বাঁধার ক্ষমতা হ্রাস করে।',
    adviceBn: 'অবিলম্বে চিকিৎসকের সাথে পরামর্শ করুন এবং আইএনআর (INR) নিয়মিত পর্যবেক্ষণ করুন।'
  },
  {
    pair: ['clopidogrel', 'omeprazole'],
    severity: 'Moderate',
    descriptionBn: 'ওমেপ্রাজল ক্লোপিডোগ্রেল-এর কার্যক্ষমতা কিছুটা কমিয়ে দিতে পারে।',
    mechanismBn: 'ওমেপ্রাজল CYP2C19 এনজাইম বাধা দিয়ে ক্লোপিডোগ্রেল সক্রিয় হওয়া শ্লথ করে।',
    adviceBn: 'গ্যাস্ট্রিকের জন্য প্যান্টোপ্রাজল বা চিকিৎসকের বিকল্প পরামর্শ বিবেচনা করুন।'
  },
  {
    pair: ['telmisartan', 'spironolactone'],
    severity: 'High',
    descriptionBn: 'একসাথে সেবনে রক্তে পটাশিয়ামের মাত্রা অত্যধিক বেড়ে যাওয়ার (Hyperkalemia) ঝুঁকি থাকে।',
    mechanismBn: 'উভয় ওষুধই কিডনি দ্বারা পটাশিয়াম নির্গমন হ্রাস করে।',
    adviceBn: 'রক্তের সিরাম পটাশিয়াম ও কিডনি ফাংশন টেস্ট (KFT) নজরদারিতে রাখুন।'
  },
  {
    pair: ['metformin', 'contrast'],
    severity: 'High',
    descriptionBn: 'সিটি স্ক্যান বা এনজিওগ্রাফির কনট্রাস্ট ডাই দেওয়ার সময় মেটফর্মিন গ্রহণ ল্যাকটিক অ্যাসিডোসিসের ঝুঁকি বাড়ায়।',
    mechanismBn: 'কনট্রাস্টের কারণে সাময়িক কিডনি চাপ মেটফর্মিন জমে যাওয়ার সুযোগ তৈরি করে।',
    adviceBn: 'স্ক্যানের ৪৮ ঘণ্টা আগে ও পরে ডাক্তারের পরামর্শে মেটফর্মিন সাময়িক বন্ধ রাখা হতে পারে।'
  },
  {
    pair: ['atorvastatin', 'clarithromycin'],
    severity: 'High',
    descriptionBn: 'ক্ল্যারিথ্রোমাইসিন জাতীয় অ্যান্টিবায়োটিক অ্যাটোরভাস্ট্যাটিনের রক্তের মাত্রা বাড়িয়ে পেশির মারাত্মক ক্ষতি (Rhabdomyolysis) করতে পারে।',
    mechanismBn: 'CYP3A4 হেপাটিক বিপাক বাঁধাগ্রস্ত হয়।',
    adviceBn: 'অ্যান্টিবায়োটিক চলাকালীন স্ট্যাটিন সাময়িক স্থগিতের বিষয়ে ডাক্তারকে জানান।'
  },
  {
    pair: ['paracetamol', 'alcohol'],
    severity: 'Moderate',
    descriptionBn: 'উভয় উপাদানের উপস্থিতি লিভারে বিষক্রিয়া ও হেপাটোটক্সিসিটি ঘটাতে পারে।',
    mechanismBn: 'টক্সিক মেটাবোলাইট NAPQI মাত্রাতিরিক্ত বৃদ্ধি পায়।',
    adviceBn: 'প্যারাসিটামল সেবনকালে অ্যালকোহল জাতীয় পানীয় পরিহার করুন।'
  }
];

export function checkDrugInteractions(drug1: string, drug2: string): DrugInteractionResult {
  const d1 = drug1.trim().toLowerCase();
  const d2 = drug2.trim().toLowerCase();

  const found = drugInteractionDatabase.find(
    item =>
      (d1.includes(item.pair[0]) && d2.includes(item.pair[1])) ||
      (d1.includes(item.pair[1]) && d2.includes(item.pair[0]))
  );

  if (found) {
    return {
      drug1,
      drug2,
      severity: found.severity,
      description: found.descriptionBn,
      mechanism: found.mechanismBn,
      clinicalAdvice: found.adviceBn
    };
  }

  return {
    drug1,
    drug2,
    severity: 'None',
    description: `"${drug1}" এবং "${drug2}"-এর মধ্যে সাধারণ কোনো উচ্চ-ঝুঁকিপূর্ণ ইন্টারঅ্যাকশন পাওয়া যায়নি।`,
    mechanism: 'সাধারণ ফার্মাকোলজিকাল সামঞ্জস্যপূর্ণ।',
    clinicalAdvice: 'প্রেসক্রিপশন অনুযায়ী নির্ধারিত মাত্রায় সেবন বজায় রাখুন। যেকোনো অস্বাভাবিক অনুভূতিতে চিকিৎসকের পরামর্শ নিন।'
  };
}
