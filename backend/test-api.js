const http = require('http');

function req(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost', port: 5000, path: '/api' + path,
      method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }
    };
    const r = http.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, body: d }); }
      });
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

async function run() {
  let pass = 0, fail = 0;
  const log = (label, ok, detail) => {
    console.log((ok ? '✓' : '✗') + ' ' + label + (detail ? ' — ' + detail : ''));
    ok ? pass++ : fail++;
  };

  // Register test accounts
  const rs = await req('POST', '/auth/register', {
    email: 'teststu@internbeacon.dev', password: 'Test1234!',
    role: 'student', firstName: 'Test', lastName: 'Student',
    university: 'ICT University', programme: 'BSc IT', studyYear: 3
  });
  log('Register student', rs.status === 201 || rs.status === 409, rs.status === 409 ? 'already exists' : JSON.stringify(rs.body).slice(0, 80));

  const rc = await req('POST', '/auth/register', {
    email: 'testco@internbeacon.dev', password: 'Test1234!',
    role: 'company', companyName: 'TestCo Ltd', sector: 'IT', city: 'Yaounde'
  });
  log('Register company', rc.status === 201 || rc.status === 409, rc.status === 409 ? 'already exists' : JSON.stringify(rc.body).slice(0, 80));

  // Login
  const ls = await req('POST', '/auth/login', { email: 'teststu@internbeacon.dev', password: 'Test1234!' });
  const sToken = ls.body.accessToken;
  log('Login student', ls.status === 200 && !!sToken, 'role=' + ls.body.role);

  const lc = await req('POST', '/auth/login', { email: 'testco@internbeacon.dev', password: 'Test1234!' });
  const cToken = lc.body.accessToken;
  log('Login company', lc.status === 200 && !!cToken, 'role=' + lc.body.role);

  if (!sToken || !cToken) {
    console.log('\nFATAL: Cannot continue without both tokens');
    console.log('Student login response:', JSON.stringify(ls.body).slice(0, 200));
    console.log('Company login response:', JSON.stringify(lc.body).slice(0, 200));
    return;
  }

  // Auth/me
  const me = await req('GET', '/auth/me', null, sToken);
  log('GET /auth/me', me.status === 200 && me.body.data?.role === 'student', 'role=' + me.body.data?.role);

  // Auth guard (no token)
  const guard = await req('GET', '/offers/my');
  log('Auth guard (no token -> 401)', guard.status === 401, 'status=' + guard.status);

  // Role guard (student tries company endpoint)
  const roleGuard = await req('GET', '/offers/my', null, sToken);
  log('Role guard (student -> 403)', roleGuard.status === 403, 'status=' + roleGuard.status);

  // Public offers list
  const pOffers = await req('GET', '/offers?limit=5');
  log('GET /offers public', pOffers.status === 200 && Array.isArray(pOffers.body.data), 'count=' + pOffers.body.data?.length);

  // Company: GET /offers/my
  const myOffers = await req('GET', '/offers/my', null, cToken);
  log('GET /offers/my (company)', myOffers.status === 200 && Array.isArray(myOffers.body.data), 'count=' + myOffers.body.data?.length);

  // Update profiles
  const profUp = await req('PATCH', '/profiles/student', { bio: 'Automated test bio', skills: ['React', 'Node.js'] }, sToken);
  log('PATCH /profiles/student', profUp.status === 200, profUp.status !== 200 ? JSON.stringify(profUp.body).slice(0, 100) : '');

  const cpUp = await req('PATCH', '/profiles/company', { description: 'Test company description' }, cToken);
  log('PATCH /profiles/company', cpUp.status === 200, cpUp.status !== 200 ? JSON.stringify(cpUp.body).slice(0, 100) : '');

  // Company: POST offer
  const deadline = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
  const newOffer = await req('POST', '/offers', {
    title: 'Test Dev Intern', domain: 'IT',
    description: 'A test internship for automated testing purposes.',
    location: 'Yaounde', durationWeeks: 8, deadline
  }, cToken);
  const offerId = newOffer.body.data?.id;
  log('POST /offers', newOffer.status === 201 && !!offerId, offerId ? 'id=' + offerId : JSON.stringify(newOffer.body).slice(0, 100));

  if (offerId) {
    // Student: apply
    const apply = await req('POST', '/applications', { offerId, coverLetter: 'Automated test application cover letter.' }, sToken);
    const appId = apply.body.data?.id;
    log('POST /applications', apply.status === 201 && !!appId, appId ? 'id=' + appId : JSON.stringify(apply.body).slice(0, 100));

    // Student: my applications
    const myApps = await req('GET', '/applications/my', null, sToken);
    log('GET /applications/my', myApps.status === 200 && Array.isArray(myApps.body.data), 'count=' + myApps.body.data?.length);

    // Bookmark offer
    const bm = await req('POST', '/offers/' + offerId + '/bookmark', null, sToken);
    log('POST /offers/:id/bookmark', bm.status === 201 || bm.status === 200 || bm.status === 409, 'status=' + bm.status);

    // Get bookmarks
    const bms = await req('GET', '/offers/bookmarks', null, sToken);
    log('GET /offers/bookmarks', bms.status === 200 && Array.isArray(bms.body.data), 'count=' + bms.body.data?.length);

    // Company: all applications
    const compApps = await req('GET', '/applications/company', null, cToken);
    log('GET /applications/company', compApps.status === 200 && Array.isArray(compApps.body.data), 'count=' + compApps.body.data?.length);

    // Company: offer applications
    const offerApps = await req('GET', '/applications/offer/' + offerId, null, cToken);
    log('GET /applications/offer/:id', offerApps.status === 200 && Array.isArray(offerApps.body.data), 'count=' + offerApps.body.data?.length);

    if (appId) {
      // Get single application (company)
      const oneApp = await req('GET', '/applications/' + appId, null, cToken);
      log('GET /applications/:id (company)', oneApp.status === 200 && oneApp.body.data?.id === appId,
        oneApp.status !== 200 ? JSON.stringify(oneApp.body).slice(0, 100) : 'offer=' + oneApp.body.data?.offer?.title);

      // Get single application (student)
      const oneAppS = await req('GET', '/applications/' + appId, null, sToken);
      log('GET /applications/:id (student)', oneAppS.status === 200 && oneAppS.body.data?.id === appId);

      // Company: update status
      const updStatus = await req('PATCH', '/applications/' + appId + '/status', { status: 'reviewing' }, cToken);
      log('PATCH /applications/:id/status', updStatus.status === 200 && updStatus.body.data?.status === 'reviewing',
        'status=' + updStatus.body.data?.status);

      // Messages: send (company to student)
      const sendMsg = await req('POST', '/messages/app/' + appId, { content: 'Hello from test company!' }, cToken);
      log('POST /messages/app/:appId', sendMsg.status === 201 && !!sendMsg.body.data?.id,
        sendMsg.status !== 201 ? JSON.stringify(sendMsg.body).slice(0, 100) : '');

      // Messages: get thread (student)
      const thread = await req('GET', '/messages/app/' + appId, null, sToken);
      log('GET /messages/app/:appId', thread.status === 200 && Array.isArray(thread.body.data), 'count=' + thread.body.data?.length);

      // Messages: threads list
      const threads = await req('GET', '/messages/threads', null, sToken);
      log('GET /messages/threads', threads.status === 200 && Array.isArray(threads.body.data), 'count=' + threads.body.data?.length);

      // Unread count
      const unread = await req('GET', '/messages/unread-count', null, sToken);
      log('GET /messages/unread-count', unread.status === 200 && 'unreadCount' in (unread.body.data || {}),
        'count=' + unread.body.data?.unreadCount);
    }
  }

  // Notifications
  const notifCount = await req('GET', '/notifications/unread-count', null, sToken);
  log('GET /notifications/unread-count', notifCount.status === 200 && 'unreadCount' in (notifCount.body.data || {}),
    'count=' + notifCount.body.data?.unreadCount);

  const notifList = await req('GET', '/notifications', null, sToken);
  log('GET /notifications list', notifList.status === 200 && Array.isArray(notifList.body.data),
    'count=' + notifList.body.data?.length);

  // Admin guard
  const adminGuard = await req('GET', '/admin/stats', null, cToken);
  log('Admin guard (company -> 403)', adminGuard.status === 403, 'status=' + adminGuard.status);

  // Health
  const health = await req('GET', '/health');
  log('GET /health', health.status === 200 && health.body.success === true);

  console.log('\n' + pass + '/' + (pass + fail) + ' tests passed' + (fail > 0 ? ' — ' + fail + ' failed' : ' ✓'));
}

run().catch(e => console.error('Fatal:', e.message, e.stack));
