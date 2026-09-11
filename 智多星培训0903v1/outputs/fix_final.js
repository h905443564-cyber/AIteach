const fs = require('fs');
const P = 'c:\\Users\\63261\\.qoderworkcn\\workspace\\mswz3gfs99ux36sq\\outputs\\outputs\\通联智多星平台培训_设计稿.html';
let lines = fs.readFileSync(P, 'utf-8').split('\n');
console.log('Lines:', lines.length);

function fl(arr, s, st) { for (let i=st||0;i<arr.length;i++) if(arr[i].includes(s)) return i; return -1; }

// ═══ FIX 1: Add missing </div> after 数据能力 slide ═══
// Line 985 has page-footer, line 986 is empty, line 987 starts next slide
const dsnlFooter = fl(lines, '10 / 22');
if (dsnlFooter >= 0) {
  const nextLine = dsnlFooter + 1;
  if (lines[nextLine].trim() === '') {
    lines[nextLine] = '</div>';
    console.log('FIX 1: Added </div> after 数据能力 footer');
  }
}

// ═══ FIX 2: Clean up PART 03 divider chips ═══
const p3 = fl(lines, 'PART 03');
const chipsDiv = fl(lines, 'divider-chips', p3);
// Find the closing </div> for the chips - it's the next </div> after divider-content's closing
// Actually, let me find divider-content first
const divContent = fl(lines, 'divider-content', p3);
// The chips are inside divider-content. Find all divider-chip lines and remove the old ones
const oldChips = ['排查系统问题','查询经营数据','商户全景信息','商户问题诊断','产品知识学习','知识库建设'];
for (const chip of oldChips) {
  const idx = fl(lines, chip, chipsDiv);
  if (idx >= 0 && idx < chipsDiv + 20) {
    lines.splice(idx, 1);
    console.log(`Removed old chip: ${chip}`);
  }
}

// ═══ FIX 3: Move 多端上线 slide to after PART 03 divider ═══
// First, extract 多端上线 from current position
const ddsTitle = fl(lines, '多端上线，已全面覆盖');
let ddsStart = ddsTitle;
while (ddsStart > 0 && !lines[ddsStart].includes('<div class="slide"')) ddsStart--;
let ddsFooter = fl(lines, 'page-footer', ddsTitle);
let ddsEnd = fl(lines, '</div>', ddsFooter) + 1;
if (ddsEnd < lines.length && lines[ddsEnd].trim() === '') ddsEnd++;

const ddsBlock = lines.slice(ddsStart, ddsEnd);
lines.splice(ddsStart, ddsEnd - ddsStart);
console.log(`Extracted 多端上线: ${ddsBlock.length} lines`);

// Now find PART 03 divider's closing </div>
const p3New = fl(lines, 'PART 03');
const p3FooterNew = fl(lines, 'page-footer', p3New);
const p3CloseDiv = fl(lines, '</div>', p3FooterNew) + 1;
lines.splice(p3CloseDiv, 0, '', ...ddsBlock);
console.log(`Inserted 多端上线 after PART 03 at line ${p3CloseDiv}`);

// ═══ FIX 4: Re-number data-index ═══
let si = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].match(/<div class="slide"/)) {
    lines[i] = lines[i].replace(/data-index="[^"]*"/, `data-index="${si}"`);
    si++;
  }
}
const total = si;
console.log(`Slides: ${total}`);

// ═══ FIX 5: Fix page footers ═══
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('page-footer')) {
    const pm = lines[i].match(/<span>(\d+)\s*\/\s*\d+<\/span>/);
    if (pm) {
      for (let j = i; j >= 0; j--) {
        const dm = lines[j].match(/data-index="(\d+)"/);
        if (dm) {
          const n = parseInt(dm[1]) + 1;
          lines[i] = lines[i].replace(/<span>\d+\s*\/\s*\d+<\/span>/, `<span>${n} / ${total}</span>`);
          break;
        }
      }
    }
  }
}
console.log('Footers fixed');

// ═══ Write ═══
fs.writeFileSync(P, lines.join('\n'), 'utf-8');
console.log(`\nDone! ${lines.length} lines, ${total} slides`);

// ═══ Verify ═══
const vl = fs.readFileSync(P, 'utf-8').split('\n');
for (let i = 0; i < vl.length; i++) {
  const m = vl[i].match(/<div class="slide" data-index="(\d+)"/);
  if (m) {
    let t = '';
    for (let j = i; j < Math.min(i+25, vl.length); j++) {
      const tm = vl[j].match(/sec-title[^>]*>([^<]+)/); if(tm){t=tm[1];break;}
      const hm = vl[j].match(/<h[12][^>]*>([^<]+)/); if(hm){t=hm[1];break;}
    }
    console.log(`  ${m[1]}: ${t||'(cover/divider)'}`);
  }
}
