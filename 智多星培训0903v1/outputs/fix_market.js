const fs = require('fs');
const path = 'c:\\Users\\63261\\.qoderworkcn\\workspace\\mswz3gfs99ux36sq\\outputs\\outputs\\通联智多星平台培训_设计稿.html';
let lines = fs.readFileSync(path, 'utf-8').split('\n');
console.log('Starting fix. Lines:', lines.length);

function findLine(arr, str, start) {
  for (let i = start || 0; i < arr.length; i++) {
    if (arr[i].includes(str)) return i;
  }
  return -1;
}

// ═══════════════════════════════════════════════
// STEP 1: Insert 市场实战（上）slide back
// ═══════════════════════════════════════════════
// Find the position: after 运营实战（下）slide, before 市场实战（下）slide
const yysxEnd = findLine(lines, '19 / 21'); // page footer of 运营实战（下）
const yysxCloseDiv = findLine(lines, '</div>', yysxEnd) + 1;

// Also remove the stray </div> at the next line if present
if (yysxCloseDiv < lines.length && lines[yysxCloseDiv].trim() === '</div>') {
  lines.splice(yysxCloseDiv, 1);
  console.log('Removed stray </div>');
}

const marketUpperSlide = [
  '',
  '<!-- ═══════════════════════════════════════════════════════════',
  '     SLIDE — MARKET SCENARIOS 1-3',
  '     ═══════════════════════════════════════════════════════════ -->',
  '<div class="slide" data-index="temp_market">',
  '  <div class="blob blob-orange" style="width:225px;height:225px;top:-45px;left:20%"></div>',
  '  <div class="content">',
  '    <div class="sec-title">市场实战（上）</div>',
  '    <div class="sec-sub">产品推荐 · 商户自助 · 经营分析</div>',
  '    <div class="three-col" style="align-items:start">',
  '      <div class="scene-card">',
  '        <div class="scene-card-header">',
  '          <div class="num" style="background:linear-gradient(135deg,var(--brand),var(--brand-l))">1</div>',
  '          <h3>向商户介绍产品方案</h3>',
  '        </div>',
  '        <div class="scene-tag" style="background:linear-gradient(135deg,#EFF6FF,#DBEAFE);color:var(--brand);border-left-color:var(--brand)">&#x2728; 补充场景背景能让推荐更精准</div>',
  '        <div class="flow-steps">',
  '          <div class="flow-step blue"><strong>典型情况</strong>拜访商户前需快速了解产品</div>',
  '          <span class="flow-arrow">&#x2193;</span>',
  '          <div class="flow-step green"><strong>操作</strong>补充具体业务场景 → AI 推荐方案 → 追问费率和开通流程</div>',
  '        </div>',
  '        <div class="qa-bubble blue"><span class="qa-label blue">推荐提问</span>"商户想做线上收款，支持微信和支付宝，有什么产品推荐？"</div>',
  '        <a href="#对话链接-市场上-1" target="_blank" style="display:inline-flex;align-items:center;gap:4px;font-size:13px;color:var(--brand);text-decoration:none;margin-top:3px;opacity:.75;transition:opacity .2s" onmouseenter="this.style.opacity=\'1\'" onmouseleave="this.style.opacity=\'.75\'">&#x1f4ac; 查看对话详情 &rarr;</a>',
  '      </div>',
  '      <div class="scene-card">',
  '        <div class="scene-card-header">',
  '          <div class="num" style="background:linear-gradient(135deg,var(--brand),var(--brand-l))">2</div>',
  '          <h3>协助商户自助查询</h3>',
  '        </div>',
  '        <div class="scene-tag" style="background:linear-gradient(135deg,#EFF6FF,#DBEAFE);color:var(--brand);border-left-color:var(--brand)">&#x2728; 话术：在好老板 APP 上直接问发仔就行</div>',
  '        <div class="flow-steps">',
  '          <div class="flow-step blue"><strong>典型情况</strong>商户需查交易、看余额、调整结算信息</div>',
  '          <span class="flow-arrow">&#x2193;</span>',
  '          <div class="flow-step green"><strong>操作</strong>引导商户在好老板 APP 点击发仔 → 直接问/发起自助变更</div>',
  '        </div>',
  '        <div class="qa-bubble blue"><span class="qa-label blue">推荐提问</span>"教商户在好老板 APP 上问发仔查余额"</div>',
  '        <a href="#对话链接-市场上-2" target="_blank" style="display:inline-flex;align-items:center;gap:4px;font-size:13px;color:var(--brand);text-decoration:none;margin-top:3px;opacity:.75;transition:opacity .2s" onmouseenter="this.style.opacity=\'1\'" onmouseleave="this.style.opacity=\'.75\'">&#x1f4ac; 查看对话详情 &rarr;</a>',
  '      </div>',
  '      <div class="scene-card">',
  '        <div class="scene-card-header">',
  '          <div class="num" style="background:linear-gradient(135deg,var(--brand),var(--brand-l))">3</div>',
  '          <h3>商户经营分析支持</h3>',
  '        </div>',
  '        <div class="scene-tag" style="background:linear-gradient(135deg,#EFF6FF,#DBEAFE);color:var(--brand);border-left-color:var(--brand)">&#x2728; 深度整合商户及行业数据</div>',
  '        <div class="flow-steps">',
  '          <div class="flow-step blue"><strong>典型情况</strong>为商户提供经营回顾或优化建议</div>',
  '          <span class="flow-arrow">&#x2193;</span>',
  '          <div class="flow-step green"><strong>操作</strong>输入商户号 → AI 调用经营分析接口 → 返回结构化数据 → 结合数据给建议</div>',
  '        </div>',
  '        <div class="qa-bubble blue"><span class="qa-label blue">推荐提问</span>"帮我分析商户 8001234567 最近三个月的经营情况，有什么问题？"</div>',
  '        <a href="#对话链接-市场上-3" target="_blank" style="display:inline-flex;align-items:center;gap:4px;font-size:13px;color:var(--brand);text-decoration:none;margin-top:3px;opacity:.75;transition:opacity .2s" onmouseenter="this.style.opacity=\'1\'" onmouseleave="this.style.opacity=\'.75\'">&#x1f4ac; 查看对话详情 &rarr;</a>',
  '      </div>',
  '    </div>',
  '    <div style="margin-top:10px;padding:10px 16px;border-radius:var(--radius-sm);background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border:1px solid rgba(0,91,172,.15);display:flex;align-items:center;font-size:15px;color:var(--brand-d);line-height:1.5">',
  '      <span style="font-size:20px;margin-right:3px">&#x1f4a1;</span>',
  '      <strong>市场小贴士：</strong>以上场景适合在拜访商户前或日常沟通中使用。建议提前把产品手册、费率表、竞品对比文档上传到部门知识库，AI 推荐会更精准。',
  '    </div>',
  '  </div>',
  '  <div class="page-footer"><span>通联智多星平台交流</span><span>MARKET_UPPER / 22</span></div>',
  '</div>'
];

lines.splice(yysxCloseDiv, 0, ...marketUpperSlide);
console.log(`Inserted 市场实战（上）slide at line ${yysxCloseDiv}`);

// ═══════════════════════════════════════════════
// STEP 2: Fix data-index attributes
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
// STEP 3: Fix page footers
// ═══════════════════════════════════════════════
// First fix the MARKET_UPPER placeholder
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('MARKET_UPPER / 22')) {
    for (let j = i; j >= 0; j--) {
      const m = lines[j].match(/data-index="(\d+)"/);
      if (m) {
        const pageNum = parseInt(m[1]) + 1;
        lines[i] = lines[i].replace('MARKET_UPPER / 22', `${pageNum} / ${totalSlides}`);
        break;
      }
    }
    break;
  }
}

// Fix all other footers
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/page-footer/);
  if (m) {
    const pm = lines[i].match(/<span>(\d+)\s*\/\s*\d+<\/span>/);
    if (pm) {
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
// Write
// ═══════════════════════════════════════════════
fs.writeFileSync(path, lines.join('\n'), 'utf-8');
console.log(`\nDone! Lines: ${lines.length}, Slides: ${totalSlides}`);

// ═══════════════════════════════════════════════
// Verify
// ═══════════════════════════════════════════════
const vLines = fs.readFileSync(path, 'utf-8').split('\n');
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
