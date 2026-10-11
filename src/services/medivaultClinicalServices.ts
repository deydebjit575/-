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

export function assessSymptomsAI(selectedSymptomIds: string[], patientAge: number = 70, lang: 'bn' | 'en' = 'en'): HealthCheckinResult {
  const isBn = lang === 'bn';

  if (selectedSymptomIds.includes('chest_discomfort')) {
    return {
      riskLevel: 'Emergency Alert',
      primaryAssessment: isBn
        ? 'বুকে অস্বস্তি বা ভারী অনুভূতি কার্ডিয়াক ইস্কেমিয়া বা এনজাইনার সম্ভাব্য সংকেত হতে পারে। প্রবীণ বয়সে এটিকে অবহেলা করা ঝুঁকিপূর্ণ।'
        : 'Chest discomfort or heaviness can indicate potential cardiac ischemia or angina. In senior patients, this requires urgent medical attention.',
      recommendedActions: isBn
        ? [
            'তাৎক্ষণিকভাবে বিশ্রাম নিন এবং শারীরিক পরিশ্রম বন্ধ করুন।',
            'নিকটস্থ হাসপাতালের জরুরি কার্ডিওলজি বিভাগে যাওয়ার জন্য প্ল্যাটফর্মের "জরুরি SOS" বা 112 বোতামে চাপ দিন।',
            'পূর্বে চিকিৎসকের নির্দেশিত সরবিট্রেইট / নাইট্রেট ওষুধ থাকলে নিয়মমাফিক গ্রহণ করুন।'
          ]
        : [
            'Rest immediately and cease any physical exertion.',
            'Trigger platform Emergency SOS or dial 112 for immediate transfer to an emergency cardiology facility.',
            'Take doctor-prescribed sublingual nitrate / sorbitrate if previously advised.'
          ],
      lifestyleAndHomeCare: isBn
        ? [
            'উত্তেজিত হবেন না, শান্ত পরিবেশে গভীর শ্বাস নিন।',
            'ভারী আহার বা অতিরিক্ত হাঁটা অবিলম্বে পরিহার করুন।'
          ]
        : [
            'Stay calm in a well-ventilated, restful environment and take slow breaths.',
            'Avoid heavy meals or walking until medically cleared.'
          ],
      urgencyWarning: isBn
        ? 'সতর্কতা: এটি কোনো চূড়ান্ত চিকিৎসা মূল্যায়ন নয়। অবিলম্বে ইসিজি ও জরুরি ট্রায়াজ দলের পরামর্শ নিন।'
        : 'Urgent Disclaimer: This AI assessment is not a conclusive diagnosis. Prompt ECG and triage evaluation are strongly advised.',
      suggestedDoctorSpeciality: isBn
        ? 'কার্ডিওলজিস্ট / জরুরি মেডিসিন বিশেষজ্ঞ (Cardiologist)'
        : 'Cardiologist / Emergency Medicine Specialist'
    };
  }

  if (selectedSymptomIds.includes('breathlessness_mild') && selectedSymptomIds.includes('fatigue')) {
    return {
      riskLevel: 'Seek Prompt Care',
      primaryAssessment: isBn
        ? 'হাঁটাহাঁটিতে শ্বাসকষ্ট ও ক্লান্তির সংমিশ্রণ হৃদপিণ্ডের কর্মক্ষমতা হ্রাস, রক্তস্বল্পতা (Anemia), বা রক্তচাপের তারতম্যের কারণে হতে পারে।'
        : 'Mild breathlessness paired with fatigue may indicate declining cardiopulmonary efficiency, anemia, or blood pressure fluctuations.',
      recommendedActions: isBn
        ? [
            'পরবর্তী ২৪ থেকে ৪৮ ঘণ্টার মধ্যে আপনার চিকিৎসকের সাথে রুটিন চেকআপের অ্যাপয়েন্টমেন্ট নিন।',
            'রক্তচাপ, পালস ও SpO2 অক্সিমিটার দিয়ে পরীক্ষা করে MediVault-এ নোট রাখুন।',
            'হিমোগ্লোবিন ও সিরাম ক্রিয়েটিনিন টেস্ট করার পরামর্শ বিবেচনা করুন।'
          ]
        : [
            'Schedule a routine evaluation with your physician within 24 to 48 hours.',
            'Log your blood pressure, pulse rate, and SpO2 in MediVault.',
            'Consider reviewing complete blood count (CBC) and serum creatinine levels.'
          ],
      lifestyleAndHomeCare: isBn
        ? [
            'লবণের পরিমাণ প্রতিদিন ৫ গ্রামের নিচে রাখুন।',
            'পরিমিত পানি পান করুন এবং একটানা সিঁড়ি ভাঙা এড়িয়ে চলুন।'
          ]
        : [
            'Restrict dietary sodium below 5 grams daily.',
            'Maintain adequate hydration and avoid climbing stairs continuously.'
          ],
      urgencyWarning: isBn
        ? 'স্বাস্থ্য পরামর্শ: লক্ষণ তীব্র হলে বা শ্বাস নিতে কষ্ট হলে জরুরি সাড়াদান বিকল্প ব্যবহার করুন।'
        : 'Health Notice: If breathlessness worsens at rest, utilize the Emergency SOS option immediately.',
      suggestedDoctorSpeciality: isBn
        ? 'জেনারেল ফিজিশিয়ান / পালমোনোলজিস্ট (General Physician)'
        : 'General Physician / Pulmonologist'
    };
  }

  if (selectedSymptomIds.includes('joint_pain')) {
    return {
      riskLevel: 'Low',
      primaryAssessment: isBn
        ? 'প্রবীণ বয়সে হাঁটু ও জয়েন্টে ব্যথা সাধারণত অস্টিওআর্থ্রাইটিস বা কার্টিলেজ ক্ষয়ের সাধারণ উপসর্গ।'
        : 'Joint and knee discomfort in elderly adults is commonly associated with degenerative osteoarthritis or cartilage wear.',
      recommendedActions: isBn
        ? [
            'ফিজিওথেরাপিস্টের পরামর্শ অনুযায়ী মৃদু স্ট্রেচিং ও হাঁটুর ব্যায়াম করুন।',
            'খালি পেটে ব্যথানাশক (NSAID) গ্রহণ থেকে বিরত থাকুন, কারণ এটি কিডনি ও গ্যাস্ট্রিকের ক্ষতি করতে পারে।',
            'ভিটামিন D3 ও ক্যালসিয়ামের মাত্রা পরীক্ষা করান।'
          ]
        : [
            'Engage in gentle stretching and low-impact knee exercises recommended by a physiotherapist.',
            'Avoid taking NSAID pain relievers on an empty stomach to prevent gastric and renal irritation.',
            'Check serum Vitamin D3 and Calcium levels.'
          ],
      lifestyleAndHomeCare: isBn
        ? [
            'হাঁটুর উপর গরম সেঁক বা উষ্ণ পানির ভাপ আরামদায়ক হতে পারে।',
            'আরামদায়ক ও নন-স্লিপ নরম সোলের জুতো ব্যবহার করুন।'
          ]
        : [
            'Warm compresses or heating pads may relieve morning joint stiffness.',
            'Wear supportive, non-slip cushioned footwear.'
          ],
      urgencyWarning: isBn
        ? 'তথ্যমূলক নির্দেশিকা: অসহ্য ফোলাভাব বা লাল হয়ে গেলে অর্থোপেডিক বিশেষজ্ঞের পরামর্শ নিন।'
        : 'Informational Note: Consult an orthopedic specialist if sudden swelling, heat, or redness develops.',
      suggestedDoctorSpeciality: isBn
        ? 'অর্থোপেডিক / জেরিয়াট্রিক বিশেষজ্ঞ (Orthopedic)'
        : 'Orthopedic / Geriatric Specialist'
    };
  }

  return {
    riskLevel: 'Low',
    primaryAssessment: isBn
      ? 'আপনার নির্বাচিত লক্ষণগুলো জীবনযাত্রার অভ্যাস, পানিশূন্যতা বা হালকা বার্ধক্যজনিত পরিবর্তনের সাথে সম্পর্কিত হতে পারে।'
      : 'Reported symptoms appear mild and may correlate with lifestyle fatigue, dehydration, or routine age-related physiological changes.',
    recommendedActions: isBn
      ? [
          'দৈনিক রক্তচাপ ও রক্তের শর্করার রুটিন পর্যবেক্ষণ বজায় রাখুন।',
          'প্রতিদিন সময়মতো সুষম পুষ্টিকর খাবার ও পর্যাপ্ত পানি পান করুন।',
          'নিয়মিত নির্ধারিত ওষুধ চিকিৎসকের পরামর্শ ছাড়া বন্ধ করবেন না।'
        ]
      : [
          'Maintain regular monitoring of daily blood pressure and fasting glucose.',
          'Consume balanced, nutrient-rich meals and stay hydrated throughout the day.',
          'Continue taking all prescribed chronic medications without interruption.'
        ],
    lifestyleAndHomeCare: isBn
      ? [
          'প্রতিদিন ২০-৩০ মিনিট হালকা হাঁটাচলা করুন।',
          'রাতে নিরবচ্ছিন্ন ৬-৭ ঘণ্টা ঘুমের অভ্যাস বজায় রাখুন।'
        ]
      : [
          'Practice light walking for 20-30 minutes daily.',
          'Ensure 6 to 7 hours of uninterrupted nightly sleep.'
        ],
    urgencyWarning: isBn
      ? 'স্মারক: এই এআই স্বাস্থ্য চেক-ইন কোনো চূড়ান্ত ডায়াগনোসিস নয়, এটি প্রবীণদের স্বাস্থ্য সচেতনতার জন্য সহায়ক নির্দেশিকা।'
      : 'Reminder: This AI health check-in is an informational guidance tool and does not substitute for formal clinical diagnosis.',
    suggestedDoctorSpeciality: isBn
      ? 'জেনারেল ফিজিশিয়ান (General Physician / Geriatrician)'
      : 'General Physician / Geriatrician'
  };
}

// Known Drug Interaction Database
const drugInteractionDatabase: {
  pair: [string, string];
  severity: 'High' | 'Moderate' | 'Minor';
  descriptionBn: string;
  descriptionEn: string;
  mechanismBn: string;
  mechanismEn: string;
  adviceBn: string;
  adviceEn: string;
}[] = [
  {
    pair: ['aspirin', 'warfarin'],
    severity: 'High',
    descriptionBn: 'অ্যাসপিরিন ও ওয়ারফারিন একসাথে গ্রহণ করলে রক্তক্ষরণের (Bleeding) ঝুঁকি মারাত্মকভাবে বৃদ্ধি পায়।',
    descriptionEn: 'Concurrent use of Aspirin and Warfarin significantly increases the risk of severe hemorrhage and internal bleeding.',
    mechanismBn: 'উভয় ওষুধই রক্তের জমাট বাঁধার ক্ষমতা হ্রাস করে।',
    mechanismEn: 'Dual antiplatelet and anticoagulant actions additively impair physiological clotting pathways.',
    adviceBn: 'অবিলম্বে চিকিৎসকের সাথে পরামর্শ করুন এবং আইএনআর (INR) নিয়মিত পর্যবেক্ষণ করুন।',
    adviceEn: 'Consult your cardiologist or physician immediately. Regular INR monitoring and dosage adjustment are required.'
  },
  {
    pair: ['clopidogrel', 'omeprazole'],
    severity: 'Moderate',
    descriptionBn: 'ওমেপ্রাজল ক্লোপিডোগ্রেল-এর কার্যক্ষমতা কিছুটা কমিয়ে দিতে পারে।',
    descriptionEn: 'Omeprazole may reduce the antiplatelet protective efficacy of Clopidogrel.',
    mechanismBn: 'ওমেপ্রাজল CYP2C19 এনজাইম বাধা দিয়ে ক্লোপিডোগ্রেল সক্রিয় হওয়া শ্লথ করে।',
    mechanismEn: 'Omeprazole competitively inhibits hepatic CYP2C19 enzyme conversion of Clopidogrel into its active antiplatelet form.',
    adviceBn: 'গ্যাস্ট্রিকের জন্য প্যান্টোপ্রাজল বা চিকিৎসকের বিকল্প পরামর্শ বিবেচনা করুন।',
    adviceEn: 'Consider alternative gastroprotective agents such as Pantoprazole under medical guidance.'
  },
  {
    pair: ['telmisartan', 'spironolactone'],
    severity: 'High',
    descriptionBn: 'একসাথে সেবনে রক্তে পটাশিয়ামের মাত্রা অত্যধিক বেড়ে যাওয়ার (Hyperkalemia) ঝুঁকি থাকে।',
    descriptionEn: 'Combining Telmisartan and Spironolactone creates a significant risk of dangerously high blood potassium (Hyperkalemia).',
    mechanismBn: 'উভয় ওষুধই কিডনি দ্বারা পটাশিয়াম নির্গমন হ্রাস করে।',
    mechanismEn: 'Dual renin-angiotensin-aldosterone blockade reduces renal excretion of serum potassium.',
    adviceBn: 'রক্তের সিরাম পটাশিয়াম ও কিডনি ফাংশন টেস্ট (KFT) নজরদারিতে রাখুন।',
    adviceEn: 'Routinely check serum electrolytes and renal function tests (KFT / Serum Creatinine).'
  },
  {
    pair: ['metformin', 'contrast'],
    severity: 'High',
    descriptionBn: 'সিটি স্ক্যান বা এনজিওগ্রাফির কনট্রাস্ট ডাই দেওয়ার সময় মেটফর্মিন গ্রহণ ল্যাকটিক অ্যাসিডোসিসের ঝুঁকি বাড়ায়।',
    descriptionEn: 'Administering iodinated contrast media during CT scans while on Metformin elevates the risk of severe lactic acidosis.',
    mechanismBn: 'কনট্রাস্টের কারণে সাময়িক কিডনি চাপ মেটফর্মিন জমে যাওয়ার সুযোগ তৈরি করে।',
    mechanismEn: 'Contrast dye-induced temporary nephropathy leads to dangerous Metformin accumulation.',
    adviceBn: 'স্ক্যানের ৪৮ ঘণ্টা আগে ও পরে ডাক্তারের পরামর্শে মেটফর্মিন সাময়িক বন্ধ রাখা হতে পারে।',
    adviceEn: 'Withhold Metformin 48 hours prior to and following contrast imaging in consultation with your doctor.'
  },
  {
    pair: ['atorvastatin', 'clarithromycin'],
    severity: 'High',
    descriptionBn: 'ক্ল্যারিথ্রোমাইসিন জাতীয় অ্যান্টিবায়োটিক অ্যাটোরভাস্ট্যাটিনের রক্তের মাত্রা বাড়িয়ে পেশির মারাত্মক ক্ষতি (Rhabdomyolysis) করতে পারে।',
    descriptionEn: 'Clarithromycin substantially elevates blood concentrations of Atorvastatin, increasing the risk of acute muscle damage (Rhabdomyolysis).',
    mechanismBn: 'CYP3A4 হেপাটিক বিপাক বাঁধাগ্রস্ত হয়।',
    mechanismEn: 'Potent inhibition of the CYP3A4 hepatic pathway prevents statin breakdown and clearance.',
    adviceBn: 'অ্যান্টিবায়োটিক চলাকালীন স্ট্যাটিন সাময়িক স্থগিতের বিষয়ে ডাক্তারকে জানান।',
    adviceEn: 'Inform your physician to temporarily suspend the statin during the antibiotic course.'
  },
  {
    pair: ['paracetamol', 'alcohol'],
    severity: 'Moderate',
    descriptionBn: 'উভয় উপাদানের উপস্থিতি লিভারে বিষক্রিয়া ও হেপাটোটক্সিসিটি ঘটাতে পারে।',
    descriptionEn: 'Combining Paracetamol with alcohol substantially increases the risk of acute hepatotoxicity and liver injury.',
    mechanismBn: 'টক্সিক মেটাবোলাইট NAPQI মাত্রাতিরিক্ত বৃদ্ধি পায়।',
    mechanismEn: 'Alcohol induction of CYP2E1 accelerates generation of the toxic Paracetamol metabolite NAPQI.',
    adviceBn: 'প্যারাসিটামল সেবনকালে অ্যালকোহল জাতীয় পানীয় পরিহার করুন।',
    adviceEn: 'Avoid alcohol consumption while taking Paracetamol or Acetaminophen medications.'
  }
];

export function checkDrugInteractions(drug1: string, drug2: string, lang: 'bn' | 'en' = 'en'): DrugInteractionResult {
  const isBn = lang === 'bn';
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
      description: isBn ? found.descriptionBn : found.descriptionEn,
      mechanism: isBn ? found.mechanismBn : found.mechanismEn,
      clinicalAdvice: isBn ? found.adviceBn : found.adviceEn
    };
  }

  return {
    drug1,
    drug2,
    severity: 'None',
    description: isBn
      ? `"${drug1}" এবং "${drug2}"-এর মধ্যে সাধারণ কোনো উচ্চ-ঝুঁকিপূর্ণ ইন্টারঅ্যাকশন পাওয়া যায়নি।`
      : `No significant harmful drug interactions identified between "${drug1}" and "${drug2}".`,
    mechanism: isBn
      ? 'সাধারণ ফার্মাকোলজিকাল সামঞ্জস্যপূর্ণ।'
      : 'Standard pharmacological compatibility based on known drug interaction profiles.',
    clinicalAdvice: isBn
      ? 'প্রেসক্রিপশন অনুযায়ী নির্ধারিত মাত্রায় সেবন বজায় রাখুন। যেকোনো অস্বাভাবিক অনুভূতিতে চিকিৎসকের পরামর্শ নিন।'
      : 'Maintain prescribed adherence. Consult your doctor or pharmacist if any adverse symptoms occur.'
  };
}
