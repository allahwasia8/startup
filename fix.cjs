const fs = require('fs');

const path1 = 'd:/Startup/src/content/blog/benefits-are-changing-universal.md';
let lines1 = fs.readFileSync(path1, 'utf8').split('\n');
lines1 = lines1.slice(0, 185);
lines1.push('');
lines1.push('<p>Before making a voluntary claim, use an up-to-date benefits calculator and, if possible, speak to an independent adviser such as Citizens Advice or a local welfare rights service. Once you move to universal credit, you generally cannot return to legacy benefits, even if you receive less money overall. If you are being moved through the managed migration process and your new universal credit entitlement is lower, transitional protection should top up your award - but only if you claim by the deadline on your migration notice. If you are a severely disabled person or receive the severe disability premium, getting advice before you move is especially important.</p>');
fs.writeFileSync(path1, lines1.join('\n'));

const path2 = 'd:/Startup/src/content/blog/limited-guarantee-company-meaning.md';
let lines2 = fs.readFileSync(path2, 'utf8').split('\n');
lines2 = lines2.slice(0, 77);
lines2.push('');
lines2.push('<p>Detailed guidance is available from Companies House, including model articles and step-by-step registration notes. The charity commission (England and Wales), OSCR (Scotland), and CCNI (northern ireland) publish guidance on using a company limited by guarantee as a charitable structure. Prospective founders may also want to consult a solicitor, accountant, or specialist formation agent for tailored advice on their specific organisation. For further information on money, liability, and compliance, these are authoritative starting points.</p>');
fs.writeFileSync(path2, lines2.join('\n'));
