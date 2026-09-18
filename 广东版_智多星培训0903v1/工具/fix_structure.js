const fs = require('fs');
const path = 'c:\\Users\\63261\\.qoderworkcn\\workspace\\mswz3gfs99ux36sq\\outputs\\outputs\\通联智多星平台培训_设计稿.html';
let html = fs.readFileSync(path, 'utf-8');
let lines = html.split('\n');
console.log('Starting fix. Lines:', lines.length);

function findLine(arr, str, start) {
  for (let i = start || 0; i < arr.length; i++) {
    if (arr[i].includes(str)) return i;
  }
  return -1;
}

// ═══════════════════════════════════════════════
// STEP 1: Extract 多端上线 slide from wrong position
// ═══════════════════════════════════════════════
const ddsTitle = findLine(lines, '多端上线，已全面覆盖');
let ddsStart = ddsTitle;
while (ddsStart > 0 && !lines[ddsStart].includes('<div class="slide"')) ddsStart--;
// Find end of this slide
let ddsFooter = findLine(lines, 'page-footer', ddsTitle);
let ddsEnd = findLine(lines, '</div>', ddsFooter) + 1;
// Include trailing blank line
if (ddsEnd < lines.length && lines[ddsEnd].trim() === '') ddsEnd++;

const ddsBlock = lines.slice(ddsStart, ddsEnd);
lines.splice(ddsStart, ddsEnd - ddsStart);
console.log(`Extracted 多端上线: ${ddsBlock.length} lines from position ${ddsStart}`);

// ═══════════════════════════════════════════════
// STEP 2: Change PART 03 divider from "运营实战" to "实战演示"
// ═══════════════════════════════════════════════
const p3Idx = findLine(lines, 'PART 03');
// Change title
const p3TitleLine = findLine(lines, '运营实战', p3Idx);
if (p3TitleLine >= 0) {
  lines[p3TitleLine] = lines[p3TitleLine].replace('运营实战', '实战演示');
  console.log('Changed PART 03 title to 实战演示');
}
// Change subtitle
const p3SubLine = findLine(lines, '面向分公司运营人员', p3Idx);
if (p3SubLine >= 0) {
  lines[p3SubLine] = lines[p3SubLine].replace(
    '面向分公司运营人员 · 日常工作中最容易碰到的场景',
    '多端上线 · 运营场景 · 市场场景'
  );
  console.log('Changed PART 03 subtitle');
}
// Replace chips - remove old ones and add new
const p3ChipsStart = findLine(lines, 'divider-chips', p3Idx);
const p3ChipsEnd = findLine(lines, '</div>', p3ChipsStart + 1);
// Build new chips
const newChips = [
  '    <div class="divider-chips">',
  '      <div class="divider-chip">多端上线</div>',
  '      <div class="divider-chip">运营场景</div>',
  '      <div class="divider-chip">市场场景</div>',
  '    </div>'
];
lines.splice(p3ChipsStart, p3ChipsEnd - p3ChipsStart + 1, ...newChips);
console.log('Replaced PART 03 chips');

// ═══════════════════════════════════════════════
// STEP 3: Insert 多端上线 slide right after PART 03 divider
// ═══════════════════════════════════════════════
const p3SlideFooter = findLine(lines, 'page-footer', p3Idx);
const p3CloseDiv = findLine(lines, '</div>', p3SlideFooter) + 1;
lines.splice(p3CloseDiv, 0, '', ...ddsBlock);
console.log(`Inserted 多端上线 after PART 03 divider at line ${p3CloseDiv}`);

// ═══════════════════════════════════════════════
// STEP 4: Remove PART 04 divider (市场实战)
// ═══════════════════════════════════════════════
const p4Comment = findLine(lines, 'SLIDE 14 — MARKET SECTION DIVIDER');
if (p4Comment >= 0) {
  const p4Start = p4Comment - 1; // <!-- line
  const p4SlideStart = findLine(lines, '<div class="slide"', p4Start);
  const p4Footer = findLine(lines, 'page-footer', p4SlideStart);
  const p4End = findLine(lines, '</div>', p4Footer) + 1;
  // Include trailing blank line
  const p4EndFinal = (p4End < lines.length && lines[p4End].trim() === '') ? p4End + 1 : p4End;
  const removed = p4EndFinal - p4Start;
  lines.splice(p4Start, removed);
  console.log(`Removed PART 04 divider: ${removed} lines`);
} else {
  console.log('PART 04 divider comment not found, trying alternative search');
  const p4Alt = findLine(lines, 'PART 04');
  if (p4Alt >= 0) {
    const p4SlideStart = findLine(lines, '<div class="slide"', p4Alt - 5);
    const p4Footer = findLine(lines, 'page-footer', p4SlideStart);
    const p4End = findLine(lines, '</div>', p4Footer) + 1;
    const p4EndFinal = (p4End < lines.length && lines[p4End].trim() === '') ? p4End + 1 : p4End;
    // Also remove preceding comment and blank line
    let p4RealStart = p4SlideStart;
    if (p4RealStart > 0 && lines[p4RealStart - 1].trim() === '') p4RealStart--;
    if (p4RealStart > 0 && lines[p4RealStart - 1].includes('<!--')) p4RealStart--;
    const removed = p4EndFinal - p4RealStart;
    lines.splice(p4RealStart, removed);
    console.log(`Removed PART 04 divider (alt): ${removed} lines`);
  }
}

// ═══════════════════════════════════════════════
// STEP 5: Fix data-index attributes
// ═══════════════════════════════════════════════
let slideIdx = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].match(/<div class="slide"/)) {
    lines[i] = lines[i].replace(/data-index="[^"]*"/, `data-index="${slideIdx}"`);
    slideIdx++;
  }
}
const totalSlides = slideIdx;
console.log(`Fixed data-index for ${totalSlides} slides`);

// ═══════════════════════════════════════════════
// STEP 6: Fix page footers
// ═══════════════════════════════════════════════
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/page-footer/);
  if (m) {
    const pm = lines[i].match(/<span>(\d+)\s*\/\s*\d+<\/span>/);
    if (pm) {
      // Find the data-index of this slide
      for (let j = i; j >= 0; j--) {
        const dm = lines[j].match(/data-index="(\d+)"/);
        if (dm) {
          const newNum = parseInt(dm[1]) + 1;
          lines[i] = lines[i].replace(/<span>\d+\s*\/\s*\d+<\/span>/, `<span>${newNum} / ${totalSlides}</span>`);
          break;
        }
      }
    }
  }
}
console.log(`Fixed page footers (total: ${totalSlides})`);

// ═══════════════════════════════════════════════
// STEP 7: Fix style tag CSS selectors
// ═══════════════════════════════════════════════
// Find which data-index the 能力全景 and 智慧经营 slides now have
let nlpqIdx = -1, zhyjIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('通联智多星能力全景')) {
    for (let j = i; j >= 0; j--) {
      const m = lines[j].match(/data-index="(\d+)"/);
      if (m) { nlpqIdx = parseInt(m[1]); break; }
    }
  }
  if (lines[i].includes('智慧经营：面向商户') && lines[i].includes('sec-title')) {
    for (let j = i; j >= 0; j--) {
      const m = lines[j].match(/data-index="(\d+)"/);
      if (m) { zhyjIdx = parseInt(m[1]); break; }
    }
  }
}
if (nlpqIdx >= 0 && zhyjIdx >= 0) {
  const newStyle = `<style>.slide[data-index="${nlpqIdx}"] .sec-sub{margin-bottom:28px}.slide[data-index="${zhyjIdx}"] .sec-sub{margin-bottom:22px}</style>`;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<style>.slide[data-index=') && lines[i].includes('.sec-sub')) {
      lines[i] = '  ' + newStyle;
      console.log(`Fixed style tag: 能力全景=${nlpqIdx}, 智慧经营=${zhyjIdx}`);
      break;
    }
  }
}

// ═══════════════════════════════════════════════
// Write
// ═══════════════════════════════════════════════
fs.writeFileSync(path, lines.join('\n'), 'utf-8');
console.log(`\nDone! Total lines: ${lines.length}, Slides: ${totalSlides}`);

// ═══════════════════════════════════════════════
// Verify
// ═══════════════════════════════════════════════
const vHtml = fs.readFileSync(path, 'utf-8');
const vLines = vHtml.split('\n');
for (let i = 0; i < vLines.length; i++) {
  const m = vLines[i].match(/<div class="slide" data-index="(\d+)"/);
  if (m) {
    let title = '';
    for (let j = i; j < Math.min(i + 25, vLines.length); j++) {
      const t = vLines[j].match(/sec-title[^>]*>([^<]+)/);
      if (t) { title = t[1]; break; }
      const h = vLines[j].match(/<h[12][^>]*>([^<]+)/);
      if (h) { title = h[1]; break; }
    }
    console.log(`  ${m[1]}: ${title || '(cover/divider)'}`);
  }
}
