require('dotenv').config();

const required = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`[ENV] Missing required environment variables: ${missing.join(', ')}`);
  console.error('[ENV] Copy .env.example to .env and fill in the values.');
  process.exit(1);
}

// Warn (not crash) for optional vars — app starts but affected features won't work
const optional = {
  CLIENT_URL:        'CORS will use localhost fallback — set this in production',
  ANTHROPIC_API_KEY: 'AI CV parsing will return 503',
  SMTP_USER:         'Email notifications will be silently skipped',
  SMTP_PASS:         'Email notifications will be silently skipped',
};

for (const [key, hint] of Object.entries(optional)) {
  if (!process.env[key]) console.warn(`[ENV] ${key} not set — ${hint}`);
}

module.exports = {
  port:      Number(process.env.PORT) || 5000,
  nodeEnv:   process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
