export interface ScreenGuide {
  id: string;
  icon: string;
  titleAr: string;
  titleEn: string;
  shortDescAr: string;
  shortDescEn: string;
  categoryAr: string;
  categoryEn: string;
  kpisAr: string[];
  kpisEn?: string[];
  featuresAr: { title: string; desc: string }[];
  featuresEn?: { title: string; desc: string }[];
  stepsAr: string[];
  stepsEn?: string[];
  tipsAr: string[];
  tipsEn?: string[];
}

export const SYSTEM_HELP_SECTIONS: ScreenGuide[] = [
  {
    id: 'dashboard',
    icon: '📊',
    titleAr: 'لوحة التحكم والتحليلات العامة (Executive Dashboard)',
    titleEn: 'Executive Dashboard & Analytics',
    shortDescAr: 'المركز القيادي الرئيسي لمتابعة المؤشرات الحيوية لمخزون الأدوية، وحركة الصرف اليومية والشهرية، والتنبيهات الوقائية الحرجة لمقيمي مركز التأهيل الشامل للذكور بشقراء.',
    shortDescEn: 'Central command dashboard monitoring stock valuation, consumption trends, and critical safety alerts for Shaqra Rehabilitation Center.',
    categoryAr: 'الإدارة والمؤشرات',
    categoryEn: 'Management & KPIs',
    kpisAr: [
      'القيمة الإجمالية للمخزون الدوائي (Total Stock Value) بالريال السعودي محسوبة بدقة حسب أسعار الوحدات.',
      'إجمالي عدد الأصناف الدوائية المسجلة والمفعلة بالمستودع الصيدلاني.',
      'حجم الكميات والجرعات المصروفة فعلياً وتراكمياً لجميع المقيمين المستفيدين.',
      'عدد الأدوية القريبة من انتهاء الصلاحية خلال فترة التنبيه المحددة (افتراضياً 90 يوماً).',
      'الأدوية المنتهية الصلاحية الفعلية أو التي بلغت حد المخزون الحرج (15 وحدة أو أقل).'
    ],
    kpisEn: [
      'Total pharmaceutical inventory valuation in SAR based on verified unit prices.',
      'Total registered and active medication items in warehouse.',
      'Cumulative volume of doses dispensed to beneficiary residents.',
      'Medications nearing expiration within the configured threshold (default 90 days).',
      'Expired items and critical stock deficit alerts (15 units or less).'
    ],
    featuresAr: [
      {
        title: 'بطاقات التقييم الفوري والمخاطر الحرجة (KPI Scorecards)',
        desc: 'أربعة مؤشرات رقمية ملونة تعكس الوضع المالي واللوجستي للأدوية مع تنبيهات فورية للمخاطر وتوجيهات المعالجة.'
      },
      {
        title: 'تقرير الإحالات الطبية للمقيمين (قبلها بيوم) 🔔 (خاص بالمبرمج)',
        desc: 'زر مخصص لصلاحية المبرمج يتيح استعراض وإرسال تقرير الإحالات للمستشفيات والعيادات التخصصية المستحقة خلال 24 ساعة، مع إرسال تلقائي يومي كل صباح لمسؤولي الصيدلية عبر البريد.'
      },
      {
        title: 'محاكاة الإشعارات وتنبيهات الأمان (خاص بالمبرمج)',
        desc: 'أداة اختبار متقدمة للمبرمج لمحاكاة فحص الصلاحية والمخزون الصباحي وإرسال التقارير عبر قنوات الإرسال المعتمدة.'
      },
      {
        title: 'مشاركة تقرير الرقابة الدوائية عبر WhatsApp 📲',
        desc: 'نافذة متكاملة لتوليد ومشاركة ملخص الرقابة الدوائية عبر تطبيق واتساب، مدعمة بروابط مباشرة لتنزيل ملفات الـ PDF الرسمية المعتمدة باللغتين العربية والإنجليزية.'
      },
      {
        title: 'الرسم البياني لاستهلاك الأدوية والتوزيع العلاجي',
        desc: 'مخطط زمني تفاعلي يحلل حجم الصرف مقابل القيمة المالية عبر الأشهر، ومخطط دائري يوضح نسب الأدوية النفسية والعصبية ومسكنات الألم وأدوية الأمراض المزمنة.'
      }
    ],
    featuresEn: [
      {
        title: 'Instant KPI Scorecards & Risk Alerts',
        desc: 'Color-coded metric cards reflecting financial, logistical, and safety statuses.'
      },
      {
        title: 'Resident Refill Alerts (1-Day Prior Notice) 🔔 (Developer Only)',
        desc: 'Restricted developer tool to view and dispatch refills due within 24 hours, with auto-pilot morning email dispatch.'
      },
      {
        title: 'Notification & Safety Simulation (Developer Only)',
        desc: 'Advanced testing tool for developers to simulate morning safety checks and verify dispatch gateways.'
      },
      {
        title: 'Instant WhatsApp Medication Report 📲',
        desc: 'Integrated tool to compose and dispatch formatted stock summaries via WhatsApp, bundled with direct server links to official PDF downloads.'
      },
      {
        title: 'Consumption Trends & Class Breakdown Charts',
        desc: 'Interactive monthly expenditure charts and therapeutic category distribution graphs.'
      }
    ],
    stepsAr: [
      'فور تسجيل الدخول، تفتح لوحة التحكم تلقائياً وتفحص مؤشرات الأدوية منتهية الصلاحية أو ذات الرصيد الحرج.',
      'انقر على زر "صرف دواء جديد" لإطلاق شاشة الصرف السريع الفوري لأي مقيم.',
      'انقر على زر "تقرير الرقابة عبر واتساب 📲" لفتح نافذة المشاركة، وإدخال رقم هاتف المستلم، ونسخ النص أو إرساله مباشرةً.',
      'استخدم زر "طباعة تقرير جرد المخازن" في أعلى اللوحة لاستخراج تقرير رسمي موقع من الصيدلي والإدارة.'
    ],
    stepsEn: [
      'Upon sign-in, the dashboard automatically highlights expired or critical stock items.',
      'Click "New Dispense" to launch rapid dispensing for any resident.',
      'Click "WhatsApp Report 📲" to enter recipient mobile, copy summary, or open WhatsApp with official PDF links.',
      'Use "Print Inventory Stocktaking" for an official signed warehouse report.'
    ],
    tipsAr: [
      'يُنصح بمراجعة بطاقة "قريبة انتهاء الصلاحية" أسبوعياً لتقديم الأدوية ذات الصلاحية الأقرب وفق مبدأ (FEFO) وضمان عدم هدر أي دواء.'
    ],
    tipsEn: [
      'Check the "Near Expiry" card weekly to enforce First-Expired-First-Out (FEFO) dispensing.'
    ]
  },
  {
    id: 'inventory',
    icon: '📦',
    titleAr: 'إدارة المخزون والمستودع الدوائي (Drug Inventory)',
    titleEn: 'Drug Inventory & Stock Management',
    shortDescAr: 'إدارة مستودع الأدوية بالكامل: إضافة الأصناف بالاسمين التجاريين (العربي والإنجليزي)، الاسم العلمي، الفئات العلاجية، أرقام التشغيلات، أسعار الوحدات، وحساب الصلاحية آلياً.',
    shortDescEn: 'Comprehensive pharmaceutical inventory with bilingual names, generic classification, batch tracking, cost valuation, and expiry alarms.',
    categoryAr: 'المستودع والإمداد',
    categoryEn: 'Supply & Warehouse',
    kpisAr: [
      'الاسم التجاري باللغة العربية والاسم التجاري باللغة الإنجليزية لكل دواء.',
      'الاسم العلمي والمادة الفعالة (Scientific Name / Active Ingredient).',
      'التصنيف العلاجي الدوائي (أدوية نفسية، مسكنات، مضادات حيوية، جهاز هضمي...).',
      'تاريخ الصلاحية وتصنيفه اللوني (أخضر: سليم، أصفر: قريب الانتهاء، أحمر: منتهي).',
      'الكمية المتوفرة، وحدة الصرف (علبة، شريط، حبة، ملل)، وسعر الوحدة والقيمة الإجمالية.'
    ],
    kpisEn: [
      'Bilingual brand names (Arabic and English) for every medication.',
      'Scientific generic name and active chemical ingredient.',
      'Therapeutic classification (Neuropsychiatric, Analgesics, Antibiotics...).',
      'Color-coded expiration dates (green: safe, yellow: near expiry, red: expired).',
      'Available quantities, dispensing units, unit price, and total extended line value.'
    ],
    featuresAr: [
      {
        title: 'محرك بحث وفلترة متعدد المعايير',
        desc: 'بحث لحظي بالاسم التجاري العربي أو الإنجليزي، الاسم العلمي، الفئة، مع تصفية حسب حالة الصلاحية (الكل، سليم، قريب الانتهاء، منتهي).'
      },
      {
        title: 'نموذج إضافة دواء جديد متكامل',
        desc: 'إدخال دقيق للأسماء الثنائية، الشركة المصنعة، السعر، الكمية، والوحدة، مع التحقق الذكي من صحة التواريخ.'
      },
      {
        title: 'تعديل الصنف السريع والآمن',
        desc: 'تحديث بيانات أي دواء مع توثيق التعديل في سجل التدقيق التراكمي لضمان المساءلة.'
      },
      {
        title: 'تصدير البيانات إلى Excel/CSV وطباعة الجرد',
        desc: 'تصدير كشف المخزون كاملاً إلى ملف جداول بيانات Excel، أو طباعة تقرير الجرد الميداني الرسمي المنسق.'
      }
    ],
    featuresEn: [
      {
        title: 'Multi-Criteria Search & Filtering Engine',
        desc: 'Instant search across Arabic/English names, generic terms, and status filters.'
      },
      {
        title: 'Comprehensive Medication Entry Form',
        desc: 'Detailed input fields for bilingual names, manufacturer, price, quantity, and dates.'
      },
      {
        title: 'Quick & Secure Item Editing',
        desc: 'Inline editing with automatic audit trail recording for strict transparency.'
      },
      {
        title: 'Excel/CSV Export & Official Inventory Print',
        desc: 'One-click export to spreadsheet formats or official printable inventory sheets.'
      }
    ],
    stepsAr: [
      'انقر على زر "+ إضافة دواء جديد" أعلى جدول المخزون.',
      'أدخل الاسم التجاري بالعربية والإنجليزية، والاسم العلمي، والتصنيف الدوائي، والشركة المصنعة.',
      'حدد الكمية المتوفرة، وحدة الصرف، وسعر الوحدة، وتاريخ انتهاء الصلاحية، ثم اضغط "حفظ الدواء".',
      'لتعديل أي صنف، انقر على أيقونة القلم (تعديل ✏️) في صف الدواء بالجدول.'
    ],
    stepsEn: [
      'Click "+ Add New Medication" above the inventory table.',
      'Enter Arabic and English trade names, generic name, category, and manufacturer.',
      'Specify quantity, dispensing unit, unit price, and expiry date, then click "Save".',
      'To edit any item, click the pencil icon (Edit ✏️) in the table row.'
    ],
    tipsAr: [
      'استخدم فلتر "منتهية الصلاحية" لعزل الأدوية التي انتهت صلاحيتها وسحبها فوراً من الرفوف وفق معايير وزارة الصحة.'
    ],
    tipsEn: [
      'Use the "Expired" quick filter to isolate and quarantine outdated items immediately.'
    ]
  },
  {
    id: 'dispense',
    icon: '💊',
    titleAr: 'الصرف الدوائي السريع والفحص السريري (Medication Dispense)',
    titleEn: 'Medication Dispense & Clinical Safety',
    shortDescAr: 'شاشة الصرف اليومي لمقيمي المركز، مزودة بمربعات بحث فورية عن المقيم وعن الدواء، مع فحص تلقائي للحساسية وتعديل الكميات الفعلية المصروفة.',
    shortDescEn: 'Clinical dispensing module with live resident and medication search boxes, automated allergy screening, and dosage verification.',
    categoryAr: 'الصرف والتمريض',
    categoryEn: 'Dispense & Nursing',
    kpisAr: [
      'مربع بحث فوري وذكي عن المقيم (بالاسم العربي/الإنجليزي، رقم الغرفة، الهوية الوطنية).',
      'مربع بحث فوري عن الدواء مع عرض الرصيد المتبقي الفعلي في المستودع.',
      'الكمية المطلوبة والكمية المصروفة فعلياً للمراجعة والتدقيق الدوائي.',
      'حساب فوري للتكلفة الإجمالية بناءً على سعر وحدة الدواء والكمية المصروفة.',
      'اسم الصيدلي المنفذ وتاريخ وتوقيت الصرف الدقيق بالثانية.'
    ],
    kpisEn: [
      'Smart live search for residents (Arabic/English name, room number, National ID).',
      'Instant medication search box displaying physical shelf balance.',
      'Prescribed vs. actual dispensed quantity fields for clinical reconciliation.',
      'Real-time cost computation based on unit price and dispensed amount.',
      'Dispensing pharmacist identifier and precision timestamp.'
    ],
    featuresAr: [
      {
        title: 'مربع البحث الفوري عن المقيم المستفيد',
        desc: 'حقل بحث تفاعلي يفلتر قائمة المقيمين بمجرد الكتابة، مع إظهار بطاقة تعريفية للمقيم المختار (الاسم، الغرفة، الهوية، والحساسيات) مع زر لإلغاء الاختيار.'
      },
      {
        title: 'مربع البحث الفوري عن الدواء',
        desc: 'حقل بحث يتيح العثور على الصنف المطلوب بالاسم التجاري أو العلمي بسرعة، مع التحقق الفوري من توفر الرصيد الكافي بالمخزن.'
      },
      {
        title: 'الفحص التلقائي للحساسية الدوائية (Allergy Alert)',
        desc: 'نظام حماية صارم يظهر تنبيهاً أحمر ويمنع صرف الدواء إذا كان المقيم يعاني من حساسية مسجلة تجاه المادة الفعالة.'
      },
      {
        title: 'فلترة وتصفية سجلات الصرف بين تاريخين وبالوقت',
        desc: 'شريط أدوات متقدم للبحث في تاريخ الصرف، فلترة ما بين تاريخين، البحث بوقت محدد، أو باسم الصيدلي والمقيم.'
      },
      {
        title: 'طباعة سند الصرف الفردي وختم الصيدلية',
        desc: 'إمكانية طباعة إيصال رسمي لكل حركة صرف تحتوي على كافة التفاصيل الطبية والمالية.'
      }
    ],
    featuresEn: [
      {
        title: 'Live Resident Search & Confirmation Card',
        desc: 'Interactive search filtering resident options with selected patient details badge and clear button.'
      },
      {
        title: 'Instant Medication Search Field',
        desc: 'Find items rapidly with instant stock balance validation.'
      },
      {
        title: 'Automated Drug Allergy Screening',
        desc: 'Strict safety intercept preventing dispensing if resident has documented allergy to the drug.'
      },
      {
        title: 'Date-Range & Timestamp Dispense Filtering',
        desc: 'Search between start and end dates, specific times, pharmacist, or resident.'
      },
      {
        title: 'Individual Dispense Receipt Printing',
        desc: 'Print formal signed receipts with complete clinical and financial details.'
      }
    ],
    stepsAr: [
      'في مربع بحث المقيم، اكتب جزءاً من اسم المقيم أو رقم غرفته أو هويته، ثم اختره من القائمة المفلترة.',
      'في مربع بحث الدواء، ابحث عن الدواء المطلوب وحدده؛ يظهر رصيده المتاح فوراً.',
      'أدخل الكمية المصروفة فعلياً (تُحسب التكلفة تلقائياً)، وتأكد من عدم ظهور تنبيه تعارض الحساسية.',
      'انقر على "تأكيد واعتماد الصرف الدوائي" لخصم الرصيد وتوثيق العملية في سجلات الصرف والتدقيق.'
    ],
    stepsEn: [
      'In the resident search box, type resident name, room, or ID, then select from filtered list.',
      'Search for the medication; available shelf balance is validated automatically.',
      'Enter actual dispensed quantity (cost calculates instantly) and ensure no allergy warnings appear.',
      'Click "Confirm & Dispense Medication" to deduct inventory and log the transaction.'
    ],
    tipsAr: [
      'إذا ظهر تنبيه الحساسية باللون الأحمر، يرجى التوقف فوراً ومراجعة شاشة البدائل الدوائية لاختيار صنف آمن.'
    ],
    tipsEn: [
      'If an allergy alert triggers, halt dispensing immediately and consult Smart Alternatives.'
    ]
  },
  {
    id: 'residents',
    icon: '👥',
    titleAr: 'سجلات المقيمين والإحالات الطبية (Residents & Refills)',
    titleEn: 'Resident Profiles & Medical Refills',
    shortDescAr: 'الملفات الطبية الشاملة لمقيمي المركز: البيانات الشخصية، أرقام الغرف، الحساسيات الدوائية، جدول مواعيد الجرعات الـ 24 ساعة، وإدارة الإحالات الطبية للمستشفيات.',
    shortDescEn: 'Comprehensive resident health records with diagnoses, allergies, 24h daily dosage schedules, and hospital refill management.',
    categoryAr: 'السجلات الطبية',
    categoryEn: 'Medical Records',
    kpisAr: [
      'الرقم الطبي وسجل المقيم الفريد (MRN / Resident ID) ورقم الهوية الوطنية.',
      'رقم الجناح والغرفة، فصيلة الدم، واسم الطبيب المشرف المعالج.',
      'قائمة الحساسيات الدوائية والغذائية المؤكدة التي يعتمد عليها نظام فحص الصرف.',
      'جدول الجرعات اليومية ومواعيد الصباح والظهيرة والمساء وتعليمات البلع.',
      'الإحالات الطبية النشطة وتواريخ مواعيدها للمستشفيات والعيادات التخصصية.'
    ],
    kpisEn: [
      'Unique medical record number (MRN), National ID, and personal identifiers.',
      'Ward/room assignment, blood group, and attending physician.',
      'Confirmed drug and dietary allergies referenced by the dispensing safety guard.',
      'Daily 24h dosage schedules (Morning, Noon, Evening) and swallowing notes.',
      'Active hospital refill appointments and specialist facility routing.'
    ],
    featuresAr: [
      {
        title: 'نظام إدارة الإحالات الطبية وتنبيهات الـ 24 ساعة',
        desc: 'تسجيل تاريخ الإحالة، المستشفى أو العيادة المحال إليها، وسبب الإحالة، مع توليد تنبيهات وقائية آلية قبل الموعد بيوم كامل.'
      },
      {
        title: 'جدول الجرعات اليومية المخصص (Dosage Schedule)',
        desc: 'برمجة مواعيد الأدوية اليومية لكل مقيم مع تحديد الجرعة ووقت التناول وملاحظات الرعاية وصعوبة البلع.'
      },
      {
        title: 'الملف الطبي السريري الفردي المتكامل',
        desc: 'بطاقة موحدة تعرض التاريخ الطبي، الأدوية الموصوفة، الحساسيات، وسجل الملاحظات السلوكية.'
      },
      {
        title: 'طباعة ملف المقيم والجرعات اليومية',
        desc: 'طباعة نموذج رسمي معتمد لملف المقيم وجدول أدويته لتسليمه لكادر التمريض أو الفريق الطبي المرافق في الإحالة.'
      }
    ],
    featuresEn: [
      {
        title: 'Medical Refill System with 24-Hour Prior Alarms',
        desc: 'Track refill dates, facilities, and clinical reasons with automated 1-day advance notices.'
      },
      {
        title: 'Customized 24h Daily Dosage Schedule',
        desc: 'Program daily medication times, strengths, and dysphagia/swallowing directions.'
      },
      {
        title: 'Integrated Resident Clinical Dossier',
        desc: 'Consolidated view of medical history, prescriptions, allergies, and behavioral entries.'
      },
      {
        title: 'Resident Dossier & Dosing Chart Printing',
        desc: 'Print formal profiles and dosing schedules for nursing staff and escort teams.'
      }
    ],
    stepsAr: [
      'ابحث عن المقيم بالاسم أو الغرفة أو الهوية، ثم انقر على "عرض الملف الطبي الكامل".',
      'لجدولة إحالة طبية جديدة، افتح تعديل بيانات المقيم وسجل "تاريخ الإحالة" والجهة الطبية المحال إليها.',
      'لتحديث جدول الجرعات، أضف الأدوية المقررة وحدد مواعيدها (صباح، ظهر، مساء) واحفظ التغييرات.',
      'انقر زر "طباعة الملف الطبي" لاستخراج نسخة ورقية جاهزة للتوقيع والتسليم.'
    ],
    stepsEn: [
      'Search resident by name, room, or ID, then click "View Medical File".',
      'To schedule a medical refill, enter refill date, facility, and reason in the profile.',
      'Update 24h dosage schedule by adding medicines, time slots, and administration notes.',
      'Click "Print Medical Profile" for an official signed document.'
    ],
    tipsAr: [
      'احرص دائماً على مراجعة قائمة الإحالات قبل موعدها بـ 24 ساعة لتجهيز الأدوية المصاحبة وتفادي أي تأخير للمقيم.'
    ],
    tipsEn: [
      'Review refills 24 hours prior to handover to ensure all escort prescriptions are ready.'
    ]
  },
  {
    id: 'behavioral_tracker',
    icon: '🧠',
    titleAr: 'راصد السلوك والأعراض الجانبية (BCMA Tracker)',
    titleEn: 'Behavioral & Adverse Drug Reaction Tracker',
    shortDescAr: 'شاشة رصد متقدمة لتوثيق التغيرات السلوكية والنفسية ومتابعة تأثيرات الأدوية النفسية والعصبية، مزودة بمربع بحث ذكي عن المقيم وإدارة مخصصة للأعراض الجانبية.',
    shortDescEn: 'Monitors psychological statuses and side effects of psychoactive drugs, featuring live resident search and custom adverse reaction management.',
    categoryAr: 'الرعاية السلوكية والنفسية',
    categoryEn: 'Behavioral Care',
    kpisAr: [
      'مربع بحث فوري وسريع عن المقيم المستهدف (بالاسم، الغرفة، الهوية، ورقم الملف).',
      'التقييم والتقلب السلوكي: مستقر وضمن الحدود الطبيعية 🟢، هياج حاد 🔴، قلق وتوتر 🟡، انسحاب وعزلة 🟣، حركة مفرطة 🔵.',
      'الدواء المرتبط (المشتبه به) المحتمل تسببه في العارض.',
      'قائمة الأعراض الجانبية المرصودة مع إمكانية التخصيص الكامل.',
      'درجة خطورة وحدة الأعراض (بدون عوارض، طفيفة، متوسطة، شديدة تستدعي التدخل).'
    ],
    kpisEn: [
      'Smart live search for target resident (name, room, ID, file number).',
      'Behavioral statuses: Stable 🟢, Agitation 🔴, Anxiety 🟡, Withdrawal 🟣, Hyperactivity 🔵.',
      'Suspected / linked medication associated with the reaction.',
      'Customizable adverse side effects checklist.',
      'Clinical severity ratings: None, Mild, Moderate, Severe.'
    ],
    featuresAr: [
      {
        title: 'مربع البحث الفوري عن المقيم المستهدف',
        desc: 'أداة بحث سريعة تتيح العثور على المقيم فوراً وتصفية القائمة المنسدلة، مع بطاقة تأكيد أنيقة تعرض اسمه وغرفته وزر لإلغاء الاختيار.'
      },
      {
        title: 'إدارة وتخصيص الأعراض الجانبية (+ إضافة / تعديل / حذف)',
        desc: 'حرية كاملة لإضافة أعراض جديدة (مثل طفح جلدي، خمول، رعشة، دوخة)، تعديل مسمياتها، أو حذفها مع حفظها الدائم في النظام.'
      },
      {
        title: 'ربط الملاحظة بالدواء المشتبه به',
        desc: 'تحديد الدواء النفسي أو العصبي المرتبط بالعرض السلوكي لدراسة التأثيرات الدوائية بدقة.'
      },
      {
        title: 'توليد الدوسيه السريري الذكي بالذكاء الاصطناعي',
        desc: 'تحليل التاريخ السلوكي والدوائي وتوليد تقرير تشخيصي متقدم وتوصيات لضبط الخطة العلاجية.'
      }
    ],
    featuresEn: [
      {
        title: 'Live Target Resident Search Box',
        desc: 'Quick search instantly filtering residents with confirmed selection badge and clear option.'
      },
      {
        title: 'Custom Side Effects Registry (+ Add / Edit / Delete)',
        desc: 'Full flexibility to register new reactions, rename existing ones, or remove custom items with local persistence.'
      },
      {
        title: 'Suspect Medication Linkage',
        desc: 'Correlate behavioral observations directly with psychotropic or somatic medicines.'
      },
      {
        title: 'AI Behavioral Dossier Generation',
        desc: 'Synthesize observation history into predictive clinical insights and dosage guidance.'
      }
    ],
    stepsAr: [
      'انقر زر "تسجيل عارض جانبي جديد" لفتح نموذج الملاحظة.',
      'في مربع البحث، ابحث عن المقيم المستهدف بالاسم أو الغرفة، ثم اختره من القائمة.',
      'حدد التقييم السلوكي (مستقر، هياج، قلق...)، واختر الدواء المشتبه به إن وجد.',
      'حدد الأعراض الجانبية المرصودة من القائمة (أو أضف عرضاً جديداً بالضغط على "+ إضافة عرض جديد").',
      'حدد درجة الخطورة، اكتب تقرير الملاحظة بالتفصيل، ثم اضغط "حفظ الملاحظة السلوكية".'
    ],
    stepsEn: [
      'Click "Log New Side Effect Entry" to launch form.',
      'Search resident by name or room in the search box, then choose from filtered list.',
      'Select behavioral status and pick suspected medication.',
      'Check observed side effects (or click "+ Add New Side Effect" to add custom reactions).',
      'Set severity level, enter detailed nursing notes, and click save.'
    ],
    tipsAr: [
      'في حال كانت درجة الخطورة "شديدة"، يجب إشعار الطبيب النفسي أو العام فوراً لمراجعة الجرعة وتعديل الخطة العلاجية.'
    ],
    tipsEn: [
      'Escalate moderate-to-severe reactions immediately to the attending physician for dosage adjustments.'
    ]
  },
  {
    id: 'stock_audit',
    icon: '🔄',
    titleAr: 'التسوية المخزنية والتدقيق (Stock Audit & Adjustment)',
    titleEn: 'Stock Audit & Inventory Adjustment',
    shortDescAr: 'أداة ضبط الرصيد المخزني والمطابقة الميدانية، مزودة بمربع بحث فوري عن "الدواء المعني بالطبيعة"، وتوثيق تسويات العجز والإتلاف والإضافة مع سجل لوغ تراكمي لا يمكن حذفه.',
    shortDescEn: 'Perpetual stock adjustment and reconciliation engine featuring live medicine search, addition/deficit logging, and immutable audit trails.',
    categoryAr: 'الرقابة والجودة',
    categoryEn: 'Compliance & Audit',
    kpisAr: [
      'مربع بحث فوري وذكي عن "الدواء المعني بالطبيعة" بالاسم التجاري والعلمي والفئة والمصنع.',
      'عرض فوري للرصيد الفعلي الحالي في الرف مع تمييز لوني للأرصدة الحرجة (15 أو أقل).',
      'نوع التسوية المخزنية: إتلاف / عجز / مفقود (-) أو إضافة / تعزيز رصيد (+).',
      'الكمية المعدلة وسبب التسوية الإلزامي (ملاحظات التدقيق) لضمان النزاهة والشفافية.',
      'سجل اللوغ التراكمي الدائم للتسويات اليدوية مع اسم الموظف والتوقيت الدقيق.'
    ],
    kpisEn: [
      'Smart live search for target medication by trade name, generic name, category, or manufacturer.',
      'Real-time physical shelf balance display with color-coded critical alerts (<= 15 units).',
      'Adjustment types: Deficit / Damaged / Lost (-) or Stock Addition / Enhancement (+).',
      'Adjusted units and mandatory audit rationale for complete transparency.',
      'Permanent immutable audit ledger for manual adjustments with staff signatures.'
    ],
    featuresAr: [
      {
        title: 'مربع البحث الذكي عن الدواء المعني بالطبيعة',
        desc: 'حقل بحث فوري يفلتر الأدوية بمجرد الكتابة، مع إظهار بطاقة تعريفية بالدواء المختار ورصيده الفعلي في الرف وزر لإلغاء الاختيار.'
      },
      {
        title: 'التسوية المزدوجة (خصم أو إضافة)',
        desc: 'إمكانية إثبات عجز أو إتلاف معالجة النواقص، أو إضافة كميات جديدة ناتجة عن تصحيح جرد أو توريد استثنائي.'
      },
      {
        title: 'إلزامية كتابة سبب التسوية (ملاحظات التدقيق)',
        desc: 'حماية نظامية تمنع حفظ أي تسوية بدون تدوين سبب واضح ومعتمد للتدقيق الداخلي والخارجي.'
      },
      {
        title: 'سجل حركات التسوية التراكمي (Audit Trail Log)',
        desc: 'جدول دائم يوثق كل حركة تسوية سابقة: اسم الدواء، النوع، الكمية المعدلة، الموظف المسؤول، والسبب المدون.'
      }
    ],
    featuresEn: [
      {
        title: 'Target Medication Live Search Box',
        desc: 'Interactive search filtering medicines with selected item card, balance badge, and clear button.'
      },
      {
        title: 'Dual Reconciliation (Addition or Deduction)',
        desc: 'Deduct for damages/deficits or increment stock following physical recount corrections.'
      },
      {
        title: 'Mandatory Audit Rationale Policy',
        desc: 'Enforces entry of transparent adjustment reasons before any stock change is saved.'
      },
      {
        title: 'Permanent Stock Adjustment Ledger',
        desc: 'Detailed chronological ledger logging item, delta amount, executing staff, and justification.'
      }
    ],
    stepsAr: [
      'في حقل "الدواء المعني بالطبيعة"، اكتب اسم الدواء أو اسمه العلمي أو فئته في مربع البحث.',
      'اختر الدواء من القائمة المفلترة؛ تظهر بطاقة التأكيد التي تبين رصيده الفعلي الحالي في المستودع.',
      'حدد "نوع التسوية" (عجز/إتلاف - أو إضافة +)، وأدخل "الكمية المعدلة".',
      'اكتب سبب التسوية بالتفصيل في حقل "سبب التسوية (ملاحظات التدقيق)"، ثم اضغط "حفظ التسوية وتحديث الرصيد".'
    ],
    stepsEn: [
      'In the target medicine field, type trade name, generic name, or category into search box.',
      'Select medicine from filtered list; physical shelf balance card appears instantly.',
      'Select adjustment type (Deficit/Damaged - or Addition +) and enter adjusted units.',
      'Provide detailed justification in audit reason field, then click "Save Adjustment".'
    ],
    tipsAr: [
      'عمليات التسوية المخزنية تسجل في اللوغ الأمني الدائم وتعتبر مستنداً رسمياً في تقارير الجرد السنوية.'
    ],
    tipsEn: [
      'All adjustments are permanently sealed into the audit trail and submitted during annual audits.'
    ]
  },
  {
    id: 'alternatives',
    icon: '🔍',
    titleAr: 'البدائل الدوائية ودليل الشركات (Alternatives & Companies)',
    titleEn: 'Smart Medication Alternatives & Companies',
    shortDescAr: 'محرك بحث متقدم عن البدائل العلاجية المتطابقة علمياً، مع دليل شامل لشركات ومصانع الأدوية المحلية والعالمية وبيانات التواصل والدعم.',
    shortDescEn: 'Bioequivalent alternative search engine coupled with a comprehensive directory of pharmaceutical manufacturers and contacts.',
    categoryAr: 'الصيدلة السريرية',
    categoryEn: 'Clinical Pharmacy',
    kpisAr: [
      'مطابقة المادة الفعالة والتركيز (Generic Bioequivalence).',
      'حالة توفر البديل ورصيده الفعلي في مخزن الصيدلية.',
      'فرق السعر بين الصنف الأصلي والبدائل المقترحة.',
      'دليل الشركات المصنعة، بلد المنشأ، الهاتف، والبريد الإلكتروني.'
    ],
    kpisEn: [
      'Generic active chemical and concentration bioequivalence.',
      'Warehouse stock balance and availability of candidate substitutes.',
      'Price differentials between originator and generic alternatives.',
      'Manufacturer directory, country of origin, phone, and support emails.'
    ],
    featuresAr: [
      {
        title: 'محرك اقتراح البدائل بالذكاء الاصطناعي',
        desc: 'اقتراح ذكي للبدائل المتوفرة فعلياً في المستودع بنفس المادة الفعالة والمجموعة العلاجية.'
      },
      {
        title: 'دليل شركات ومصانع الأدوية المعتمدة',
        desc: 'سجل متكامل للشركات المصنعة (سعودية، إقليمية، ودولية) مع أرقام الاتصال وعناوين الدعم وتصدير الدليل.'
      },
      {
        title: 'زر صرف البديل المباشر',
        desc: 'الانتقال بضغطة زر واحدة إلى شاشة الصرف مع تعبئة بيانات الدواء البديل تلقائياً.'
      }
    ],
    featuresEn: [
      {
        title: 'AI Bioequivalent Recommendation Engine',
        desc: 'Recommends available warehouse substitutes sharing identical active substances.'
      },
      {
        title: 'Approved Pharmaceutical Manufacturers Directory',
        desc: 'Complete directory of local and international drug makers with contact channels.'
      },
      {
        title: 'One-Click Alternative Dispense',
        desc: 'Transition directly into the dispensing flow with pre-populated alternative details.'
      }
    ],
    stepsAr: [
      'اكتب اسم الدواء الأصلي غير المتوفر في مربع البحث لاستعراض بدائله المتطابقة.',
      'قارن بين بطاقات البدائل المعروضة من حيث الرصيد المتوفر، الجرعة، والسعر.',
      'لاستعراض بيانات الشركات المصنعة، انتقل لتبويب "دليل الشركات المصنعة" وابحث بالاسم أو الدولة.'
    ],
    stepsEn: [
      'Type out-of-stock medication name into search box to view bioequivalent options.',
      'Compare candidate alternatives by available stock, strength, and unit cost.',
      'To review manufacturer contacts, switch to "Manufacturers Directory" tab.'
    ],
    tipsAr: [
      'تأكد دائماً من مطابقة الشكل الصيدلاني (أقراص، شراب) لملاءمة حالة المقيم خاصة لمن يعانون من صعوبات بلع.'
    ],
    tipsEn: [
      'Ensure the dosage form matches resident swallowing capabilities, especially for dysphagic patients.'
    ]
  },
  {
    id: 'ai_reports',
    icon: '✨',
    titleAr: 'التقارير الرقابية والذكاء الاصطناعي (AI & Regulatory Reports)',
    titleEn: 'AI Clinical Intelligence & PDF Reports',
    shortDescAr: 'منظومة إصدار التقارير الرقابية والسريرية المعتمدة: تقارير الرقابة الدوائية الشاملة باسم المركز، تنزيل وتصدير ملفات PDF الرسمية عبر السيرفر، وتقييم التداخلات الدوائية بالذكاء الاصطناعي.',
    shortDescEn: 'Comprehensive regulatory and clinical reporting system generating official Shaqra Center PDF reports, WhatsApp dispatches, and AI polypharmacy assessments.',
    categoryAr: 'الذكاء الاصطناعي والتحليل',
    categoryEn: 'AI & Analytics',
    kpisAr: [
      'تقرير الرقابة الدوائية الشامل الصادر عن صيدلية مركز التأهيل الشامل للذكور بشقراء.',
      'روابط تنزيل ملفات PDF الرسمية المعتمدة بالعربية والإنجليزية مباشرة من خوادم النظام.',
      'تحليل مخاطر التداخلات الدوائية المتعددة (Polypharmacy Risks).',
      'مؤشرات الأدوية منتهية الصلاحية وقريبة الانتهاء وحد المخزون الحرج.'
    ],
    kpisEn: [
      'Official Comprehensive Drug Safety Report for Shaqra Rehabilitation Center.',
      'Direct server URLs for verified Arabic and English PDF document downloads.',
      'Polypharmacy risk index and drug-drug interaction assessments.',
      'Inventory metrics for expired, near-expiry, and critical deficit items.'
    ],
    featuresAr: [
      {
        title: 'توليد ملفات PDF الرسمية المعتمدة عبر السيرفر',
        desc: 'محرك سيرفر مخصص يولد ملفات PDF احترافية متوافقة مع الطباعة الرسمية متضمنة ترويسة المركز وختم الصيدلية بالعربية والإنجليزية.'
      },
      {
        title: 'تقرير الرقابة الدوائية والتحليل السريري بالذكاء الاصطناعي',
        desc: 'تحليل التاريخ الدوائي للمقيمين، كشف التفاعلات الخفية بين الأدوية النفسية والجسدية، وتقديم توصيات ضبط الجرعات.'
      },
      {
        title: 'المشاركة الفورية لتقارير الأدوية عبر الواتساب',
        desc: 'إرسال ملخصات الرقابة الدوائية الفورية مع روابط تنزيل مستندات الـ PDF للمسؤولين والأطباء بضغطة زر واحدة.'
      }
    ],
    featuresEn: [
      {
        title: 'Server-Side Official PDF Document Generation',
        desc: 'Dedicated backend service delivering compliant PDF reports with official center headers.'
      },
      {
        title: 'AI Medication Review & Clinical Assessments',
        desc: 'Evaluates drug histories, flags hidden polypharmacy conflicts, and proposes dosage adjustments.'
      },
      {
        title: 'Instant WhatsApp Medication Dispatches',
        desc: 'Send formatted summaries with verified PDF download links directly to stakeholders.'
      }
    ],
    stepsAr: [
      'انقر زر "تصدير / تنزيل PDF بالعربية" أو "English PDF" لتحميل التقرير الرسمي مباشرةً.',
      'لتوليد تقرير سريري لمقيم معين بالذكاء الاصطناعي، اختر المقيم واضغط "توليد التقرير السريري ✨".',
      'لمشاركة التقرير عبر واتساب، افتح نافذة الواتساب واضغط "إرسال عبر WhatsApp 📲".'
    ],
    stepsEn: [
      'Click "Export Arabic PDF" or "English PDF" to download official reports directly.',
      'To run AI clinical assessment for a resident, select patient and click "Generate Report ✨".',
      'To dispatch via WhatsApp, open modal and click "Send via WhatsApp 📲".'
    ],
    tipsAr: [
      'تعتبر تقارير الذكاء الاصطناعي أداة مساندة استرشادية، ويظل القرار النهائي للفريق الطبي المعالج بالمركز.'
    ],
    tipsEn: [
      'AI assessments are consultative decision-support aids; clinical changes require physician approval.'
    ]
  },
  {
    id: 'users',
    icon: '⚙️',
    titleAr: 'إدارة المستخدمين والصلاحيات (Users & RBAC Permissions)',
    titleEn: 'Users, Roles & Access Control',
    shortDescAr: 'نظام إدارة هويات الكادر الصحي والإداري، مع ضبط مصفوفة الصلاحيات الدقيقة (RBAC) لـ 4 أدوار وظيفية: المبرمج، مدير النظام، الصيدلي، والمشاهد.',
    shortDescEn: 'User identity management with role-based access control (RBAC) across 4 defined roles: Developer, Admin, Pharmacist, and Viewer.',
    categoryAr: 'إدارة النظام والأمان',
    categoryEn: 'Administration',
    kpisAr: [
      'دور المبرمج (Developer): يملك كافة الصلاحيات بما فيها محاكاة الإشعارات، تقرير الإحالات اليومي، وفحص خوادم الإرسال.',
      'دور مدير النظام (Admin): إدارة المستخدمين، المخزون، الصرف، المقيمين، سجلات التدقيق والأمان.',
      'دور الصيدلي (Pharmacist): إدارة الأدوية، عمليات الصرف، رصد الأعراض الجانبية، والبدائل الدوائية.',
      'دور المشاهد / المدقق (Viewer): استعراض السجلات والتقارير في وضع القراءة فقط دون تعديل.'
    ],
    kpisEn: [
      'Developer: Full master privileges including notification simulation, daily refill alerts, and dispatch debug.',
      'Admin: User management, inventory, dispensing, residents, and audit ledgers.',
      'Pharmacist: Medication catalog, dispensing, behavioral side effects, and alternatives.',
      'Viewer: Read-only access to audit records, reports, and dashboards.'
    ],
    featuresAr: [
      {
        title: 'مصفوفة الصلاحيات الدقيقة (Granular RBAC)',
        desc: 'حجب وإظهار الأزرار والشاشات بناءً على الدور المسجل للمستخدم لمنع الإجراءات غير المصرح بها.'
      },
      {
        title: 'إضافة وتعديل حسابات الموظفين',
        desc: 'إنشاء حسابات جديدة بكلمات مرور مشفرة وتعيين الأدوار الوظيفية وبيانات الاتصال.'
      },
      {
        title: 'تجميد وحذف الحسابات وإعادة تعيين كلمات المرور',
        desc: 'إمكانية إيقاف وصول أي حساب فوراً أو تعديل كلمة المرور لضمان أمان النظام.'
      }
    ],
    featuresEn: [
      {
        title: 'Granular RBAC Permission Matrix',
        desc: 'Dynamically hides or exposes UI controls based on active staff roles.'
      },
      {
        title: 'Staff Account Onboarding & Editing',
        desc: 'Provision credentials, assign functional roles, and record contact details.'
      },
      {
        title: 'Account Suspension & Password Reset',
        desc: 'Instantly revoke access or reset credentials to safeguard patient data.'
      }
    ],
    stepsAr: [
      'استعرض قائمة المستخدمين لمراجعة الأدوار وحالات الحسابات.',
      'لإضافة موظف جديد، اضغط "+ إضافة مستخدم جديد" وأدخل الاسم، البريد، كلمة المرور، والدور الوظيفي.',
      'لتعديل صلاحية مستخدم أو تغيير كلمة مروره، انقر على أيقونة التعديل في الصف المقابل له.'
    ],
    stepsEn: [
      'Review users table to inspect role distributions and account statuses.',
      'Click "+ Add New User" and supply name, email, password, and assigned role.',
      'Click the edit icon on any user row to alter privileges or reset passwords.'
    ],
    tipsAr: [
      'احرص دائماً على تطبيق مبدأ الصلاحيات الأدنى (Least Privilege) ومنح صلاحية المبرمج والمدير للمخولين فقط.'
    ],
    tipsEn: [
      'Adhere strictly to the principle of least privilege when delegating administrative rights.'
    ]
  },
  {
    id: 'security',
    icon: '🛡️',
    titleAr: 'مركز الأمان والمراسلات الرقمية (Security & Dispatch Center)',
    titleEn: 'Security Monitoring & Digital Dispatch Center',
    shortDescAr: 'شاشة الرقابة الأمنية وإعدادات خادم المراسلات الرقمية: تكوين Google Apps Script، تشخيص الصلاحيات، متابعة الجلسات وعناوين الـ IP وكشف محاولات الدخول.',
    shortDescEn: 'Security dashboard and dispatch gateway configuration: Google Apps Script setup, permission diagnostics, session logs, and client IP audits.',
    categoryAr: 'الأمان والرقابة',
    categoryEn: 'Security & Auditing',
    kpisAr: [
      'إعدادات خادم البريد عبر Google Apps Script مع دعم الروابط البديلة والاحتياطية لمعالجة حدود الإرسال.',
      'الفحص التشخيصي التلقائي لحالة النشر وإرشادات ضبط أذونات الوصول (Who has access: Anyone).',
      'عنوان الـ IP الفعلي للجهاز المتصل والموقع الجغرافي وكشف الأجهزة والمتصفحات.',
      'سجل جلسات تسجيل الدخول الناجحة ومحاولات الدخول غير المصرح بها.'
    ],
    kpisEn: [
      'Google Apps Script mail gateway settings supporting fallback URLs for quota failover.',
      'Automated deployment diagnostic tool guiding access permissions (Who has access: Anyone).',
      'Client IP address detection, geographic location, and device fingerprints.',
      'Session audit ledger recording successful logins and unauthorized attempts.'
    ],
    featuresAr: [
      {
        title: 'بوابة المراسلات الرقمية والبريد الإلكتروني الذكي',
        desc: 'تكوين روابط Google Apps Script Web App لإرسال التقارير التلقائية مع دعم روابط بديلة لتفادي استهلاك الكوتا اليومية.'
      },
      {
        title: 'دليل تشخيص صلاحيات نشر Apps Script السريع',
        desc: 'إرشادات مدمجة توضح خطوات ضبط خيار (Who has access -> Anyone) و (Execute as -> Me) لضمان عمل الإرسال دون أخطاء.'
      },
      {
        title: 'سجل الجلسات وعناوين الـ IP اللحظي',
        desc: 'توثيق كل جلسة دخول بعنوان الـ IP الحقيقي للجهاز ووقت الدخول واسم المستخدم لضمان الشفافية الكاملة.'
      }
    ],
    featuresEn: [
      {
        title: 'Digital Dispatch & Resilient Email Gateway',
        desc: 'Configure primary and backup Google Apps Script endpoints to handle quota failover.'
      },
      {
        title: 'Apps Script Deployment Diagnostic Guide',
        desc: 'Clear in-app guidance on setting "Who has access: Anyone" and "Execute as: Me".'
      },
      {
        title: 'Real-Time Session & Client IP Ledger',
        desc: 'Captures actual client IP, login timestamps, and device fingerprints.'
      }
    ],
    stepsAr: [
      'في قسم إعدادات البريد، أدخل رابط تطبيق Google Apps Script المنتهي بـ /exec واضغط "حفظ وتجربة الإرسال".',
      'إذا ظهر تنبيه صلاحيات النشر، اضغط على Deploy في Apps Script واضبط خيار "من لديه حق الوصول" على "الجميع (Anyone)".',
      'راقب سجل الجلسات للتحقق من عناوين IP الأجهزة المتصلة بانتظام.'
    ],
    stepsEn: [
      'Enter your Google Apps Script URL ending in /exec and click "Save & Test Dispatch".',
      'If permission warning appears, open Apps Script -> Deploy -> set "Who has access" to "Anyone".',
      'Monitor the active sessions table to verify authorized connected IPs.'
    ],
    tipsAr: [
      'يمكنك إضافة عدة روابط Apps Script مفصولة بفاصلة ليعمل النظام تلقائياً على الرابط التالي في حال تجاوز حد الإرسال اليومي لحساب معين.'
    ],
    tipsEn: [
      'You can specify multiple comma-separated Apps Script URLs for automatic quota failover.'
    ]
  },
  {
    id: 'audit_logs',
    icon: '📋',
    titleAr: 'سجل التدقيق والمراقبة العامة (Comprehensive Audit Trail)',
    titleEn: 'Comprehensive Audit Trail & Logs',
    shortDescAr: 'سجل المراقبة المحكم الذي يدون كل حركة تعديل أو إضافة أو حذف أو صرف دواء أو تسوية مخزنية، مع هوية الموظف والوقت، كمرجع رقابي غير قابل للتعديل.',
    shortDescEn: 'Immutable audit trail capturing every modification, creation, dispensing, stock adjustment, and deletion event with user signatures.',
    categoryAr: 'الرقابة والجودة',
    categoryEn: 'Compliance & Audit',
    kpisAr: [
      'إجمالي الحركات والعمليات المسجلة في قاعدة البيانات التراكمية.',
      'أنواع الإجراءات: إضافة دواء، صرف دواء، تسوية يدوية، تعديل مقيم، حذف صنف...',
      'المعرف الفريد للمستخدم المنفذ للإجراء وصفته الوظيفية واسمه.',
      'التاريخ والتوقيت الدقيق لكل حدث سريري أو مستودعي بالثانية.'
    ],
    kpisEn: [
      'Total immutable transaction records in database.',
      'Action types: Medicine Added, Dose Dispensed, Stock Adjustment, Profile Edit...',
      'Unique user ID and role of executing staff member.',
      'Exact timestamp, delta quantity, and transition balances.'
    ],
    featuresAr: [
      {
        title: 'التسجيل الآلي الإلزامي (Zero-Touch Logging)',
        desc: 'لا يمكن لأي مستخدم تجاوز التدقيق؛ كل تعديل في المخزون أو الصرف يوثق آلياً.'
      },
      {
        title: 'التصفية الذكية والبحث المتقدم في السجلات',
        desc: 'البحث باسم المستخدم، أو نوع العملية، أو اسم الدواء لسرعة التحقيق والمراجعة الإدارية.'
      },
      {
        title: 'تصدير وطباعة سجل التدقيق الشامل',
        desc: 'استخراج وثيقة تدقيق ورقية رسمية متوافقة مع متطلبات التفتيش الصيدلاني والرقابة الصحية.'
      }
    ],
    featuresEn: [
      {
        title: 'Zero-Touch Automatic Logging',
        desc: 'Every inventory change, dispense, and profile edit is permanently captured.'
      },
      {
        title: 'Smart Ledger Search & Filters',
        desc: 'Query historical records by staff name, action type, or medication.'
      },
      {
        title: 'Official Regulatory Audit Printout',
        desc: 'Export formal audit ledger documents compliant with health inspection requirements.'
      }
    ],
    stepsAr: [
      'افتح الشاشة لاستعراض أحدث الأنشطة التي تمت على النظام بترتيب زمني عكسي.',
      'استخدم حقل البحث لتتبع حركة صنف معين (مثال: بحث باسم الدواء لرؤية من أضافه أو صرفه أو سواه).',
      'اضغط زر "طباعة سجل التدقيق" للحصول على نسخة رسمية للمراجعة الدورية.'
    ],
    stepsEn: [
      'Open Audit Trail to view recent activities in reverse chronological order.',
      'Search by medication name to trace every receipt, adjustment, and dispense event.',
      'Click "Print Audit Report" to generate an official document for periodic review.'
    ],
    tipsAr: [
      'سجل التدقيق وثيقة رسمية نظامية لا يمكن تعديلها أو حذفها، وتستخدم كمرجع أساسي في التدقيق السريري والإداري.'
    ],
    tipsEn: [
      'The audit ledger is an immutable legal record essential for quality audits and regulatory inspections.'
    ]
  },
  {
    id: 'customization_and_pwa',
    icon: '🎨',
    titleAr: 'تخصيص المظهر (Skins) وتثبيت التطبيق (PWA & Offline)',
    titleEn: 'Themes, Skins, PWA & Offline Support',
    shortDescAr: 'دليل تخصيص مظهر النظام بين 4 خيارات لونية فاخرة (كحلي كلاسيكي، أخضر زمردي، أبيض سريري ناصع، ونِيلي ملكي)، مع تثبيت التطبيق والعمل دون اتصال.',
    shortDescEn: 'Theme skins engine, dark/light modes, offline data persistence, and progressive web app (PWA) installation.',
    categoryAr: 'النظام والتقنية',
    categoryEn: 'System & Tech',
    kpisAr: [
      '4 مظاهر احترافية: كحلي داكن (Midnight)، رمادي زمردي (Slate Emerald)، أبيض سريري ناصع (Clinical Daylight)، ونِيلي ملكي (Royal Indigo).',
      'التنقل الفوري بين الوضع النهاري والليلي بضغطة زر واحدة (🌙/☀️).',
      'دعم كامل وثنائي للغتين العربية (RTL) والإنجليزية (LTR).',
      'جاهزية العمل عند انقطاع الإنترنت (Offline-Ready) مع مزامنة محلية وقاعدة بيانات Firebase Firestore السحابية.'
    ],
    kpisEn: [
      '4 professional themes: Midnight Dark, Slate Emerald, Clinical Daylight White, and Royal Indigo.',
      'Instant 1-click toggle between Day and Night modes (🌙/☀️).',
      'Full bi-directional internationalization: Arabic (RTL) & English (LTR).',
      'Offline-ready PWA with local database persistence and Firebase Firestore cloud sync.'
    ],
    featuresAr: [
      {
        title: 'محرك ألوان النظام التفاعلي (Dynamic Skins Engine)',
        desc: 'تطبيق فوري لدرجات الخلفية والبطاقات والأزرار والإطارات عند اختيار أي مظهر دون الحاجة لإعادة تحميل الصفحة.'
      },
      {
        title: 'تثبيت تطبيق الويب التقدمي (PWA Install)',
        desc: 'إمكانية تثبيت المنظومة كتطبيق مستقل على أجهزة الحاسوب المكتبي واللوحي والأجهزة الذكية بنقرة واحدة.'
      },
      {
        title: 'المزامنة السحابية وقاعدة بيانات Firebase Firestore',
        desc: 'حفظ مستمر وآمن للبيانات محلياً وسحابياً لضمان عدم فقدان أي سجلات واسترجاعها من أي جهاز.'
      }
    ],
    featuresEn: [
      {
        title: 'Dynamic Skins Engine',
        desc: 'Instant palette application across cards, buttons, and backgrounds without reloading.'
      },
      {
        title: 'Progressive Web App (PWA) Install',
        desc: 'Install the system as a native desktop or mobile application with offline launch.'
      },
      {
        title: 'Firebase Firestore Cloud Synchronization',
        desc: 'Persistent local and cloud storage ensuring zero data loss and multi-device access.'
      }
    ],
    stepsAr: [
      'انقر على أيقونة لوحة الألوان 🎨 في الشريط العلوي لفتح نافذة اختيار المظهر (Skins).',
      'استعرض المظاهر الأربعة، واضغط على المظهر المرغوب ليتم تطبيقه فوراً.',
      'للتحويل السريع إلى الوضع النهاري أو الليلي، انقر على زر الشمس/القمر (🌙/☀️).',
      'لتثبيت البرنامج كتطبيق مستقل على جهازك، اضغط زر "تثبيت التطبيق 📲" واتبع التعليمات.'
    ],
    stepsEn: [
      'Click the palette icon 🎨 in the header bar to open Themes & Skins.',
      'Choose from any of the 4 color schemes to apply it in real-time.',
      'Toggle the Sun/Moon button (🌙/☀️) for quick Dark / Light mode switching.',
      'Click "Install App 📲" in your browser bar or menu to run as a standalone desktop app.'
    ],
    tipsAr: [
      'يوصى باختيار مظهر "أبيض سريري ناصع" للشاشات التي تستخدم في وضح النهار، والمظاهر الداكنة لورديات العمل الليلية.'
    ],
    tipsEn: [
      'Use Clinical Daylight White in bright clinic rooms, and dark midnight themes for night shifts.'
    ]
  }
];
