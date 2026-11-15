import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const blogDir = path.join(root, 'src/content/blog');
const publicDir = path.join(root, 'public');

const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));
const missing = [];
const cats = {};
const rows = [];

for (const f of files) {
  const content = fs.readFileSync(path.join(blogDir, f), 'utf8');
  const title = (content.match(/^title:\s*"([^"]+)"/m) || [])[1] || f;
  const category = (content.match(/^category:\s*"([^"]+)"/m) || [])[1] || 'MISSING';
  const image = (content.match(/^image:\s*"([^"]+)"/m) || [])[1];
  cats[category] = (cats[category] || 0) + 1;

  if (image) {
    const local = path.join(publicDir, image.replace(/^\//, ''));
    if (!fs.existsSync(local)) missing.push({ f, image, kind: 'frontmatter' });
  } else {
    missing.push({ f, image: '(none)', kind: 'frontmatter' });
  }

  for (const img of [...content.matchAll(/src="(\/images\/[^"]+)"/g)].map((m) => m[1])) {
    const local = path.join(publicDir, img.replace(/^\//, ''));
    if (!fs.existsSync(local)) missing.push({ f, image: img, kind: 'body' });
  }

  rows.push({ f, title, category });
}

const staticAssets = [
  '/images/logo_final_transparent.png',
  '/images/london-hero.jpg',
  '/images/blog/default-featured-image.webp',
];
for (const asset of staticAssets) {
  const local = path.join(publicDir, asset.replace(/^\//, ''));
  if (!fs.existsSync(local)) missing.push({ f: '(site)', image: asset, kind: 'static' });
}

function suggest(title) {
  const t = title.toLowerCase();
  if (/\bpost office\b|\broyal mail\b|\bpostal service\b|\bletterbox\b|\bmail uk\b/.test(t)) {
    return 'Post Office';
  }
  if (/\bpassport\b|\bhm passport\b|\btravel document\b|\bpet travel\b/.test(t)) {
    return 'Passports';
  }
  if (
    /\b\bmot\b|\bmot\b|vehicle|dvla|driving without|automobile|car service|mileage|bhp checker|extended warranties/.test(
      t,
    ) ||
    /\bmot\b/.test(t) ||
    t.includes(' mot ') ||
    t.startsWith('mot ') ||
    t.endsWith(' mot') ||
    t.includes('mot test') ||
    t.includes('mot check') ||
    t.includes('mot due') ||
    t.includes('without mot')
  ) {
    return 'Motoring';
  }
  if (
    /\buniversal credit\b|\bbenefit\b|\ballowance\b|\bdwp\b|\bpension credit\b|\bhousing benefit\b|\bworking tax credit\b|\bchildcare account\b|\bcold weather payment\b|\bsickness benefit\b/.test(
      t,
    )
  ) {
    return 'Benefits';
  }
  if (
    /\bhmrc\b|\bvat\b|\bself assessment\b|\bmaking tax\b|\bgovernment gateway\b|\bpaye\b|\btax guide\b|\btax digital\b|\bpersonal tax\b/.test(
      t,
    )
  ) {
    return 'Tax';
  }
  if (
    /\bcompan(?:y|ies)\b|\bcompanies house\b|\bdirector\b|\bstartup\b|\bplc\b|\bsic\b|\bsole trader\b|\bcic\b|\bincorporat|\bshareholder\b|\bventure\b|\bbusiness plan\b|\bbusiness ideas\b|\bfunding\b|\bincubator\b|\bintrapreneur/.test(
      t,
    )
  ) {
    return 'Business';
  }
  return 'Business';
}

const mismatches = [];
for (const r of rows) {
  const s = suggest(r.title);
  if (s !== r.category) mismatches.push({ file: r.f, title: r.title, current: r.category, suggested: s });
}

console.log(JSON.stringify({ cats, missingCount: missing.length, missing: missing.slice(0, 40), mismatchCount: mismatches.length, mismatches }, null, 2));
