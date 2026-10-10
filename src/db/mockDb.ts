// High-fidelity database fallback module supporting both LocalStorage simulation and Firebase integration
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConnected } from '../firebase';

export interface Medicine {
  id: string;
  commercialName: string; // الاسم التجاري العام (للتوافق)
  commercialNameAr?: string; // الاسم التجاري باللغة العربية
  commercialNameEn?: string; // الاسم التجاري باللغة الإنجليزية
  scientificName: string; // الاسم العلمي
  quantity: number; // الكمية المتوفرة
  entryDate?: string; // تاريخ إدخال الدواء
  expiryDate: string; // تاريخ انتهاء الصلاحية
  price: number; // السعر
  unit: 'علبة' | 'شريط' | 'حبة' | string; // الوحدة
  category: string; // الفئة العلاجية
  createdAt: string;
  updatedAt: string;
  manufacturer?: string; // الشركة المصنعة
  isControlled?: boolean; // دواء مقيد ومراقب (أدوية كنترول / خاضعة للرقابة لا يصرفها فني الصيدلة)
}

export interface DispenseRecord {
  id: string;
  medicineId: string;
  medicineName: string;
  residentName: string; // اسم المقيم المعاق المستفيد
  quantityDispensed: number; // الكمية المطلوبة
  unit: string;
  totalPrice: number;
  actualQuantityDispensed: number; // الكمية المصروفة فعلياً للمراجعة
  dispensedBy: string; // اسم الصيدلي الصارف
  dispensedById: string;
  dispensedAt: string; // تاريخ الصرف
}

export interface UserSession {
  id: string;
  userId: string;
  name: string;
  email: string;
  ipAddress: string;
  deviceToken: string;
  loginTime: string;
}

export interface StockAuditLog {
  id: string;
  medicineId: string;
  medicineName: string;
  actionType: 'إضافة دواء جديد' | 'تحديث كمية' | 'تعديل يدوي' | 'حذف دواء' | 'صرف دواء لمقيم';
  quantityChanged: number;
  previousQuantity: number;
  newQuantity: number;
  performedByName: string;
  performedByEmail: string;
  performedById: string;
  notes: string;
  timestamp: string;
}

export interface SecuritySettings {
  id: string;
  emailEnabled: boolean;
  appsScriptUrl: string;
  notificationEmail: string;
  whatsAppEnabled: boolean;
  whatsAppMode: 'manual' | 'callmebot' | 'ultramsg' | 'wautopilot' | string;
  whatsAppNumber: string;
  callMeBotApiKey?: string;
  ultraMsgInstance?: string;
  ultraMsgToken?: string;
  waPilotBaseUrl?: string;
  waPilotApiKey?: string;
  waPilotType?: string;
  waPilotDevice?: string;
  waPilotPath?: string;
  alertDays?: number;
  updatedAt?: string;
  updatedBy?: string;
}

export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  id: "config",
  emailEnabled: true,
  appsScriptUrl: "AKfycbwES7mkB6q2gKtiKDbUOHIBZeLruWaE8zROrFasOHjtWXcsklq8yZZDRCDYQJVJVru4og/exec",
  notificationEmail: "tmrbe2006@gmail.com, rooq113@gmail.com, abdelrahim.mahjob@gmail.com",
  whatsAppEnabled: true,
  whatsAppMode: "manual",
  whatsAppNumber: "966502792157+, 201111256095",
  callMeBotApiKey: "",
  ultraMsgInstance: "",
  ultraMsgToken: "",
  waPilotBaseUrl: "https://wapilot.net",
  waPilotApiKey: "",
  waPilotType: "personal",
  waPilotDevice: "",
  waPilotPath: "/api/v1/api/messages",
  alertDays: 30,
  updatedAt: new Date().toISOString(),
  updatedBy: "م. تامر (المبرمج)"
};

// Initial realistic Arabic medicine inventory for a disability care center
const INITIAL_MEDICINES: Medicine[] = [
  {
    id: "med-1",
    commercialName: "بنادول اكسترا",
    commercialNameAr: "بنادول اكسترا",
    commercialNameEn: "Panadol Extra",
    scientificName: "Paracetamol + Caffeine",
    quantity: 120,
    entryDate: "2026-09-20",
    expiryDate: "2026-10-15", // Expiring soon in ~20 days from current date (2026-09-23)
    price: 15.5,
    unit: "علبة",
    category: "مسكنات وآلام",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    manufacturer: "شركة الخليج للصناعات الدوائية (جلفار)"
  },
  {
    id: "med-2",
    commercialName: "أوجمنتين 1 جم",
    commercialNameAr: "أوجمنتين 1 جم",
    commercialNameEn: "Augmentin 1g",
    scientificName: "Amoxicillin + Clavulanic Acid",
    quantity: 45,
    entryDate: "2026-09-18",
    expiryDate: "2026-10-05", // Expiring very soon! ~12 days
    price: 85.0,
    unit: "علبة",
    category: "مضادات حيوية",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    manufacturer: "شركة نوفارتس العالمية (Novartis)"
  },
  {
    id: "med-3",
    commercialName: "بروفين 400 ملجم",
    commercialNameAr: "بروفين 400 ملجم",
    commercialNameEn: "Brufen 400mg",
    scientificName: "Ibuprofen",
    quantity: 80,
    entryDate: "2026-09-15",
    expiryDate: "2027-05-20",
    price: 18.0,
    unit: "شريط",
    category: "مضادات الالتهاب",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    manufacturer: "الشركة السعودية للصناعات الدوائية (سبيماكو الدوائية)"
  },
  {
    id: "med-4",
    commercialName: "فنتولين بخاخ",
    commercialNameAr: "فنتولين بخاخ",
    commercialNameEn: "Ventolin Inhaler",
    scientificName: "Salbutamol Inhaler",
    quantity: 15,
    entryDate: "2026-09-10",
    expiryDate: "2026-11-30", // Near expiry ~2 months
    price: 24.5,
    unit: "علبة",
    category: "الجهاز التنفسي والأزمات",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    manufacturer: "شركة الخليج للصناعات الدوائية (جلفار)"
  },
  {
    id: "med-5",
    commercialName: "ديباكين كرونو 500 ملجم",
    commercialNameAr: "ديباكين كرونو 500 ملجم",
    commercialNameEn: "Depakine Chrono 500mg",
    scientificName: "Sodium Valproate",
    quantity: 60,
    entryDate: "2026-09-12",
    expiryDate: "2027-08-12",
    price: 110.0,
    unit: "علبة",
    category: "مضادات الصرع والتشنج",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    manufacturer: "الشركة السعودية للصناعات الدوائية (سبيماكو الدوائية)",
    isControlled: true
  },
  {
    id: "med-6",
    commercialName: "لوراتادين 10 ملجم",
    commercialNameAr: "لوراتادين 10 ملجم",
    commercialNameEn: "Loratadine 10mg",
    scientificName: "Loratadine",
    quantity: 200,
    entryDate: "2026-09-22",
    expiryDate: "2026-10-22", // Expiring soon! ~30 days
    price: 12.0,
    unit: "حبة",
    category: "الحساسية ومضادات الهستامين",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    manufacturer: "شركة الخليج للصناعات الدوائية (جلفار)",
    isControlled: false
  },
  {
    id: "med-7",
    commercialName: "ريسبيردال 2 ملجم",
    commercialNameAr: "ريسبيردال 2 ملجم",
    commercialNameEn: "Risperdal 2mg",
    scientificName: "Risperidone",
    quantity: 35,
    entryDate: "2026-09-14",
    expiryDate: "2027-12-01",
    price: 150.0,
    unit: "علبة",
    category: "الرعاية النفسية والسلوكية",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    manufacturer: "شركة نوفارتس العالمية (Novartis)",
    isControlled: true
  }
];

const INITIAL_DISPENSES: DispenseRecord[] = [
  {
    id: "disp-1",
    medicineId: "med-1",
    medicineName: "بنادول اكسترا",
    residentName: "أحمد عبد الله المري",
    quantityDispensed: 2,
    unit: "علبة",
    totalPrice: 31.0,
    actualQuantityDispensed: 2,
    dispensedBy: "د. طارق اليوسف",
    dispensedById: "pharmacist-1",
    dispensedAt: "2026-09-22T10:30:00.000Z"
  },
  {
    id: "disp-2",
    medicineId: "med-5",
    medicineName: "ديباكين كرونو 500 ملجم",
    residentName: "سارة محمد العتيبي",
    quantityDispensed: 1,
    unit: "علبة",
    totalPrice: 110.0,
    actualQuantityDispensed: 1,
    dispensedBy: "د. طارق اليوسف",
    dispensedById: "pharmacist-1",
    dispensedAt: "2026-09-23T08:15:00.000Z"
  }
];

export const getLocalMedicines = (): Medicine[] => {
  const data = localStorage.getItem('care_pharmacy_medicines');
  if (!data) {
    localStorage.setItem('care_pharmacy_medicines', JSON.stringify(INITIAL_MEDICINES));
    return INITIAL_MEDICINES;
  }
  try {
    const list: Medicine[] = JSON.parse(data);
    let changed = false;
    const migrated = list.map(m => {
      // Find matching default if available for english name
      const foundInitial = INITIAL_MEDICINES.find(init => init.id === m.id || init.commercialName === m.commercialName);
      const commercialAr = m.commercialNameAr || (foundInitial ? foundInitial.commercialNameAr : m.commercialName);
      const commercialEn = m.commercialNameEn || (foundInitial ? foundInitial.commercialNameEn : '');
      const entryDate = m.entryDate || (foundInitial ? foundInitial.entryDate : (m.createdAt ? m.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]));
      const isControlled = m.isControlled !== undefined ? m.isControlled : (foundInitial ? !!foundInitial.isControlled : false);
      if (!m.commercialNameAr || !m.commercialNameEn || !m.entryDate || m.isControlled === undefined) {
        changed = true;
      }
      return {
        ...m,
        commercialName: commercialAr || m.commercialName,
        commercialNameAr: commercialAr || m.commercialName,
        commercialNameEn: commercialEn || m.commercialNameEn || '',
        entryDate,
        isControlled
      };
    });
    if (changed) {
      localStorage.setItem('care_pharmacy_medicines', JSON.stringify(migrated));
    }
    return migrated;
  } catch (e) {
    return INITIAL_MEDICINES;
  }
};

export const saveLocalMedicines = (medicines: Medicine[]) => {
  localStorage.setItem('care_pharmacy_medicines', JSON.stringify(medicines));
};

export const getLocalDispenses = (): DispenseRecord[] => {
  const data = localStorage.getItem('care_pharmacy_dispenses');
  if (!data) {
    localStorage.setItem('care_pharmacy_dispenses', JSON.stringify(INITIAL_DISPENSES));
    return INITIAL_DISPENSES;
  }
  return JSON.parse(data);
};

export const saveLocalDispenses = (dispenses: DispenseRecord[]) => {
  localStorage.setItem('care_pharmacy_dispenses', JSON.stringify(dispenses));
};

export const getLocalSessions = (): UserSession[] => {
  const data = localStorage.getItem('care_pharmacy_sessions');
  return data ? JSON.parse(data) : [];
};

export const saveLocalSessions = (sessions: UserSession[]) => {
  localStorage.setItem('care_pharmacy_sessions', JSON.stringify(sessions));
};

const INITIAL_STOCK_LOGS: StockAuditLog[] = [
  {
    id: "log-1",
    medicineId: "med-1",
    medicineName: "بنادول اكسترا (Paracetamol + Caffeine)",
    actionType: "إضافة دواء جديد",
    quantityChanged: 122,
    previousQuantity: 0,
    newQuantity: 122,
    performedByName: "د. طارق اليوسف",
    performedByEmail: "tmrbe2006@gmail.com",
    performedById: "admin-1",
    notes: "رصيد افتتاح لتهيئة مخزن الصيدلية",
    timestamp: "2026-09-20T08:00:00.000Z"
  },
  {
    id: "log-2",
    medicineId: "med-1",
    medicineName: "بنادول اكسترا (Paracetamol + Caffeine)",
    actionType: "صرف دواء لمقيم",
    quantityChanged: -2,
    previousQuantity: 122,
    newQuantity: 120,
    performedByName: "د. طارق اليوسف",
    performedByEmail: "tmrbe2006@gmail.com",
    performedById: "pharmacist-1",
    notes: "صرف علاج مجدول للمقيم: أحمد عبد الله المري",
    timestamp: "2026-09-22T10:30:00.000Z"
  },
  {
    id: "log-3",
    medicineId: "med-5",
    medicineName: "ديباكين كرونو 500 ملجم (Sodium Valproate)",
    actionType: "إضافة دواء جديد",
    quantityChanged: 61,
    previousQuantity: 0,
    newQuantity: 61,
    performedByName: "د. طارق اليوسف",
    performedByEmail: "tmrbe2006@gmail.com",
    performedById: "admin-1",
    notes: "تغذية أصلية لمخزن أدوية الصرع والتشنجات",
    timestamp: "2026-09-20T08:15:00.000Z"
  },
  {
    id: "log-4",
    medicineId: "med-5",
    medicineName: "ديباكين كرونو 500 ملجم (Sodium Valproate)",
    actionType: "صرف دواء لمقيم",
    quantityChanged: -1,
    previousQuantity: 61,
    newQuantity: 60,
    performedByName: "د. طارق اليوسف",
    performedByEmail: "tmrbe2006@gmail.com",
    performedById: "pharmacist-1",
    notes: "صرف علاج مجدول للمقيم: سارة محمد العتيبي",
    timestamp: "2026-09-23T08:15:00.000Z"
  }
];

export const getLocalStockLogs = (): StockAuditLog[] => {
  const data = localStorage.getItem('care_pharmacy_stock_logs');
  if (!data) {
    localStorage.setItem('care_pharmacy_stock_logs', JSON.stringify(INITIAL_STOCK_LOGS));
    return INITIAL_STOCK_LOGS;
  }
  return JSON.parse(data);
};

export const saveLocalStockLogs = (logs: StockAuditLog[]) => {
  localStorage.setItem('care_pharmacy_stock_logs', JSON.stringify(logs));
};

export const getLocalSecuritySettings = (): SecuritySettings => {
  const data = localStorage.getItem('care_pharmacy_security_settings');
  if (!data) return DEFAULT_SECURITY_SETTINGS;
  try {
    return { ...DEFAULT_SECURITY_SETTINGS, ...JSON.parse(data) };
  } catch (e) {
    return DEFAULT_SECURITY_SETTINGS;
  }
};

export const saveLocalSecuritySettings = (settings: SecuritySettings) => {
  localStorage.setItem('care_pharmacy_security_settings', JSON.stringify(settings));
  // Keep legacy individual keys in sync for backward compatibility
  localStorage.setItem('emailEnabled', String(settings.emailEnabled));
  localStorage.setItem('appsScriptUrl', settings.appsScriptUrl);
  localStorage.setItem('notificationEmail', settings.notificationEmail);
  localStorage.setItem('whatsAppEnabled', String(settings.whatsAppEnabled));
  localStorage.setItem('whatsAppMode', settings.whatsAppMode);
  localStorage.setItem('whatsAppNumber', settings.whatsAppNumber);
  localStorage.setItem('callMeBotApiKey', settings.callMeBotApiKey || '');
  localStorage.setItem('ultraMsgInstance', settings.ultraMsgInstance || '');
  localStorage.setItem('ultraMsgToken', settings.ultraMsgToken || '');
  localStorage.setItem('waPilotBaseUrl', settings.waPilotBaseUrl || '');
  localStorage.setItem('waPilotApiKey', settings.waPilotApiKey || '');
  localStorage.setItem('waPilotType', settings.waPilotType || '');
  localStorage.setItem('waPilotDevice', settings.waPilotDevice || '');
  localStorage.setItem('waPilotPath', settings.waPilotPath || '');
  if (settings.alertDays) localStorage.setItem('care_pharmacy_alert_days', String(settings.alertDays));
};

export const DEFAULT_UNITS: string[] = [
  'علبة',
  'شريط',
  'حبة',
  'قرص',
  'كبسولة',
  'أمبولة',
  'قارورة شراب',
  'بخاخ',
  'أنبوب مرهم',
  'قطرة',
  'تحميلة',
  'كيس فوار',
  'ملل'
];

export const DEFAULT_CATEGORIES: string[] = [
  'مسكنات وآلام',
  'أدوية نفسية وعصبية',
  'مضادات حيوية',
  'أمراض مزمنة',
  'جهاز هضمي',
  'جهاز تنفسي',
  'فيتامينات ومكملات',
  'أدوية صرع وتشنجات',
  'مراهم ومستحضرات موضعية',
  'أخرى'
];

export const getLocalUnits = (): string[] => {
  const saved = localStorage.getItem('care_pharmacy_custom_units');
  return saved ? JSON.parse(saved) : DEFAULT_UNITS;
};

export const saveLocalUnits = (units: string[]): void => {
  localStorage.setItem('care_pharmacy_custom_units', JSON.stringify(units));
};

export const getLocalCategories = (): string[] => {
  const saved = localStorage.getItem('care_pharmacy_custom_categories');
  return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
};

export const saveLocalCategories = (categories: string[]): void => {
  localStorage.setItem('care_pharmacy_custom_categories', JSON.stringify(categories));
};

export const INITIAL_RESIDENTS = [
  {
    id: "res-1",
    name: "عبد الرحمن بن سليمان",
    nameAr: "عبد الرحمن بن سليمان",
    nameEn: "Abdulrahman Bin Sulaiman",
    birthDate: "1954-05-14",
    referralDate: "2026-10-11",
    referralFacility: "مستشفى شقراء العام - عيادة الرعاية المتخصصة",
    referralReason: "متابعة استشارية دورية وفحص سريري شامل وتنسيق صرف الأدوية",
    roomNumber: "غرفة 102 - جناح أ",
    nationalId: "1098234812",
    age: 72,
    notes: "يعاني من ضغط الدم المرتفع وحساسية خفيفة من البنسلين",
    allergies: "البنسلين، المكسرات",
    bloodGroup: "O+",
    attendingPhysician: "د. طارق اليوسف",
    chronicDiseases: "ارتفاع ضغط الدم المزمن",
    dosageSchedule: [
      {
        id: "dose-1",
        timeSlot: "08:00",
        medicineId: "med-1",
        medicineName: "بنادول اكسترا",
        dosage: "حبة واحدة بعد الإفطار لآلام الظهر",
        checkedToday: false
      },
      {
        id: "dose-2",
        timeSlot: "21:00",
        medicineId: "med-5",
        medicineName: "ديباكين كرونو 500 ملجم",
        dosage: "حبة واحدة قبل النوم لضبط نوبات الصرع والتشنج",
        checkedToday: true,
        checkedBy: "د. طارق اليوسف",
        checkedAt: "2026-09-24T08:30:00Z"
      }
    ]
  },
  {
    id: "res-2",
    name: "سارة محمد الشمري",
    nameAr: "سارة محمد الشمري",
    nameEn: "Sara Mohammed Al-Shammari",
    birthDate: "1958-08-20",
    referralDate: "2024-04-10",
    roomNumber: "غرفة 105 - جناح أ",
    nationalId: "1087452391",
    age: 68,
    notes: "بحاجة لمراقبة نسبة السكر بانتظام",
    allergies: "لا توجد عوارض حساسية معروفة",
    dosageSchedule: [
      {
        id: "dose-3",
        timeSlot: "13:00",
        medicineId: "med-3",
        medicineName: "بروفين 400 ملجم",
        dosage: "حبة واحدة بعد الغداء عند اللزوم لتخفيف الالتهاب",
        checkedToday: false
      }
    ]
  },
  {
    id: "res-3",
    name: "خالد عبد الله العتيبي",
    nameAr: "خالد عبد الله العتيبي",
    nameEn: "Khalid Abdullah Al-Otaibi",
    birthDate: "1946-10-18",
    referralDate: "2023-11-20",
    roomNumber: "غرفة 201 - جناح ب",
    nationalId: "1034981273",
    age: 80,
    notes: "صعوبة في بلع الأقراص الكبيرة - يفضل الشراب أو المسحوق",
    allergies: "مضادات السلفا (Sulfa Drugs)",
    dosageSchedule: [
      {
        id: "dose-4",
        timeSlot: "08:00",
        medicineId: "med-4",
        medicineName: "فنتولين بخاخ",
        dosage: "بختان صباحاً عند حدوث ضيق بالتنفس لتوسيع الشعب الهوائية",
        checkedToday: false
      }
    ]
  }
];

export const INITIAL_COMPANIES = [
  {
    id: "comp-1",
    name: "شركة الخليج للصناعات الدوائية (جلفار)",
    country: "الإمارات العربية المتحدة",
    contactPerson: "أ. عمر الحوسني",
    phone: "+97172461461",
    email: "info@julphar.net",
    notes: "الوكيل الرئيسي لمسكنات الآلام والمضادات الحيوية بالشرق الأوسط"
  },
  {
    id: "comp-2",
    name: "الشركة السعودية للصناعات الدوائية (سبيماكو الدوائية)",
    country: "المملكة العربية السعودية",
    contactPerson: "د. فيصل العتيبي",
    phone: "+966114774481",
    email: "contact@spimaco.com.sa",
    notes: "المصنع الوطني الأساسي للأدوية المضادة للصرع والاضطرابات السلوكية"
  },
  {
    id: "comp-3",
    name: "شركة نوفارتس العالمية (Novartis)",
    country: "سويسرا",
    contactPerson: "م. سيمون لوران",
    phone: "+41613241111",
    email: "swiss.support@novartis.com",
    notes: "الشركة المصنعة لعقارات ريسبيردال والعلاجات النفسية التخصصية المستوردة"
  }
];

export const INITIAL_BEHAVIOR_LOGS = [
  {
    id: "blog-1",
    residentId: "res-1",
    residentName: "عبد الرحمن بن سليمان",
    loggedAt: "2026-09-24T14:30:00Z",
    loggedBy: "د. طارق اليوسف",
    behaviorRating: "stable",
    sideEffects: ["drowsiness"],
    severity: "mild",
    recentMedicineId: "med-5",
    recentMedicineName: "ديباكين كرونو 500 ملجم",
    notes: "خمول خفيف بعد تناول الجرعة المسائية من الديباكين، لكن السلوك العام مستقر والمريض هادئ."
  },
  {
    id: "blog-2",
    residentId: "res-2",
    residentName: "سارة محمد الشمري",
    loggedAt: "2026-09-24T18:00:00Z",
    loggedBy: "صيدلي. كريم القحطاني",
    behaviorRating: "anxious",
    sideEffects: ["insomnia"],
    severity: "moderate",
    recentMedicineId: "med-3",
    recentMedicineName: "بروفين 400 ملجم",
    notes: "قلق وصعوبة في النوم بعد تناول البروفين، تم توجيه الممرض بتقديمه مبكراً بعد الغداء مباشرة."
  }
];

export const INITIAL_CUSTOM_SIDE_EFFECTS = [
  { key: 'drowsiness', label: 'خمول ونعاس حاد 😴' },
  { key: 'appetite_loss', label: 'فقدان شهية واهتمام 🍽️' },
  { key: 'tremors', label: 'ارتعاش ورجفة بالأطراف 🫨' },
  { key: 'rash', label: 'طفح جلدي وحساسية 🔴' },
  { key: 'nausea', label: 'غثيان واضطراب معدة 🤢' },
  { key: 'insomnia', label: 'أرق وصعوبة نوم حادة ⏰' }
];

export const getLocalResidents = (): any[] => {
  const saved = localStorage.getItem('care_pharmacy_residents');
  return saved ? JSON.parse(saved) : INITIAL_RESIDENTS;
};

export const saveLocalResidents = (residents: any[]): void => {
  localStorage.setItem('care_pharmacy_residents', JSON.stringify(residents));
};

export const getLocalCompanies = (): any[] => {
  const saved = localStorage.getItem('care_pharmacy_companies');
  return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
};

export const saveLocalCompanies = (companies: any[]): void => {
  localStorage.setItem('care_pharmacy_companies', JSON.stringify(companies));
};

export const getLocalBehaviorLogs = (): any[] => {
  const saved = localStorage.getItem('care_pharmacy_behavior_logs');
  return saved ? JSON.parse(saved) : INITIAL_BEHAVIOR_LOGS;
};

export const saveLocalBehaviorLogs = (logs: any[]): void => {
  localStorage.setItem('care_pharmacy_behavior_logs', JSON.stringify(logs));
};

export const getLocalCustomSideEffects = (): { key: string; label: string }[] => {
  const saved = localStorage.getItem('care_pharmacy_custom_side_effects');
  return saved ? JSON.parse(saved) : INITIAL_CUSTOM_SIDE_EFFECTS;
};

export const saveLocalCustomSideEffects = (effects: { key: string; label: string }[]): void => {
  localStorage.setItem('care_pharmacy_custom_side_effects', JSON.stringify(effects));
};

// Helper to prevent Firestore operations from hanging indefinitely
export const withTimeout = <T>(promise: Promise<T>, ms: number = 10000): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
    promise
      .then(res => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

// Unified CRUD Service with Firebase support and clean LocalStorage fallback
export const DbService = {
  // --- Medicines CRUD ---
  async fetchMedicines(): Promise<Medicine[]> {
    try {
      if (isFirebaseConnected) {
        const querySnapshot = await withTimeout(getDocs(collection(db, "medicines")), 10000);
        const list: Medicine[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Medicine);
        });
        
        if (list.length > 0) {
          // Sync with local storage
          saveLocalMedicines(list);
          return list;
        } else {
          // Firestore is completely empty! Seed in background with Promise.allSettled
          console.log("Firestore medicines collection is empty. Seeding INITIAL_MEDICINES in parallel background...");
          Promise.allSettled(
            INITIAL_MEDICINES.map(med => setDoc(doc(db, "medicines", med.id), {
              commercialName: med.commercialName,
              commercialNameAr: med.commercialNameAr || med.commercialName,
              commercialNameEn: med.commercialNameEn || '',
              scientificName: med.scientificName,
              quantity: med.quantity,
              expiryDate: med.expiryDate,
              price: med.price,
              unit: med.unit,
              category: med.category || "عام",
              createdAt: med.createdAt,
              updatedAt: med.updatedAt,
              manufacturer: med.manufacturer || '',
              isControlled: !!med.isControlled
            }))
          ).catch(() => {});
          saveLocalMedicines(INITIAL_MEDICINES);
          return INITIAL_MEDICINES;
        }
      }
    } catch (e) {
      console.warn("Firestore fetchMedicines failed/timed out, returning offline cache:", e);
    }
    return getLocalMedicines();
  },

  async addMedicine(med: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>, actor?: { name: string; email: string; id: string; notes?: string }): Promise<Medicine> {
    const commercialAr = (med.commercialNameAr || med.commercialName || '').trim();
    const commercialEn = (med.commercialNameEn || '').trim();
    const primaryName = commercialAr || commercialEn || med.commercialName || '';
    const entryDate = med.entryDate || new Date().toISOString().split('T')[0];

    const newMed: Medicine = {
      ...med,
      id: "med-" + Math.random().toString(36).substr(2, 9),
      commercialName: primaryName,
      commercialNameAr: commercialAr || primaryName,
      commercialNameEn: commercialEn,
      entryDate: entryDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Attempt Firebase write
    try {
      if (isFirebaseConnected) {
        await setDoc(doc(db, "medicines", newMed.id), {
          commercialName: newMed.commercialName,
          commercialNameAr: newMed.commercialNameAr,
          commercialNameEn: newMed.commercialNameEn,
          scientificName: newMed.scientificName,
          quantity: newMed.quantity,
          entryDate: newMed.entryDate,
          expiryDate: newMed.expiryDate,
          price: newMed.price,
          unit: newMed.unit,
          category: newMed.category || "عام",
          createdAt: newMed.createdAt,
          updatedAt: newMed.updatedAt,
          manufacturer: newMed.manufacturer || '',
          isControlled: !!newMed.isControlled
        });
      }
    } catch (e) {
      console.warn("Firestore addMedicine failed, falling back to LocalStorage:", e);
    }

    // Always keep LocalStorage in sync
    const list = getLocalMedicines();
    list.unshift(newMed);
    saveLocalMedicines(list);

    // Create Audit Log
    const displayMedName = newMed.commercialNameEn 
      ? `${newMed.commercialName} / ${newMed.commercialNameEn} (${newMed.scientificName})`
      : `${newMed.commercialName} (${newMed.scientificName})`;

    await this.addStockLog({
      medicineId: newMed.id,
      medicineName: displayMedName,
      actionType: 'إضافة دواء جديد',
      quantityChanged: newMed.quantity,
      previousQuantity: 0,
      newQuantity: newMed.quantity,
      performedByName: actor?.name || "د. طارق اليوسف",
      performedByEmail: actor?.email || "tmrbe2006@gmail.com",
      performedById: actor?.id || "admin-1",
      notes: actor?.notes || "إدخال صنف دواء جديد للمخزن"
    });

    return newMed;
  },

  async updateMedicine(id: string, updatedFields: Partial<Medicine>, actor?: { name: string; email: string; id: string; notes?: string }): Promise<Medicine> {
    const list = getLocalMedicines();
    const index = list.findIndex(m => m.id === id);
    if (index === -1) throw new Error("الدواء غير موجود");

    const previousQuantity = list[index].quantity;
    const commercialAr = updatedFields.commercialNameAr !== undefined 
      ? updatedFields.commercialNameAr 
      : (updatedFields.commercialName || list[index].commercialNameAr || list[index].commercialName);
    const commercialEn = updatedFields.commercialNameEn !== undefined
      ? updatedFields.commercialNameEn
      : (list[index].commercialNameEn || '');
    const primaryName = commercialAr || updatedFields.commercialName || list[index].commercialName;

    const updatedMed: Medicine = {
      ...list[index],
      ...updatedFields,
      commercialName: primaryName,
      commercialNameAr: commercialAr,
      commercialNameEn: commercialEn,
      entryDate: updatedFields.entryDate || list[index].entryDate || (list[index].createdAt ? list[index].createdAt.split('T')[0] : new Date().toISOString().split('T')[0]),
      isControlled: updatedFields.isControlled !== undefined ? updatedFields.isControlled : list[index].isControlled,
      updatedAt: new Date().toISOString()
    };

    // Attempt Firebase write
    try {
      if (isFirebaseConnected) {
        await setDoc(doc(db, "medicines", id), {
          commercialName: updatedMed.commercialName,
          commercialNameAr: updatedMed.commercialNameAr || '',
          commercialNameEn: updatedMed.commercialNameEn || '',
          scientificName: updatedMed.scientificName,
          quantity: updatedMed.quantity,
          entryDate: updatedMed.entryDate || '',
          expiryDate: updatedMed.expiryDate,
          price: updatedMed.price,
          unit: updatedMed.unit,
          category: updatedMed.category || "عام",
          createdAt: updatedMed.createdAt,
          updatedAt: updatedMed.updatedAt,
          manufacturer: updatedMed.manufacturer || '',
          isControlled: !!updatedMed.isControlled
        }, { merge: true });
      }
    } catch (e) {
      console.warn("Firestore updateMedicine failed, falling back to LocalStorage:", e);
    }

    list[index] = updatedMed;
    saveLocalMedicines(list);

    // Log quantity change if any
    const quantityDifference = updatedMed.quantity - previousQuantity;
    if (quantityDifference !== 0) {
      await this.addStockLog({
        medicineId: updatedMed.id,
        medicineName: `${updatedMed.commercialName} (${updatedMed.scientificName})`,
        actionType: 'تعديل يدوي',
        quantityChanged: quantityDifference,
        previousQuantity,
        newQuantity: updatedMed.quantity,
        performedByName: actor?.name || "د. طارق اليوسف",
        performedByEmail: actor?.email || "tmrbe2006@gmail.com",
        performedById: actor?.id || "admin-1",
        notes: actor?.notes || "تعديل كمية المخزون يدوياً"
      });
    } else if (actor?.notes) {
      await this.addStockLog({
        medicineId: updatedMed.id,
        medicineName: `${updatedMed.commercialName} (${updatedMed.scientificName})`,
        actionType: 'تعديل يدوي',
        quantityChanged: 0,
        previousQuantity,
        newQuantity: updatedMed.quantity,
        performedByName: actor?.name || "د. طارق اليوسف",
        performedByEmail: actor?.email || "tmrbe2006@gmail.com",
        performedById: actor?.id || "admin-1",
        notes: actor.notes
      });
    }

    return updatedMed;
  },

  async deleteMedicine(id: string, actor?: { name: string; email: string; id: string; notes?: string }): Promise<boolean> {
    const list = getLocalMedicines();
    const targetMed = list.find(m => m.id === id);

    // Attempt Firebase delete
    try {
      if (isFirebaseConnected) {
        await deleteDoc(doc(db, "medicines", id));
      }
    } catch (e) {
      console.warn("Firestore deleteMedicine failed, falling back to LocalStorage:", e);
    }

    const filtered = list.filter(m => m.id !== id);
    saveLocalMedicines(filtered);

    if (targetMed) {
      // Create Audit Log
      await this.addStockLog({
        medicineId: targetMed.id,
        medicineName: `${targetMed.commercialName} (${targetMed.scientificName})`,
        actionType: 'حذف دواء',
        quantityChanged: -targetMed.quantity,
        previousQuantity: targetMed.quantity,
        newQuantity: 0,
        performedByName: actor?.name || "د. طارق اليوسف",
        performedByEmail: actor?.email || "tmrbe2006@gmail.com",
        performedById: actor?.id || "admin-1",
        notes: actor?.notes || "شطب الصنف نهائياً وحذفه من السجلات"
      });
    }

    return true;
  },

  // --- Dispense Records ---
  async fetchDispenseRecords(): Promise<DispenseRecord[]> {
    try {
      if (isFirebaseConnected) {
        const querySnapshot = await withTimeout(getDocs(collection(db, "dispense_records")), 10000);
        const list: DispenseRecord[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as DispenseRecord);
        });

        if (list.length > 0) {
          saveLocalDispenses(list);
          return list;
        } else {
          // Seed with initial realistic records in background
          console.log("Firestore dispense_records is empty. Seeding INITIAL_DISPENSES in parallel background...");
          Promise.allSettled(
            INITIAL_DISPENSES.map(rec => setDoc(doc(db, "dispense_records", rec.id), {
              medicineId: rec.medicineId,
              medicineName: rec.medicineName,
              residentName: rec.residentName,
              quantityDispensed: rec.quantityDispensed,
              unit: rec.unit,
              totalPrice: rec.totalPrice,
              actualQuantityDispensed: rec.actualQuantityDispensed,
              dispensedBy: rec.dispensedBy,
              dispensedById: rec.dispensedById,
              dispensedAt: rec.dispensedAt
            }))
          ).catch(() => {});
          saveLocalDispenses(INITIAL_DISPENSES);
          return INITIAL_DISPENSES;
        }
      }
    } catch (e) {
      console.warn("Firestore fetchDispenseRecords failed/timed out, returning offline cache:", e);
    }
    return getLocalDispenses();
  },

  async addDispenseRecord(rec: Omit<DispenseRecord, 'id' | 'dispensedAt'>): Promise<DispenseRecord> {
    const newRec: DispenseRecord = {
      ...rec,
      id: "disp-" + Math.random().toString(36).substr(2, 9),
      dispensedAt: new Date().toISOString()
    };

    // Subtract from inventory quantity automatically (inventory integrity!)
    const medList = getLocalMedicines();
    const medIndex = medList.findIndex(m => m.id === rec.medicineId);
    let previousQuantity = 0;
    let newQty = 0;
    let targetMed: Medicine | null = null;

    if (medIndex !== -1) {
      targetMed = medList[medIndex];
      previousQuantity = targetMed.quantity;
      // Safeguard quantity subtraction with precision rounding to 4 decimal places
      newQty = Math.max(0, Math.round((previousQuantity - rec.actualQuantityDispensed) * 10000) / 10000);
      medList[medIndex].quantity = newQty;
      medList[medIndex].updatedAt = new Date().toISOString();
      saveLocalMedicines(medList);

      // Attempt syncing medicine reduction to Firebase
      try {
        if (isFirebaseConnected) {
          await setDoc(doc(db, "medicines", rec.medicineId), {
            quantity: newQty,
            updatedAt: medList[medIndex].updatedAt
          }, { merge: true });
        }
      } catch (e) {
        console.warn("Firestore inventory sync failed:", e);
      }
    }

    // Write dispense record to Firebase
    try {
      if (isFirebaseConnected) {
        await setDoc(doc(db, "dispense_records", newRec.id), {
          medicineId: newRec.medicineId,
          medicineName: newRec.medicineName,
          residentName: newRec.residentName,
          quantityDispensed: newRec.quantityDispensed,
          unit: newRec.unit,
          totalPrice: newRec.totalPrice,
          actualQuantityDispensed: newRec.actualQuantityDispensed,
          dispensedBy: newRec.dispensedBy,
          dispensedById: newRec.dispensedById,
          dispensedAt: newRec.dispensedAt
        });
      }
    } catch (e) {
      console.warn("Firestore addDispenseRecord failed, falling back to LocalStorage:", e);
    }

    const list = getLocalDispenses();
    list.unshift(newRec);
    saveLocalDispenses(list);

    // Automatically record an Audit Log for the dispensing
    if (targetMed) {
      await this.addStockLog({
        medicineId: targetMed.id,
        medicineName: `${targetMed.commercialName} (${targetMed.scientificName})`,
        actionType: 'صرف دواء لمقيم',
        quantityChanged: -rec.actualQuantityDispensed,
        previousQuantity,
        newQuantity: newQty,
        performedByName: rec.dispensedBy,
        performedByEmail: "pharmacist@carecenter.com",
        performedById: rec.dispensedById,
        notes: `صرف علاج للمقيم: ${rec.residentName}`
      });
    }

    return newRec;
  },

  // --- Security Sessions CRUD ---
  async fetchSessions(): Promise<UserSession[]> {
    try {
      if (isFirebaseConnected) {
        const querySnapshot = await withTimeout(getDocs(collection(db, "user_sessions")), 10000);
        if (!querySnapshot.empty) {
          const list: UserSession[] = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as UserSession);
          });
          saveLocalSessions(list);
          return list;
        }
      }
    } catch (e) {
      console.warn("Firestore fetchSessions failed/timed out, returning local storage:", e);
    }
    return getLocalSessions();
  },

  async logSession(session: Omit<UserSession, 'id'>): Promise<UserSession> {
    const newSession: UserSession = {
      ...session,
      id: "sess-" + Math.random().toString(36).substr(2, 9)
    };

    try {
      if (isFirebaseConnected) {
        await setDoc(doc(db, "user_sessions", newSession.id), {
          userId: newSession.userId,
          name: newSession.name,
          email: newSession.email,
          ipAddress: newSession.ipAddress,
          deviceToken: newSession.deviceToken,
          loginTime: newSession.loginTime
        });
      }
    } catch (e) {
      console.warn("Firestore logSession failed, saving locally:", e);
    }

    const list = getLocalSessions();
    list.unshift(newSession);
    saveLocalSessions(list);
    return newSession;
  },

  // --- Stock Audit Logs CRUD ---
  async fetchStockLogs(): Promise<StockAuditLog[]> {
    try {
      if (isFirebaseConnected) {
        const querySnapshot = await withTimeout(getDocs(collection(db, "stock_audit_logs")), 10000);
        if (!querySnapshot.empty) {
          const list: StockAuditLog[] = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as StockAuditLog);
          });
          // Sort by timestamp descending
          list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          saveLocalStockLogs(list);
          return list;
        }
      }
    } catch (e) {
      console.warn("Firestore fetchStockLogs failed/timed out, returning local storage:", e);
    }
    return getLocalStockLogs();
  },

  async addStockLog(log: Omit<StockAuditLog, 'id' | 'timestamp'>): Promise<StockAuditLog> {
    const newLog: StockAuditLog = {
      ...log,
      id: "log-" + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };

    try {
      if (isFirebaseConnected) {
        await setDoc(doc(db, "stock_audit_logs", newLog.id), {
          medicineId: newLog.medicineId,
          medicineName: newLog.medicineName,
          actionType: newLog.actionType,
          quantityChanged: newLog.quantityChanged,
          previousQuantity: newLog.previousQuantity,
          newQuantity: newLog.newQuantity,
          performedByName: newLog.performedByName,
          performedByEmail: newLog.performedByEmail,
          performedById: newLog.performedById,
          notes: newLog.notes,
          timestamp: newLog.timestamp
        });
      }
    } catch (e) {
      console.warn("Firestore addStockLog failed, saving locally:", e);
    }

    const list = getLocalStockLogs();
    list.unshift(newLog);
    saveLocalStockLogs(list);
    return newLog;
  },

  // --- Users CRUD ---
  async fetchUsers(): Promise<any[]> {
    const DEFAULT_USERS = [
      {
        uid: "user-tmrbe",
        name: "م. تامر (المبرمج)",
        email: "tmrbe2006@gmail.com",
        role: "developer",
        phone: "+966500001122",
        password: "dev"
      },
      {
        uid: "user-100",
        name: "م. عبد الرحمن (المبرمج)",
        email: "dev@carecenter.org",
        role: "developer",
        phone: "+966500001122",
        password: "dev"
      },
      {
        uid: "user-101",
        name: "د. طارق اليوسف",
        email: "yousef.t@carecenter.org",
        role: "admin",
        phone: "+966501234567",
        password: "admin"
      },
      {
        uid: "user-102",
        name: "صيدلي. كريم القحطاني",
        email: "kareem.q@carecenter.org",
        role: "pharmacist",
        phone: "+966507654321",
        password: "pharm"
      },
      {
        uid: "user-103",
        name: "فني. ماجد الرويلي",
        email: "majed.r@carecenter.org",
        role: "technician",
        phone: "+966509998887",
        password: "tech"
      }
    ];

    try {
      if (isFirebaseConnected) {
        const querySnapshot = await withTimeout(getDocs(collection(db, "users")), 10000);
        if (!querySnapshot.empty) {
          const list: any[] = [];
          querySnapshot.forEach((doc) => {
            list.push({ uid: doc.id, ...doc.data() });
          });
          const tmrbeIdx = list.findIndex(u => u.email?.toLowerCase() === 'tmrbe2006@gmail.com');
          if (tmrbeIdx !== -1) {
            list[tmrbeIdx].role = 'developer';
          } else {
            list.unshift(DEFAULT_USERS[0]);
          }
          localStorage.setItem('care_pharmacy_all_users', JSON.stringify(list));
          return list;
        } else {
          // Seed initial users into Firestore in background
          Promise.allSettled(
            DEFAULT_USERS.map(u => setDoc(doc(db, "users", u.uid), {
              name: u.name,
              email: u.email,
              role: u.role,
              phone: u.phone,
              password: u.password
            }))
          ).catch(() => {});
          localStorage.setItem('care_pharmacy_all_users', JSON.stringify(DEFAULT_USERS));
          return DEFAULT_USERS;
        }
      }
    } catch (e) {
      console.warn("Firestore fetchUsers failed/timed out, returning local storage:", e);
    }
    
    const saved = localStorage.getItem('care_pharmacy_all_users');
    let list = saved ? JSON.parse(saved) : DEFAULT_USERS;
    if (Array.isArray(list)) {
      const tmrbeIdx = list.findIndex(u => u.email?.toLowerCase() === 'tmrbe2006@gmail.com');
      if (tmrbeIdx !== -1) {
        list[tmrbeIdx].role = 'developer';
      } else {
        list.unshift(DEFAULT_USERS[0]);
      }
      try { localStorage.setItem('care_pharmacy_all_users', JSON.stringify(list)); } catch (e) {}
      return list;
    }
    return DEFAULT_USERS;
  },

  async addUser(newUser: any): Promise<any> {
    const userWithId = {
      ...newUser,
      uid: newUser.uid || "user-" + Math.random().toString(36).substr(2, 9)
    };

    try {
      if (isFirebaseConnected) {
        await setDoc(doc(db, "users", userWithId.uid), {
          name: userWithId.name,
          email: userWithId.email,
          role: userWithId.role,
          phone: userWithId.phone,
          password: userWithId.password
        });
      }
    } catch (e) {
      console.warn("Firestore addUser failed, saving locally:", e);
    }

    const saved = localStorage.getItem('care_pharmacy_all_users');
    const list = saved ? JSON.parse(saved) : [];
    list.push(userWithId);
    localStorage.setItem('care_pharmacy_all_users', JSON.stringify(list));
    return userWithId;
  },

  async updateUser(updatedUser: any): Promise<any> {
    try {
      if (isFirebaseConnected) {
        await setDoc(doc(db, "users", updatedUser.uid), {
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phone: updatedUser.phone,
          password: updatedUser.password
        }, { merge: true });
      }
    } catch (e) {
      console.warn("Firestore updateUser failed, saving locally:", e);
    }

    const saved = localStorage.getItem('care_pharmacy_all_users');
    let list = saved ? JSON.parse(saved) : [];
    list = list.map((u: any) => u.uid === updatedUser.uid ? updatedUser : u);
    localStorage.setItem('care_pharmacy_all_users', JSON.stringify(list));
    return updatedUser;
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      if (isFirebaseConnected) {
        await deleteDoc(doc(db, "users", userId));
      }
    } catch (e) {
      console.warn("Firestore deleteUser failed, saving locally:", e);
    }

    const saved = localStorage.getItem('care_pharmacy_all_users');
    let list = saved ? JSON.parse(saved) : [];
    list = list.filter((u: any) => u.uid !== userId);
    localStorage.setItem('care_pharmacy_all_users', JSON.stringify(list));
  },

  // --- Security & Channel Settings CRUD with Firestore persistence ---
  async fetchSecuritySettings(): Promise<SecuritySettings> {
    try {
      if (isFirebaseConnected) {
        const snap = await withTimeout(getDoc(doc(db, "security_settings", "config")), 10000);
        if (snap.exists()) {
          const data = snap.data() as Partial<SecuritySettings>;
          const merged: SecuritySettings = {
            ...DEFAULT_SECURITY_SETTINGS,
            ...data,
            id: "config"
          };
          saveLocalSecuritySettings(merged);
          return merged;
        } else {
          // Initialize Firestore with default settings in background
          console.log("Firestore security_settings is empty. Seeding DEFAULT_SECURITY_SETTINGS into Firestore in background...");
          setDoc(doc(db, "security_settings", "config"), DEFAULT_SECURITY_SETTINGS).catch(() => {});
          saveLocalSecuritySettings(DEFAULT_SECURITY_SETTINGS);
          return DEFAULT_SECURITY_SETTINGS;
        }
      }
    } catch (e) {
      console.warn("Firestore fetchSecuritySettings failed/timed out, falling back to local storage:", e);
    }
    return getLocalSecuritySettings();
  },

  async saveSecuritySettings(settings: Partial<SecuritySettings>, actor?: { name?: string; email?: string }): Promise<SecuritySettings> {
    const current = getLocalSecuritySettings();
    const updated: SecuritySettings = {
      ...current,
      ...settings,
      id: "config",
      updatedAt: new Date().toISOString(),
      updatedBy: actor?.name || "م. تامر"
    };

    try {
      if (isFirebaseConnected) {
        await setDoc(doc(db, "security_settings", "config"), {
          emailEnabled: updated.emailEnabled,
          appsScriptUrl: updated.appsScriptUrl,
          notificationEmail: updated.notificationEmail,
          whatsAppEnabled: updated.whatsAppEnabled,
          whatsAppMode: updated.whatsAppMode,
          whatsAppNumber: updated.whatsAppNumber,
          callMeBotApiKey: updated.callMeBotApiKey || '',
          ultraMsgInstance: updated.ultraMsgInstance || '',
          ultraMsgToken: updated.ultraMsgToken || '',
          waPilotBaseUrl: updated.waPilotBaseUrl || '',
          waPilotApiKey: updated.waPilotApiKey || '',
          waPilotType: updated.waPilotType || '',
          waPilotDevice: updated.waPilotDevice || '',
          waPilotPath: updated.waPilotPath || '',
          alertDays: updated.alertDays || 30,
          updatedAt: updated.updatedAt,
          updatedBy: updated.updatedBy
        }, { merge: true });
        console.log("Security settings saved successfully to Firestore (security_settings/config)");
      }
    } catch (e) {
      console.warn("Firestore saveSecuritySettings failed, saving locally:", e);
    }

    saveLocalSecuritySettings(updated);
    return updated;
  },

  // --- Units CRUD with Firestore Database Persistence ---
  async fetchUnits(): Promise<string[]> {
    try {
      if (isFirebaseConnected) {
        const snap = await withTimeout(getDoc(doc(db, "settings", "units_and_categories")), 10000);
        if (snap.exists() && Array.isArray(snap.data()?.units) && snap.data()?.units.length > 0) {
          const loadedUnits = snap.data()?.units as string[];
          saveLocalUnits(loadedUnits);
          return loadedUnits;
        } else {
          // Seed Firestore with DEFAULT_UNITS in parallel background
          console.log("Seeding DEFAULT_UNITS into Firestore in background...");
          Promise.allSettled([
            setDoc(doc(db, "settings", "units_and_categories"), {
              units: DEFAULT_UNITS,
              updatedAt: new Date().toISOString()
            }, { merge: true }),
            ...DEFAULT_UNITS.map(u => setDoc(doc(db, "item_units", u), {
              name: u,
              createdAt: new Date().toISOString()
            }))
          ]).catch(() => {});

          saveLocalUnits(DEFAULT_UNITS);
          return DEFAULT_UNITS;
        }
      }
    } catch (e) {
      console.warn("Firestore fetchUnits failed/timed out, falling back to local storage:", e);
    }
    return getLocalUnits();
  },

  async saveUnits(units: string[]): Promise<string[]> {
    saveLocalUnits(units);
    try {
      if (isFirebaseConnected) {
        await setDoc(doc(db, "settings", "units_and_categories"), {
          units: units,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        for (const u of units) {
          await setDoc(doc(db, "item_units", u), {
            name: u,
            updatedAt: new Date().toISOString()
          });
        }
      }
    } catch (e) {
      console.warn("Firestore saveUnits failed, saved locally:", e);
    }
    return units;
  },

  async addUnit(name: string): Promise<string[]> {
    const cleaned = name.trim();
    if (!cleaned) return getLocalUnits();
    const current = await this.fetchUnits();
    if (current.includes(cleaned)) return current;
    const updated = [...current, cleaned];
    await this.saveUnits(updated);
    try {
      if (isFirebaseConnected) {
        await setDoc(doc(db, "item_units", cleaned), {
          name: cleaned,
          createdAt: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn("Firestore addUnit doc failed:", e);
    }
    return updated;
  },

  async updateUnit(oldName: string, newName: string): Promise<string[]> {
    const cleaned = newName.trim();
    if (!cleaned || cleaned === oldName) return getLocalUnits();
    const current = await this.fetchUnits();
    const updated = current.map(u => u === oldName ? cleaned : u);
    await this.saveUnits(updated);
    try {
      if (isFirebaseConnected) {
        await deleteDoc(doc(db, "item_units", oldName));
        await setDoc(doc(db, "item_units", cleaned), {
          name: cleaned,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn("Firestore updateUnit failed:", e);
    }
    return updated;
  },

  async deleteUnit(name: string): Promise<string[]> {
    const current = await this.fetchUnits();
    const updated = current.filter(u => u !== name);
    await this.saveUnits(updated);
    try {
      if (isFirebaseConnected) {
        await deleteDoc(doc(db, "item_units", name));
      }
    } catch (e) {
      console.warn("Firestore deleteUnit failed:", e);
    }
    return updated;
  },

  // --- Therapeutic Categories CRUD with Firestore Database Persistence ---
  async fetchCategories(): Promise<string[]> {
    try {
      if (isFirebaseConnected) {
        const snap = await withTimeout(getDoc(doc(db, "settings", "units_and_categories")), 10000);
        if (snap.exists() && Array.isArray(snap.data()?.categories) && snap.data()?.categories.length > 0) {
          const loadedCats = snap.data()?.categories as string[];
          saveLocalCategories(loadedCats);
          return loadedCats;
        } else {
          // Seed Firestore with DEFAULT_CATEGORIES in parallel background
          console.log("Seeding DEFAULT_CATEGORIES into Firestore in background...");
          Promise.allSettled([
            setDoc(doc(db, "settings", "units_and_categories"), {
              categories: DEFAULT_CATEGORIES,
              updatedAt: new Date().toISOString()
            }, { merge: true }),
            ...DEFAULT_CATEGORIES.map(c => setDoc(doc(db, "therapeutic_categories", c), {
              name: c,
              createdAt: new Date().toISOString()
            }))
          ]).catch(() => {});

          saveLocalCategories(DEFAULT_CATEGORIES);
          return DEFAULT_CATEGORIES;
        }
      }
    } catch (e) {
      console.warn("Firestore fetchCategories failed/timed out, falling back to local storage:", e);
    }
    return getLocalCategories();
  },

  async saveCategories(categories: string[]): Promise<string[]> {
    saveLocalCategories(categories);
    try {
      if (isFirebaseConnected) {
        await setDoc(doc(db, "settings", "units_and_categories"), {
          categories: categories,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        for (const c of categories) {
          await setDoc(doc(db, "therapeutic_categories", c), {
            name: c,
            updatedAt: new Date().toISOString()
          });
        }
      }
    } catch (e) {
      console.warn("Firestore saveCategories failed, saved locally:", e);
    }
    return categories;
  },

  async addCategory(name: string): Promise<string[]> {
    const cleaned = name.trim();
    if (!cleaned) return getLocalCategories();
    const current = await this.fetchCategories();
    if (current.includes(cleaned)) return current;
    const updated = [...current, cleaned];
    await this.saveCategories(updated);
    try {
      if (isFirebaseConnected) {
        await setDoc(doc(db, "therapeutic_categories", cleaned), {
          name: cleaned,
          createdAt: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn("Firestore addCategory doc failed:", e);
    }
    return updated;
  },

  async updateCategory(oldName: string, newName: string): Promise<string[]> {
    const cleaned = newName.trim();
    if (!cleaned || cleaned === oldName) return getLocalCategories();
    const current = await this.fetchCategories();
    const updated = current.map(c => c === oldName ? cleaned : c);
    await this.saveCategories(updated);
    try {
      if (isFirebaseConnected) {
        await deleteDoc(doc(db, "therapeutic_categories", oldName));
        await setDoc(doc(db, "therapeutic_categories", cleaned), {
          name: cleaned,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn("Firestore updateCategory failed:", e);
    }
    return updated;
  },

  async deleteCategory(name: string): Promise<string[]> {
    const current = await this.fetchCategories();
    const updated = current.filter(c => c !== name);
    await this.saveCategories(updated);
    try {
      if (isFirebaseConnected) {
        await deleteDoc(doc(db, "therapeutic_categories", name));
      }
    } catch (e) {
      console.warn("Firestore deleteCategory failed:", e);
    }
    return updated;
  },

  // --- Residents CRUD & Cloud Sync ---
  async fetchResidents(): Promise<any[]> {
    try {
      if (isFirebaseConnected) {
        const querySnapshot = await withTimeout(getDocs(collection(db, "residents")), 7000);
        if (!querySnapshot.empty) {
          const list: any[] = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          saveLocalResidents(list);
          return list;
        } else {
          // If Firestore is empty, seed from local storage or initial defaults
          const existing = getLocalResidents();
          const toSeed = existing.length > 0 ? existing : INITIAL_RESIDENTS;
          Promise.allSettled(
            toSeed.map(r => setDoc(doc(db, "residents", r.id), r))
          ).catch(() => {});
          saveLocalResidents(toSeed);
          return toSeed;
        }
      }
    } catch (e) {
      console.warn("Firestore fetchResidents failed/timed out, returning offline cache:", e);
    }
    return getLocalResidents();
  },

  async saveResident(resident: any): Promise<any> {
    const resWithId = {
      ...resident,
      id: resident.id || "res-" + Math.random().toString(36).substr(2, 9)
    };
    try {
      if (isFirebaseConnected) {
        await setDoc(doc(db, "residents", resWithId.id), resWithId);
      }
    } catch (e) {
      console.warn("Firestore saveResident failed, saving locally:", e);
    }
    const current = getLocalResidents();
    const idx = current.findIndex(r => r.id === resWithId.id);
    if (idx !== -1) {
      current[idx] = resWithId;
    } else {
      current.push(resWithId);
    }
    saveLocalResidents(current);
    return resWithId;
  },

  async deleteResident(id: string): Promise<void> {
    try {
      if (isFirebaseConnected) {
        await deleteDoc(doc(db, "residents", id));
      }
    } catch (e) {
      console.warn("Firestore deleteResident failed, updating locally:", e);
    }
    const current = getLocalResidents();
    const filtered = current.filter(r => r.id !== id);
    saveLocalResidents(filtered);
  },

  async syncAllResidents(list: any[]): Promise<void> {
    saveLocalResidents(list);
    try {
      if (isFirebaseConnected) {
        await Promise.allSettled(
          list.map(r => setDoc(doc(db, "residents", r.id), r))
        );
      }
    } catch (e) {
      console.warn("Firestore syncAllResidents failed:", e);
    }
  },

  // --- Pharmaceutical Companies CRUD & Cloud Sync ---
  async fetchCompanies(): Promise<any[]> {
    try {
      if (isFirebaseConnected) {
        const querySnapshot = await withTimeout(getDocs(collection(db, "pharmaceutical_companies")), 10000);
        if (!querySnapshot.empty) {
          const list: any[] = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          saveLocalCompanies(list);
          return list;
        } else {
          const existing = getLocalCompanies();
          const toSeed = existing.length > 0 ? existing : INITIAL_COMPANIES;
          Promise.allSettled(
            toSeed.map(c => setDoc(doc(db, "pharmaceutical_companies", c.id), c))
          ).catch(() => {});
          saveLocalCompanies(toSeed);
          return toSeed;
        }
      }
    } catch (e) {
      console.warn("Firestore fetchCompanies failed, returning offline cache:", e);
    }
    return getLocalCompanies();
  },

  async saveCompany(company: any): Promise<any> {
    const compWithId = {
      ...company,
      id: company.id || "comp-" + Math.random().toString(36).substr(2, 9)
    };
    try {
      if (isFirebaseConnected) {
        await setDoc(doc(db, "pharmaceutical_companies", compWithId.id), compWithId);
      }
    } catch (e) {
      console.warn("Firestore saveCompany failed:", e);
    }
    const current = getLocalCompanies();
    const idx = current.findIndex(c => c.id === compWithId.id);
    if (idx !== -1) current[idx] = compWithId;
    else current.push(compWithId);
    saveLocalCompanies(current);
    return compWithId;
  },

  async deleteCompany(id: string): Promise<void> {
    try {
      if (isFirebaseConnected) {
        await deleteDoc(doc(db, "pharmaceutical_companies", id));
      }
    } catch (e) {
      console.warn("Firestore deleteCompany failed:", e);
    }
    const current = getLocalCompanies();
    saveLocalCompanies(current.filter(c => c.id !== id));
  },

  async syncAllCompanies(list: any[]): Promise<void> {
    saveLocalCompanies(list);
    try {
      if (isFirebaseConnected) {
        await Promise.allSettled(list.map(c => setDoc(doc(db, "pharmaceutical_companies", c.id), c)));
      }
    } catch (e) {}
  },

  // --- Behavior Logs CRUD & Cloud Sync ---
  async fetchBehaviorLogs(): Promise<any[]> {
    try {
      if (isFirebaseConnected) {
        const querySnapshot = await withTimeout(getDocs(collection(db, "behavior_logs")), 10000);
        if (!querySnapshot.empty) {
          const list: any[] = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          list.sort((a, b) => new Date(b.loggedAt || 0).getTime() - new Date(a.loggedAt || 0).getTime());
          saveLocalBehaviorLogs(list);
          return list;
        } else {
          const existing = getLocalBehaviorLogs();
          const toSeed = existing.length > 0 ? existing : INITIAL_BEHAVIOR_LOGS;
          Promise.allSettled(toSeed.map(b => setDoc(doc(db, "behavior_logs", b.id), b))).catch(() => {});
          saveLocalBehaviorLogs(toSeed);
          return toSeed;
        }
      }
    } catch (e) {
      console.warn("Firestore fetchBehaviorLogs failed:", e);
    }
    return getLocalBehaviorLogs();
  },

  async addBehaviorLog(log: any): Promise<any> {
    const logWithId = {
      ...log,
      id: log.id || "blog-" + Math.random().toString(36).substr(2, 9),
      loggedAt: log.loggedAt || new Date().toISOString()
    };
    try {
      if (isFirebaseConnected) {
        await setDoc(doc(db, "behavior_logs", logWithId.id), logWithId);
      }
    } catch (e) {
      console.warn("Firestore addBehaviorLog failed:", e);
    }
    const current = getLocalBehaviorLogs();
    current.unshift(logWithId);
    saveLocalBehaviorLogs(current);
    return logWithId;
  },

  async deleteBehaviorLog(id: string): Promise<void> {
    try {
      if (isFirebaseConnected) {
        await deleteDoc(doc(db, "behavior_logs", id));
      }
    } catch (e) {}
    const current = getLocalBehaviorLogs();
    saveLocalBehaviorLogs(current.filter(b => b.id !== id));
  },

  async syncAllBehaviorLogs(list: any[]): Promise<void> {
    saveLocalBehaviorLogs(list);
    try {
      if (isFirebaseConnected) {
        await Promise.allSettled(list.map(b => setDoc(doc(db, "behavior_logs", b.id), b)));
      }
    } catch (e) {}
  },

  // --- Custom Side Effects Cloud Sync ---
  async fetchCustomSideEffects(): Promise<{ key: string; label: string }[]> {
    try {
      if (isFirebaseConnected) {
        const docSnap = await withTimeout(getDoc(doc(db, "settings", "custom_side_effects")), 10000);
        if (docSnap.exists() && docSnap.data().items) {
          const items = docSnap.data().items;
          saveLocalCustomSideEffects(items);
          return items;
        } else {
          const items = getLocalCustomSideEffects();
          setDoc(doc(db, "settings", "custom_side_effects"), {
            items,
            updatedAt: new Date().toISOString()
          }).catch(() => {});
          return items;
        }
      }
    } catch (e) {
      console.warn("Firestore fetchCustomSideEffects failed:", e);
    }
    return getLocalCustomSideEffects();
  },

  async saveCustomSideEffects(effects: { key: string; label: string }[]): Promise<{ key: string; label: string }[]> {
    saveLocalCustomSideEffects(effects);
    try {
      if (isFirebaseConnected) {
        await setDoc(doc(db, "settings", "custom_side_effects"), {
          items: effects,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (e) {}
    return effects;
  }
};
