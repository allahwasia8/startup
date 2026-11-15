import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '../src/content/blog');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));

function fm(content, key) {
  return (content.match(new RegExp(`^${key}:\\s*"([^"]*)"`, 'm')) || [])[1] || '';
}

const posts = files.map((f) => {
  const c = fs.readFileSync(path.join(dir, f), 'utf8');
  return {
    f,
    title: fm(c, 'title'),
    seo_title: fm(c, 'seo_title'),
    seo_description: fm(c, 'seo_description'),
    category: fm(c, 'category'),
    body: c,
  };
});

const targets = [
  { q: 'how to get a passport', impressions: 672, keys: ['apply', 'passport', 'first'] },
  { q: 'unlimited company', impressions: 239, keys: ['unlimited', 'company'] },
  { q: 'mot booking / book mot', impressions: 217, keys: ['book', 'mot'] },
  { q: 'post office limited', impressions: 201, keys: ['post-office-ltd', 'post office ltd'] },
  { q: 'post office basic bank account', impressions: 172, keys: ['post-office-bank', 'bank'] },
  { q: 'tax credits', impressions: 149, keys: ['tax-credit', 'working-tax'] },
  { q: 'venture capital definition', impressions: 149, keys: ['venture-capital'] },
  { q: 'sole trader and employed', impressions: 127, keys: ['employed-self', 'sole'] },
  { q: 'illness / sick pay self employed', impressions: 123, keys: ['sickness-benefit', 'sick'] },
  { q: 'carers allowance universal credit', impressions: 100, keys: ['carer'] },
  { q: 'appointing a director', impressions: 79, keys: ['appointment-director', 'appoint'] },
  { q: 'companies house forms', impressions: 68, keys: ['companies-house-forms'] },
  { q: 'plc vs ltd', impressions: 68, keys: ['define-plc', 'plc'] },
  { q: 'company registration uk', impressions: 68, keys: ['register-company', 'company-formation'] },
  { q: 'mot due date check', impressions: 1, keys: ['mot-due', 'my-mot-due'] },
  { q: 'passport address change', impressions: 5, keys: ['change-address-uk-passport'] },
  { q: 'british tax', impressions: 79, keys: ['british-tax'] },
  { q: 'making tax digital', impressions: 46, keys: ['making-tax-digital'] },
  { q: 'cic formation', impressions: 40, keys: ['community-interest'] },
  { q: 'hire purchase', impressions: 52, keys: ['hire-purchase'] },
  { q: 'sign passport', impressions: 46, keys: ['sign-passport'] },
  { q: 'passport tracking', impressions: 36, keys: ['passport-tracking', 'british-passport-tracking'] },
  { q: 'sole trader companies house', impressions: 59, keys: ['companies-house-amp-sole', 'sole'] },
  { q: 'file company accounts hmrc', impressions: 71, keys: ['accounts-companies-house'] },
  { q: 'registered email address', impressions: 2076, keys: ['registered-email'] },
  { q: 'post office travel money', impressions: 71, keys: ['travel-money'] },
  { q: 'family allowance', impressions: 39, keys: ['family-allowance'] },
  { q: 'hmrc app', impressions: 25, keys: ['hmrc-app'] },
  { q: 'dormant company', impressions: 23, keys: ['dormant'] },
  { q: 'sic code', impressions: 16, keys: ['sic'] },
  { q: 'intrapreneur', impressions: 12, keys: ['intrapreneur'] },
];

function score(post, keys) {
  const hay = `${post.f} ${post.title} ${post.seo_title}`.toLowerCase();
  return keys.reduce((s, k) => s + (hay.includes(k.toLowerCase()) ? 2 : 0), 0);
}

for (const t of targets) {
  const ranked = posts
    .map((p) => ({ p, s: score(p, t.keys) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 4);
  console.log(`\n### ${t.q} (${t.impressions})`);
  if (!ranked.length) console.log('  NO MATCH');
  for (const { p, s } of ranked) {
    console.log(`  [${s}] ${p.f}`);
    console.log(`      title: ${p.title.slice(0, 90)}`);
    console.log(`      seo_title: ${p.seo_title.slice(0, 90) || '(none)'}`);
    console.log(`      seo_desc: ${p.seo_description.slice(0, 100) || '(none)'}`);
  }
}
