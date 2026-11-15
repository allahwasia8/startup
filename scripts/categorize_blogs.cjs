const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../src/content/blog');
const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));

/**
 * Word-boundary aware categorization. Order is intentional:
 * more specific topics win before the Business default.
 */
function determineCategory(title) {
  const t = title.toLowerCase().replace(/&amp;/g, '&');

  // Passport-first when passport is the primary subject (even if Post Office is mentioned)
  if (
    /\bpassport\b/.test(t) ||
    /\btravel documents?\b/.test(t) ||
    /\bhm passport office\b/.test(t) ||
    /\bpet travel\b/.test(t)
  ) {
    return 'Passports';
  }

  // Benefits before Tax so "working tax credit" / tax-free childcare land correctly
  // Skip when HMRC/tax app is the primary subject
  if (!/\bhmrc app\b/.test(t) && (
    /\buniversal credit\b/.test(t) ||
    /\bworking tax credit\b/.test(t) ||
    /\btax-free childcare\b/.test(t) ||
    /\bchildcare account\b/.test(t) ||
    /\bchildcare costs\b/.test(t) ||
    /\bcarer's element\b/.test(t) ||
    /\bcarers element\b/.test(t) ||
    /\bpension credits?\b/.test(t) ||
    /\bhousing benefit\b/.test(t) ||
    /\bsickness benefit\b/.test(t) ||
    /\bcold weather payments?\b/.test(t) ||
    /\bdwp\b/.test(t) ||
    /\bbenefit advisor\b/.test(t) ||
    /\bbenefit cap\b/.test(t) ||
    (/\bbenefits?\b/.test(t) && !/\bhmrc\b/.test(t)) ||
    /\ballowance\b/.test(t)
  )) {
    return 'Benefits';
  }

  // Post Office / Royal Mail (after passport/benefits so UC + passport renewals stay correct)
  if (
    /\bpost offices?\b/.test(t) ||
    /\broyal mail\b/.test(t) ||
    /\bparcelforce\b/.test(t) ||
    /\bpostal service\b/.test(t) ||
    /\bletterbox\b/.test(t) ||
    /\bgeneral post office\b/.test(t) ||
    /\bgpo\b/.test(t)
  ) {
    return 'Post Office';
  }

  // Motoring — require word-boundary "mot" so "amount"/"promote" do not match
  if (
    /\bmot\b/.test(t) ||
    /\bdvla\b/.test(t) ||
    /\bvehicle\b/.test(t) ||
    /\bautomobile\b/.test(t) ||
    /\bdriving\b/.test(t) ||
    /\bmileage\b/.test(t) ||
    /\bbhp\b/.test(t) ||
    /\bhire purchase\b/.test(t) ||
    /\bextended warranties\b/.test(t) ||
    /\bcar service\b/.test(t) ||
    /\btax a car\b/.test(t) ||
    /\bwithout mot\b/.test(t) ||
    /\bnew cars\b/.test(t)
  ) {
    return 'Motoring';
  }

  // Company formation with HMRC stays Business (primary topic is incorporation)
  if (
    /\bregister(?:ing)? (?:a )?limited company\b/.test(t) ||
    /\bcompanies house\b/.test(t) ||
    /\bcompany formation\b/.test(t)
  ) {
    return 'Business';
  }

  // Tax (council tax, HMRC, VAT, etc.) — after benefits/motoring/business-formation
  if (
    /\bhmrc\b/.test(t) ||
    /\bvat\b/.test(t) ||
    /\bself assessment\b/.test(t) ||
    /\bmaking tax digital\b/.test(t) ||
    /\bgovernment gateway\b/.test(t) ||
    /\bpaye\b/.test(t) ||
    /\bcouncil tax\b/.test(t) ||
    /\bpersonal tax\b/.test(t) ||
    /\bbritish tax\b/.test(t) ||
    /\btaxes?\b/.test(t)
  ) {
    return 'Tax';
  }

  return 'Business';
}

let updated = 0;
const changes = [];

files.forEach((f) => {
  const filePath = path.join(blogDir, f);
  const content = fs.readFileSync(filePath, 'utf8');

  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  if (!titleMatch) return;
  const title = titleMatch[1];
  const currentMatch = content.match(/category:\s*"([^"]+)"/);
  const current = currentMatch ? currentMatch[1] : null;
  const category = determineCategory(title);

  if (current === category) return;

  let newContent;
  if (currentMatch) {
    newContent = content.replace(/category:\s*"[^"]+"/, `category: "${category}"`);
  } else {
    newContent = content.replace(/^(---\r?\n(?:.*\r?\n)*?)(---)/m, `$1category: "${category}"\n$2`);
  }

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    updated++;
    changes.push({ file: f, from: current, to: category });
  }
});

console.log(`Updated ${updated} files.`);
console.log(JSON.stringify(changes, null, 2));
