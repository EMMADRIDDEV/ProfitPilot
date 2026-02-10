/**
 * Test Access Code Generator for ProfitPilot
 * 
 * This script generates random 8-character alphanumeric access codes
 * Run: node scripts/generateTestCode.js
 */

const crypto = require('crypto');

function generateAccessCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  for (let i = 0; i < 8; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    code += characters[randomIndex];
  }
  
  return code;
}

// Generate 5 test codes
console.log('═══════════════════════════════════════════════════════════');
console.log('         ProfitPilot - Test Access Code Generator');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('Generated Test Access Codes:\n');

const codes = [];
for (let i = 0; i < 5; i++) {
  const code = generateAccessCode();
  codes.push(code);
  console.log(`  ${i + 1}. ${code}`);
}

console.log('\n═══════════════════════════════════════════════════════════');
console.log('Instructions:');
console.log('1. Copy any of the codes above');
console.log('2. Go to http://localhost:3000/login');
console.log('3. Paste the code in the "Access Code" field');
console.log('4. Click "Login"');
console.log('5. You will be taken to the business setup page');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('SQL Insert Statement (for manual database entry):\n');

codes.forEach((code, index) => {
  console.log(`INSERT INTO access_codes (code, is_active, created_at) VALUES ('${code}', true, NOW());`);
});

console.log('\n');
