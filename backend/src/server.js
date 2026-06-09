require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled rejection:', reason);
  process.exit(1);
});

const http = require('http');
const app  = require('./app');

const PORT   = process.env.PORT || 5000;
const server = http.createServer(app);

const { initSocket }       = require('./socket');
const { startExpiryJob }   = require('./utils/expiry');
const { getActiveProviders } = require('./utils/aiProvider');
initSocket(server);

server.listen(PORT, () => {
  const aiProviders = getActiveProviders();
  console.log(`\n  InternBeacon API`);
  console.log(`  ─────────────────────────────────────`);
  console.log(`  Running on  : http://localhost:${PORT}`);
  console.log(`  Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Auth routes : http://localhost:${PORT}/api/auth`);
  console.log(`  Health      : http://localhost:${PORT}/api/health`);
  console.log(`  AI providers: ${aiProviders.length ? aiProviders.join(' → ') : 'none configured'}\n`);

  startExpiryJob();
});
