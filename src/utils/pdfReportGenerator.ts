import { jsPDF } from 'jspdf';
import { Medicine } from '../db/mockDb';

export interface PdfGenerationResult {
  arPdfBlob: Blob;
  enPdfBlob: Blob;
  arPdfBase64: string;
  enPdfBase64: string;
  arPdfFile: File;
  enPdfFile: File;
}

// Helper to convert ArrayBuffer to Base64 cleanly in browser and node
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Parses dates in flexible formats (YYYY-MM-DD, DD/MM/YYYY, etc.)
function parseFlexibleDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const clean = dateStr.trim();
  const d = new Date(clean);
  if (!isNaN(d.getTime())) return d;
  const parts = clean.split(/[-/.]/);
  if (parts.length === 3) {
    const p0 = parseInt(parts[0], 10);
    const p1 = parseInt(parts[1], 10);
    const p2 = parseInt(parts[2], 10);
    if (p2 > 1000) return new Date(p2, p1 - 1, p0);
    if (p0 > 1000) return new Date(p0, p1 - 1, p2);
  }
  return null;
}

function cleanExpiry(expStr: string): string {
  return (expStr || '').replace(/-/g, '/');
}

/**
 * High-Resolution Canvas-to-PDF Generator for Arabic and English.
 * Uses native HTML5 2D Canvas context which supports 100% authentic Arabic cursive
 * text shaping, ligatures, bidirectional layout, and institutional visual styling.
 */
export async function generateMedicationPdfReports(
  medicines: Medicine[],
  thresholdDays: number = 30
): Promise<PdfGenerationResult> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const warningThreshold = new Date(today);
  warningThreshold.setDate(today.getDate() + thresholdDays);

  const expired = medicines.filter(m => {
    const exp = parseFlexibleDate(m.expiryDate);
    if (!exp) return false;
    exp.setHours(0, 0, 0, 0);
    return exp < today;
  });

  const expiring = medicines.filter(m => {
    const exp = parseFlexibleDate(m.expiryDate);
    if (!exp) return false;
    exp.setHours(0, 0, 0, 0);
    return exp >= today && exp <= warningThreshold;
  });

  const critical = medicines.filter(m => Number(m.quantity) <= 15);
  const totalMeds = medicines.length;

  const dateNow = new Date();
  const dateStrAr = `${dateNow.getFullYear()}/${(dateNow.getMonth() + 1).toString().padStart(2, '0')}/${dateNow.getDate().toString().padStart(2, '0')} الساعة ${dateNow.getHours().toString().padStart(2, '0')}:${dateNow.getMinutes().toString().padStart(2, '0')}`;
  const dateStrEn = `${dateNow.getFullYear()}/${(dateNow.getMonth() + 1).toString().padStart(2, '0')}/${dateNow.getDate().toString().padStart(2, '0')} at ${dateNow.getHours().toString().padStart(2, '0')}:${dateNow.getMinutes().toString().padStart(2, '0')}`;

  // ================= ARABIC PDF CANVAS BUILDER =================
  const buildArabicPages = (): HTMLCanvasElement[] => {
    const pages: HTMLCanvasElement[] = [];
    const canvasWidth = 1240;
    const canvasHeight = 1754; // Standard A4 at ~150 DPI

    const createPage = (): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } => {
      const c = document.createElement('canvas');
      c.width = canvasWidth;
      c.height = canvasHeight;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      return { canvas: c, ctx };
    };

    let { canvas, ctx } = createPage();
    pages.push(canvas);

    let y = 0;

    // Header Top Banner
    ctx.fillStyle = '#0f172a'; // Deep Navy
    ctx.fillRect(0, 0, canvasWidth, 150);

    ctx.fillStyle = '#059669'; // Emerald accent line
    ctx.fillRect(0, 150, canvasWidth, 8);

    // Header Text
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 18px "Segoe UI", Tahoma, Arial, sans-serif';
    ctx.fillText('المملكة العربية السعودية  •  وزارة الموارد البشرية والتنمية الاجتماعية', canvasWidth / 2, 45);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Segoe UI", Tahoma, Arial, sans-serif';
    ctx.fillText('مركز التأهيل الشامل للذكور بشقراء', canvasWidth / 2, 85);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 20px "Segoe UI", Tahoma, Arial, sans-serif';
    ctx.fillText('تقرير الرقابة الدوائية الشامل والتنبيهات الوقائية', canvasWidth / 2, 125);

    y = 190;

    // Report Meta Box
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(50, y, canvasWidth - 100, 75, 12);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'right';
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 16px "Segoe UI", Tahoma, Arial, sans-serif';
    ctx.fillText(`تاريخ ووقت التقرير: ${dateStrAr}`, canvasWidth - 75, y + 32);
    ctx.fillText(`نطاق فحص التنبيه الوقائي: الأدوية التي تنتهي صلاحيتها خلال ${thresholdDays} يوماً`, canvasWidth - 75, y + 58);

    y += 105;

    // 4 Summary Metrics Cards
    const cardWidth = (canvasWidth - 100 - 36) / 4;
    const metrics = [
      { label: 'إجمالي الأصناف', value: `${totalMeds}`, bg: '#ecfdf5', border: '#10b981', text: '#065f46' },
      { label: 'منتهية الصلاحية', value: `${expired.length}`, bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
      { label: 'قريبة الانتهاء', value: `${expiring.length}`, bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
      { label: 'رصيد حرج (<= 15)', value: `${critical.length}`, bg: '#fff7ed', border: '#f97316', text: '#9a3412' }
    ];

    metrics.forEach((m, idx) => {
      const cardX = 50 + idx * (cardWidth + 12);
      ctx.fillStyle = m.bg;
      ctx.strokeStyle = m.border;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cardX, y, cardWidth, 85, 10);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = m.text;
      ctx.font = 'bold 30px "Segoe UI", Tahoma, Arial, sans-serif';
      ctx.fillText(m.value, cardX + cardWidth / 2, y + 42);

      ctx.fillStyle = '#475569';
      ctx.font = 'bold 15px "Segoe UI", Tahoma, Arial, sans-serif';
      ctx.fillText(m.label, cardX + cardWidth / 2, y + 70);
    });

    y += 120;

    // Helper to draw section header
    const drawSectionHeader = (title: string, badgeColor: string) => {
      if (y > canvasHeight - 200) {
        const newP = createPage();
        canvas = newP.canvas;
        ctx = newP.ctx;
        pages.push(canvas);
        y = 60;
      }

      ctx.direction = 'rtl';
      ctx.textAlign = 'right';
      ctx.fillStyle = badgeColor;
      ctx.beginPath();
      ctx.roundRect(canvasWidth - 56, y - 18, 6, 26, 3);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px "Segoe UI", Tahoma, Arial, sans-serif';
      ctx.fillText(title, canvasWidth - 70, y + 2);
      y += 24;

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(canvasWidth - 50, y);
      ctx.stroke();
      y += 16;
    };

    // Helper to draw item table or safe box
    const drawItemsTable = (items: Medicine[], type: 'expired' | 'expiring' | 'critical') => {
      if (items.length === 0) {
        ctx.fillStyle = '#f0fdf4';
        ctx.strokeStyle = '#bbf7d0';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(50, y, canvasWidth - 100, 48, 8);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'right';
        ctx.fillStyle = '#166534';
        ctx.font = 'bold 16px "Segoe UI", Tahoma, Arial, sans-serif';
        const safeMsg = type === 'expired' 
          ? 'الحالة آمنة تماماً: لا توجد أي أدوية منتهية الصلاحية مسجلة في صيدلية المركز.'
          : type === 'expiring'
            ? `الحالة آمنة: جميع الأدوية الحالية تتجاوز فترة الصلاحية الوقائية (${thresholdDays} يوماً).`
            : 'الحالة آمنة: أرصدة جميع الأدوية متوفرة بكفاية وتتجاوز حدود الأمان المقررة.';
        ctx.fillText(`✓  ${safeMsg}`, canvasWidth - 75, y + 30);
        y += 66;
        return;
      }

      // Draw table header
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(50, y, canvasWidth - 100, 36);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(50, y, canvasWidth - 100, 36);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 15px "Segoe UI", Tahoma, Arial, sans-serif';

      // Columns: [Num, Medicine Name, Expiry/Stock, Quantity, Action]
      const colX = {
        num: canvasWidth - 85,
        name: canvasWidth - 300,
        detail: canvasWidth - 620,
        qty: canvasWidth - 820,
        action: canvasWidth - 1020
      };

      ctx.fillText('م', colX.num, y + 23);
      ctx.fillText('اسم الصنف الدوائي', colX.name, y + 23);
      ctx.fillText(type === 'critical' ? 'الرصيد / الحد الأدنى' : 'تاريخ الصلاحية', colX.detail, y + 23);
      ctx.fillText('الكمية الحالية', colX.qty, y + 23);
      ctx.fillText('التوجيه المعتمد', colX.action, y + 23);
      y += 36;

      // Draw rows
      items.forEach((m, idx) => {
        if (y > canvasHeight - 120) {
          const newP = createPage();
          canvas = newP.canvas;
          ctx = newP.ctx;
          pages.push(canvas);
          y = 60;
        }

        ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        ctx.fillRect(50, y, canvasWidth - 100, 38);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.strokeRect(50, y, canvasWidth - 100, 38);

        ctx.textAlign = 'center';
        ctx.font = '14px "Segoe UI", Tahoma, Arial, sans-serif';
        ctx.fillStyle = '#0f172a';

        // Index
        ctx.fillText(`${idx + 1}`, colX.num, y + 24);

        // Name
        const medName = m.commercialNameAr || m.commercialName;
        ctx.textAlign = 'right';
        ctx.fillText(medName.slice(0, 35), colX.name + 140, y + 24);

        // Detail
        ctx.textAlign = 'center';
        if (type === 'critical') {
          ctx.fillStyle = '#c2410c';
          ctx.fillText(`${m.quantity} / 15 وحدة`, colX.detail, y + 24);
        } else {
          ctx.fillStyle = type === 'expired' ? '#b91c1c' : '#b45309';
          ctx.fillText(cleanExpiry(m.expiryDate), colX.detail, y + 24);
        }

        // Qty
        ctx.fillStyle = '#334155';
        ctx.fillText(`${m.quantity} ${m.unit || 'وحدة'}`, colX.qty, y + 24);

        // Action
        ctx.font = 'bold 13px "Segoe UI", Tahoma, Arial, sans-serif';
        if (type === 'expired') {
          ctx.fillStyle = '#dc2626';
          ctx.fillText('سحب فوري وتحريز', colX.action, y + 24);
        } else if (type === 'expiring') {
          ctx.fillStyle = '#d97706';
          ctx.fillText('أولوية الصرف والتدوير', colX.action, y + 24);
        } else {
          ctx.fillStyle = '#ea580c';
          ctx.fillText('طلب توريد عاجل', colX.action, y + 24);
        }

        y += 38;
      });

      y += 24;
    };

    // Draw Section 1
    drawSectionHeader('البند الأول: الأدوية منتهية الصلاحية الفعلية', '#ef4444');
    drawItemsTable(expired, 'expired');

    // Draw Section 2
    drawSectionHeader(`البند الثاني: الأدوية التي تقترب صلاحيتها من الانتهاء (خلال ${thresholdDays} يوماً)`, '#f59e0b');
    drawItemsTable(expiring, 'expiring');

    // Draw Section 3
    drawSectionHeader('البند الثالث: الأدوية التي بلغت حد المخزون الحرج (15 وحدة أو أقل)', '#f97316');
    drawItemsTable(critical, 'critical');

    // Draw Section 4: Directives
    drawSectionHeader('البند الرابع: التوصيات الإدارية والرقابية المعتمدة', '#059669');
    
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#334155';
    ctx.font = '15px "Segoe UI", Tahoma, Arial, sans-serif';

    const directives = [
      '1. الالتزام الصارم بتطبيق سياسة الصرف الدوائي للأقرب انتهاءً (FEFO) لضمان سلامة وكفاءة المخزون.',
      '2. المتابعة المستمرة لسجلات درجات حرارة الثلاجات وغرف التخزين لحفظ الخصائص الحيوية للمستحضرات.',
      '3. التنسيق الدائم بين إدارة الصيدلية والطاقم الطبي لتأمين الاحتياجات الدوائية لمقيمي المركز.'
    ];

    directives.forEach(dir => {
      if (y > canvasHeight - 100) {
        const newP = createPage();
        canvas = newP.canvas;
        ctx = newP.ctx;
        pages.push(canvas);
        y = 60;
      }
      ctx.fillText(dir, canvasWidth - 75, y + 10);
      y += 30;
    });

    y += 30;

    // Footer on the last page
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, canvasHeight - 75, canvasWidth, 75);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, canvasHeight - 75, canvasWidth, 75);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 15px "Segoe UI", Tahoma, Arial, sans-serif';
    ctx.fillText('صادر رسمي معتمد عن صيدلية مركز التأهيل الشامل للذكور بشقراء  •  تقرير رقابي آلي', canvasWidth / 2, canvasHeight - 35);

    return pages;
  };

  // ================= ENGLISH PDF CANVAS BUILDER =================
  const buildEnglishPages = (): HTMLCanvasElement[] => {
    const pages: HTMLCanvasElement[] = [];
    const canvasWidth = 1240;
    const canvasHeight = 1754;

    const createPage = (): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } => {
      const c = document.createElement('canvas');
      c.width = canvasWidth;
      c.height = canvasHeight;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      return { canvas: c, ctx };
    };

    let { canvas, ctx } = createPage();
    pages.push(canvas);

    let y = 0;

    // Header Top Banner
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvasWidth, 150);

    ctx.fillStyle = '#059669';
    ctx.fillRect(0, 150, canvasWidth, 8);

    // Header Text (LTR)
    ctx.direction = 'ltr';
    ctx.textAlign = 'center';

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 18px "Segoe UI", Tahoma, Arial, sans-serif';
    ctx.fillText('Kingdom of Saudi Arabia  •  Ministry of Human Resources & Social Development', canvasWidth / 2, 45);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Segoe UI", Tahoma, Arial, sans-serif';
    ctx.fillText('Shaqra Comprehensive Rehabilitation Center for Males', canvasWidth / 2, 85);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 20px "Segoe UI", Tahoma, Arial, sans-serif';
    ctx.fillText('Comprehensive Medication Safety & Preventive Alerts Report', canvasWidth / 2, 125);

    y = 190;

    // Report Meta Box
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(50, y, canvasWidth - 100, 75, 12);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 16px "Segoe UI", Tahoma, Arial, sans-serif';
    ctx.fillText(`Report Date & Time: ${dateStrEn}`, 75, y + 32);
    ctx.fillText(`Preventive Warning Scope: Expirations occurring within ${thresholdDays} days`, 75, y + 58);

    y += 105;

    // 4 Summary Metrics Cards
    const cardWidth = (canvasWidth - 100 - 36) / 4;
    const metrics = [
      { label: 'Total Items', value: `${totalMeds}`, bg: '#ecfdf5', border: '#10b981', text: '#065f46' },
      { label: 'Expired Items', value: `${expired.length}`, bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
      { label: 'Near Expiry', value: `${expiring.length}`, bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
      { label: 'Critical Stock (<= 15)', value: `${critical.length}`, bg: '#fff7ed', border: '#f97316', text: '#9a3412' }
    ];

    metrics.forEach((m, idx) => {
      const cardX = 50 + idx * (cardWidth + 12);
      ctx.fillStyle = m.bg;
      ctx.strokeStyle = m.border;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cardX, y, cardWidth, 85, 10);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = m.text;
      ctx.font = 'bold 30px "Segoe UI", Tahoma, Arial, sans-serif';
      ctx.fillText(m.value, cardX + cardWidth / 2, y + 42);

      ctx.fillStyle = '#475569';
      ctx.font = 'bold 15px "Segoe UI", Tahoma, Arial, sans-serif';
      ctx.fillText(m.label, cardX + cardWidth / 2, y + 70);
    });

    y += 120;

    const drawSectionHeader = (title: string, badgeColor: string) => {
      if (y > canvasHeight - 200) {
        const newP = createPage();
        canvas = newP.canvas;
        ctx = newP.ctx;
        pages.push(canvas);
        y = 60;
      }

      ctx.direction = 'ltr';
      ctx.textAlign = 'left';
      ctx.fillStyle = badgeColor;
      ctx.beginPath();
      ctx.roundRect(50, y - 18, 6, 26, 3);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px "Segoe UI", Tahoma, Arial, sans-serif';
      ctx.fillText(title, 66, y + 2);
      y += 24;

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(canvasWidth - 50, y);
      ctx.stroke();
      y += 16;
    };

    const drawItemsTable = (items: Medicine[], type: 'expired' | 'expiring' | 'critical') => {
      if (items.length === 0) {
        ctx.fillStyle = '#f0fdf4';
        ctx.strokeStyle = '#bbf7d0';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(50, y, canvasWidth - 100, 48, 8);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.fillStyle = '#166534';
        ctx.font = 'bold 16px "Segoe UI", Tahoma, Arial, sans-serif';
        const safeMsg = type === 'expired' 
          ? 'Safe Status: No expired medications recorded in active center inventory.'
          : type === 'expiring'
            ? `Safe Status: All medications are safely within acceptable validity periods (${thresholdDays} days).`
            : 'Safe Status: Inventory levels are sufficient and well above critical thresholds.';
        ctx.fillText(`✓  ${safeMsg}`, 75, y + 30);
        y += 66;
        return;
      }

      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(50, y, canvasWidth - 100, 36);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(50, y, canvasWidth - 100, 36);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 15px "Segoe UI", Tahoma, Arial, sans-serif';

      const colX = {
        num: 85,
        name: 300,
        detail: 620,
        qty: 820,
        action: 1020
      };

      ctx.fillText('#', colX.num, y + 23);
      ctx.fillText('Medication Name', colX.name, y + 23);
      ctx.fillText(type === 'critical' ? 'Current Stock / Min' : 'Expiry Date', colX.detail, y + 23);
      ctx.fillText('Current Qty', colX.qty, y + 23);
      ctx.fillText('Action Directive', colX.action, y + 23);
      y += 36;

      items.forEach((m, idx) => {
        if (y > canvasHeight - 120) {
          const newP = createPage();
          canvas = newP.canvas;
          ctx = newP.ctx;
          pages.push(canvas);
          y = 60;
        }

        ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        ctx.fillRect(50, y, canvasWidth - 100, 38);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.strokeRect(50, y, canvasWidth - 100, 38);

        ctx.textAlign = 'center';
        ctx.font = '14px "Segoe UI", Tahoma, Arial, sans-serif';
        ctx.fillStyle = '#0f172a';

        // Index
        ctx.fillText(`${idx + 1}`, colX.num, y + 24);

        // Name
        const medName = m.commercialNameEn || m.commercialName;
        ctx.textAlign = 'left';
        ctx.fillText(medName.slice(0, 35), colX.name - 140, y + 24);

        // Detail
        ctx.textAlign = 'center';
        if (type === 'critical') {
          ctx.fillStyle = '#c2410c';
          ctx.fillText(`${m.quantity} / 15 units`, colX.detail, y + 24);
        } else {
          ctx.fillStyle = type === 'expired' ? '#b91c1c' : '#b45309';
          ctx.fillText(cleanExpiry(m.expiryDate), colX.detail, y + 24);
        }

        // Qty
        ctx.fillStyle = '#334155';
        ctx.fillText(`${m.quantity} ${m.unit || 'units'}`, colX.qty, y + 24);

        // Action
        ctx.font = 'bold 13px "Segoe UI", Tahoma, Arial, sans-serif';
        if (type === 'expired') {
          ctx.fillStyle = '#dc2626';
          ctx.fillText('Immediate Quarantine', colX.action, y + 24);
        } else if (type === 'expiring') {
          ctx.fillStyle = '#d97706';
          ctx.fillText('Prioritize Dispensing', colX.action, y + 24);
        } else {
          ctx.fillStyle = '#ea580c';
          ctx.fillText('Urgent Stock Reorder', colX.action, y + 24);
        }

        y += 38;
      });

      y += 24;
    };

    drawSectionHeader('Section 1: Expired Medications', '#ef4444');
    drawItemsTable(expired, 'expired');

    drawSectionHeader(`Section 2: Medications Approaching Expiration (Within ${thresholdDays} Days)`, '#f59e0b');
    drawItemsTable(expiring, 'expiring');

    drawSectionHeader('Section 3: Critical Low Stock Items (15 Units or Less)', '#f97316');
    drawItemsTable(critical, 'critical');

    drawSectionHeader('Section 4: Clinical & Governance Directives', '#059669');

    ctx.direction = 'ltr';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#334155';
    ctx.font = '15px "Segoe UI", Tahoma, Arial, sans-serif';

    const directives = [
      '1. Strictly enforce First Expired First Out dispensing policy across all medical wards.',
      '2. Regularly verify storage temperature logs to ensure pharmacological integrity.',
      '3. Maintain active communication with clinical teams to guarantee resident wellness.'
    ];

    directives.forEach(dir => {
      if (y > canvasHeight - 100) {
        const newP = createPage();
        canvas = newP.canvas;
        ctx = newP.ctx;
        pages.push(canvas);
        y = 60;
      }
      ctx.fillText(dir, 75, y + 10);
      y += 30;
    });

    y += 30;

    // Footer on last page
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, canvasHeight - 75, canvasWidth, 75);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, canvasHeight - 75, canvasWidth, 75);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 15px "Segoe UI", Tahoma, Arial, sans-serif';
    ctx.fillText('Official Publication: Shaqra Comprehensive Rehabilitation Center for Males Pharmacy  •  Automated Safety Report', canvasWidth / 2, canvasHeight - 35);

    return pages;
  };

  // Build Arabic PDF
  const arPages = buildArabicPages();
  const pdfAr = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  arPages.forEach((canvas, index) => {
    if (index > 0) pdfAr.addPage();
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdfAr.addImage(imgData, 'JPEG', 0, 0, 210, 297);
  });
  const arPdfBlob = pdfAr.output('blob');
  const arPdfBase64 = arrayBufferToBase64(pdfAr.output('arraybuffer'));
  const arPdfFile = new File([arPdfBlob], 'Shaqra_Center_Medication_Alerts_AR.pdf', { type: 'application/pdf' });

  // Build English PDF
  const enPages = buildEnglishPages();
  const pdfEn = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  enPages.forEach((canvas, index) => {
    if (index > 0) pdfEn.addPage();
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdfEn.addImage(imgData, 'JPEG', 0, 0, 210, 297);
  });
  const enPdfBlob = pdfEn.output('blob');
  const enPdfBase64 = arrayBufferToBase64(pdfEn.output('arraybuffer'));
  const enPdfFile = new File([enPdfBlob], 'Shaqra_Center_Medication_Alerts_EN.pdf', { type: 'application/pdf' });

  return {
    arPdfBlob,
    enPdfBlob,
    arPdfBase64,
    enPdfBase64,
    arPdfFile,
    enPdfFile
  };
}
