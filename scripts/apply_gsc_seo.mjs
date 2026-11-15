/**
 * Align seo_title / seo_description with high-impression GSC queries.
 * Keeps titles ~50–60 chars where possible; descriptions ~140–155 chars.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '../src/content/blog');

/** @type {Record<string, { seo_title: string; seo_description: string; title?: string }>} */
const updates = {
  'companies-house-registered-email.md': {
    seo_title: 'Companies House Registered Email Address Guide',
    seo_description:
      'Every UK company needs a Companies House registered email address. Learn how to add, update and keep yours compliant — step by step.',
  },
  'apply-passport-uk-step.md': {
    seo_title: 'How to Get a Passport in the UK (Step-by-Step)',
    seo_description:
      'How to get a UK passport online or by post: fees, photos, processing times and Check & Send. Apply for your first passport or renew today.',
  },
  'apply-british-passport-first.md': {
    seo_title: 'How to Apply for a British Passport First Time',
    seo_description:
      'First adult British passport: documents, fees, photos and timelines. Clear steps to apply online or via the Post Office Check & Send service.',
  },
  'unlimited-company-meaning-risks.md': {
    seo_title: 'What Is an Unlimited Company in the UK?',
    seo_description:
      'Unlimited company meaning, risks and unlimited vs limited company differences. When UK businesses use this structure — and when to avoid it.',
  },
  'mot-close-me-book.md': {
    seo_title: 'Book an MOT Test Online Near You',
    seo_description:
      'Book an MOT test online: find local centres, compare prices, same-day slots and what happens if your car fails. Max fee £54.85 for Class 4.',
  },
  'my-mot-due-check.md': {
    seo_title: 'MOT Due Date Check: When Is My MOT Due?',
    seo_description:
      'Check your MOT due date and history online with your registration. Free MOT reminders, legal rules and how to book before it expires.',
  },
  'book-mot-test-northern.md': {
    seo_title: 'Book an MOT Test in Northern Ireland (NI)',
    seo_description:
      'Book your MOT online in Northern Ireland: DVA centres, costs, retests and how NI MOT booking differs from Great Britain.',
  },
  'post-office-ltd-services.md': {
    seo_title: 'Post Office Ltd UK: Services & Network Guide',
    seo_description:
      'What Post Office Ltd does in the UK: parcels, banking, travel money, passport Check & Send and how to use your local Post Office branch.',
  },
  'post-office-bank-everyday.md': {
    seo_title: 'Post Office Banking & Basic Bank Account Access',
    seo_description:
      'Use Post Office banking for cash deposits, withdrawals and everyday banking with your existing debit card — including business pay-ins.',
  },
  'travel-money-post-office.md': {
    seo_title: 'Post Office Travel Money & Currency Exchange',
    seo_description:
      'Buy travel money and exchange currency at the Post Office: rates, order online for click & collect, euros, dollars and branch collection tips.',
  },
  'working-tax-credit-was.md': {
    seo_title: 'Tax Credits UK: Working Tax Credit Explained',
    seo_description:
      'What tax credits were, Working Tax Credit amounts and thresholds, and what replaced them (Universal Credit). Useful for overpayments and history.',
  },
  'definition-venture-capital-vc.md': {
    seo_title: 'Venture Capital Definition: What Is VC?',
    seo_description:
      'Clear venture capital definition: how VC funding works, what venture capitalists do, stages of funding and whether VC fits your startup.',
  },
  'employed-self-employed-same.md': {
    seo_title: 'Can You Be a Sole Trader and Employed?',
    seo_description:
      'Yes — you can be employed and self-employed (or a sole trader) at the same time in the UK. Tax, NI, registration and rights explained.',
  },
  'companies-house-amp-sole.md': {
    seo_title: 'Do Sole Traders Register with Companies House?',
    seo_description:
      'Sole traders do not register with Companies House or get a company number. What you must do with HMRC instead, and when to incorporate.',
  },
  'sickness-benefit-uk-claim.md': {
    seo_title: 'Sick Pay If Self Employed: Benefits Guide',
    seo_description:
      'Can self-employed claim sick pay? SSP rules, Universal Credit when ill, ESA and how to claim sickness benefits if you cannot work.',
  },
  'carer-s-element-universal.md': {
    seo_title: "Does Carer's Allowance Affect Universal Credit?",
    seo_description:
      "How Carer's Allowance interacts with Universal Credit, the carer's element amount in 2026, eligibility and what changes on your UC claim.",
  },
  'appointment-director-appoint-new.md': {
    seo_title: 'How to Appoint a Company Director (UK)',
    seo_description:
      'How to appoint or add a director to a UK company: AP01 form, Companies House filing, identity checks and step-by-step process.',
  },
  'companies-house-forms-essential.md': {
    seo_title: 'Companies House Forms: AP01, CS01 & More',
    seo_description:
      'Essential Companies House forms explained — AP01 director appointment, CS01, accounts and name changes — with when to use each one.',
  },
  'define-plc-company-public.md': {
    seo_title: 'PLC vs Ltd: What Is a Public Limited Company?',
    seo_description:
      'PLC vs Ltd explained: liability, share capital, stock market listing, advantages and disadvantages of a public limited company in the UK.',
  },
  'company-formation-step-step.md': {
    seo_title: 'Company Registration UK: Formation Guide',
    seo_description:
      'Register a limited company in the UK step by step: Companies House filing, SIC codes, directors, registered office and first-year duties.',
  },
  'register-company-free-uk.md': {
    seo_title: 'Register a Company in the UK (2026 Guide)',
    seo_description:
      'How UK company registration works, GOV.UK fees vs “free” formation offers, and what you still need to file after incorporation.',
  },
  'change-address-uk-passport.md': {
    seo_title: 'Passport Address Change UK: Do You Need To?',
    seo_description:
      'Changing address on a UK passport: when you must update HM Passport Office, what stays valid, and how to keep records up to date.',
  },
  'british-tax-guide-uk.md': {
    seo_title: 'British Tax Guide: UK Taxes Explained',
    seo_description:
      'British tax and UK tax laws overview: income tax, National Insurance, VAT, corporation tax and how HMRC collects — for individuals and businesses.',
  },
  'making-tax-digital-income.md': {
    seo_title: 'Making Tax Digital for Self Assessment',
    seo_description:
      'Making Tax Digital for Income Tax Self Assessment: qualifying income thresholds, software, quarterly updates and digital tax returns.',
  },
  'community-interest-company-cic.md': {
    seo_title: 'How to Set Up a CIC (Community Interest Company)',
    seo_description:
      'CIC formation and registration step by step: CIC vs limited company, asset lock, regulator rules and how to set up a community interest company.',
  },
  'hire-purchase-hp-works.md': {
    seo_title: 'What Is Hire Purchase? HP Explained (Example)',
    seo_description:
      'Hire purchase meaning with a clear example: how HP car finance works, costs vs conditional sale, and what happens at the end of the agreement.',
  },
  'sign-passport-uk-amp.md': {
    seo_title: 'Where to Sign a UK Passport (New Passport)',
    seo_description:
      'Where do you sign your new UK passport? Exact signature box location, tips to avoid rejection, and rules for children and renewals.',
  },
  'british-passport-tracking-check.md': {
    seo_title: 'UK Passport Tracking: Check Application Status',
    seo_description:
      'Track your UK or British passport application online: GOV.UK tracking, processing times, renewals and what to do if status stalls.',
  },
  'accounts-companies-house-file.md': {
    seo_title: 'File Company Accounts with Companies House',
    seo_description:
      'How to file company accounts with Companies House (and link to HMRC): deadlines, micro-entity options and common filing mistakes to avoid.',
  },
  'family-allowance-uk-family.md': {
    seo_title: 'Family Allowance UK: History & Child Benefit',
    seo_description:
      'What family allowance was in the UK, how it became Child Benefit, and how modern family payments compare for parents today.',
  },
  'hmrc-app-download-manage.md': {
    seo_title: 'HMRC App: Download & Manage Your Tax',
    seo_description:
      'Download the HMRC app to manage tax, National Insurance, Self Assessment and benefits. Features, login and what you can do on mobile.',
  },
  'dormant-company-definition-practical.md': {
    seo_title: 'What Is a Dormant Company in the UK?',
    seo_description:
      'Dormant company definition for UK directors: filing rules, dividends, trading illegally risks and dormant vs non-trading explained.',
  },
  'define-sic-codes-practical.md': {
    seo_title: 'What Is a SIC Code? UK Business Guide',
    seo_description:
      'SIC code meaning for UK companies: how many you can have, choosing the right nature of business code, and updating Companies House.',
  },
  'intrapreneurship-practical-guide-future.md': {
    seo_title: 'What Is Intrapreneurship? Practical Guide',
    seo_description:
      'Intrapreneurship definition and how it drives innovation inside companies — with practical steps for future business owners.',
    title: 'What Is Intrapreneurship? A Practical Guide for Future Business Owners',
  },
  'post-office-sending-package.md': {
    seo_title: 'Post Office Sending a Parcel: UK Options',
    seo_description:
      'How to send a parcel with the Post Office: postage methods, tracking, sizes and step-by-step posting options for UK letters and packages.',
  },
  'hardship-payments-universal-credit.md': {
    seo_title: 'Universal Credit Hardship Payment Guide',
    seo_description:
      'What a Universal Credit hardship payment is, how much you may get, eligibility and how to apply for a hardship payment online.',
  },
  'mot-check-motorbikes-check.md': {
    seo_title: 'Motorbike MOT: Check, Cost & Booking',
    seo_description:
      'Motorbike MOT rules: when bikes need a test, typical price, how to check history and book a motorcycle MOT in the UK.',
  },
  'mot-reminders-set-them.md': {
    seo_title: 'MOT Reminder Service: Never Miss Your Due Date',
    seo_description:
      'Set free MOT reminders by email or text, DVLA options, and how to manage MOT due alerts so you book before your certificate expires.',
  },
  'shorten-accounting-period-change.md': {
    seo_title: 'Change Accounting Reference Date (UK)',
    seo_description:
      'How to change or shorten your accounting reference date at Companies House, filing impact, and when directors use this option.',
  },
  'uk-company-articles-association.md': {
    seo_title: 'Model Articles of Association (UK Companies)',
    seo_description:
      'Model articles for private companies limited by shares: what they cover, when to customise, and Companies House defaults explained.',
  },
};

let updated = 0;
for (const [file, fields] of Object.entries(updates)) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.warn('Missing file:', file);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  const before = content;

  if (fields.title) {
    content = content.replace(/^title:\s*"[^"]*"/m, `title: "${fields.title.replace(/"/g, '\\"')}"`);
  }
  if (/^seo_title:/m.test(content)) {
    content = content.replace(/^seo_title:\s*"[^"]*"/m, `seo_title: "${fields.seo_title.replace(/"/g, '\\"')}"`);
  } else {
    content = content.replace(/^---\r?\n/, `---\nseo_title: "${fields.seo_title.replace(/"/g, '\\"')}"\n`);
  }
  if (/^seo_description:/m.test(content)) {
    content = content.replace(
      /^seo_description:\s*"[^"]*"/m,
      `seo_description: "${fields.seo_description.replace(/"/g, '\\"')}"`,
    );
  } else {
    content = content.replace(
      /^seo_title:\s*"[^"]*"\r?\n/m,
      (m) => `${m}seo_description: "${fields.seo_description.replace(/"/g, '\\"')}"\n`,
    );
  }

  if (content !== before) {
    fs.writeFileSync(filePath, content, 'utf8');
    updated++;
    console.log('Updated', file);
  }
}

console.log(`Done. Updated ${updated} posts.`);
