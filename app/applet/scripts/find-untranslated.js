const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = content.split('\n');
const arabicRegex = /[\u0600-\u06FF]/;

const findings = [];
let inReportGen = false;

lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  const trimmed = line.trim();
  
  if (trimmed.includes('function generateComprehensiveReportText') || trimmed.includes('function generateReferralAlert')) {
    inReportGen = true;
  }
  if (inReportGen && trimmed.startsWith('}')) {
    inReportGen = false;
    return;
  }
  if (inReportGen) return;

  // Skip comments
  if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;

  if (arabicRegex.test(trimmed)) {
    // Sanitize text(...) and t(...)
    const sanitized = trimmed
      .replace(/text\s*\(\s*(['"`][\s\S]*?['"`])\s*,\s*(['"`][\s\S]*?['"`])\s*\)/g, '')
      .replace(/t\s*\(\s*['"`][^'"`]*['"`]\s*\)/g, '');
    
    if (arabicRegex.test(sanitized)) {
      findings.push({ lineNum, line: trimmed });
    }
  }
});

console.log('Total untranslated Arabic lines:', findings.length);
findings.forEach((f, i) => {
  console.log(`${f.lineNum}: ${f.line}`);
});
