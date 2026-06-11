// Dev helper: set a known password on the seeded test accounts so the app
// can be driven manually. Run: node scripts/set-test-passwords.js
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { supabaseAdmin } = require('../src/config/supabase');

const ACCOUNTS = [
  { id: '075fbf3b-b6ce-4178-9c00-f391efa3acc8', email: 'teststu@internbeacon.dev' },
  { id: 'e7ea1313-5bb1-4eb9-b80f-74f64602b0cb', email: 'testco@internbeacon.dev' },
];

(async () => {
  for (const a of ACCOUNTS) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(a.id, {
      password: 'InternBeacon!Dev1',
    });
    console.log(a.email, error ? `FAILED: ${error.message}` : 'OK');
  }
})();
