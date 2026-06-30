const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST || 'smtp.gmail.com',
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

async function sendMail({ to, subject, html }) {
  const t = getTransporter();
  if (!t) return;
  try {
    await t.sendMail({
      from: `"InternBeacon" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.warn('[MAILER] Failed to send email:', err.message, '| to:', to, '| code:', err.code);
  }
}

// ── Shared layout wrapper ──────────────────────────────────────────────────────
function wrap(body) {
  return `<!DOCTYPE html><html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
        <tr><td style="background:#1a1a1a;border-radius:16px 16px 0 0;padding:28px 40px;border-bottom:1px solid rgba(255,255,255,0.06)">
          <span style="font-size:20px;font-weight:900;color:#84cc16;letter-spacing:-0.5px">InternBeacon</span>
        </td></tr>
        <tr><td style="background:#1a1a1a;padding:40px">${body}</td></tr>
        <tr><td style="background:#141414;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center">
          <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0">InternBeacon &middot; ICT University, Cameroon</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function btn(href, label) {
  return `<a href="${href}" style="display:inline-block;background:#84cc16;color:#000;text-decoration:none;font-weight:700;font-size:14px;padding:14px 28px;border-radius:10px;margin-top:8px">${label} &rarr;</a>`;
}

function card(rows) {
  const inner = rows.map(([label, value]) =>
    `<p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.06em">${label}</p>
     <p style="color:#fff;font-size:15px;font-weight:600;margin:0 0 14px">${value}</p>`
  ).join('');
  return `<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:24px">${inner}</div>`;
}

// ── Email templates ────────────────────────────────────────────────────────────

function statusUpdateEmail({ studentName, offerTitle, status, companyNote }) {
  const MAP = {
    under_review:         { emoji: '👀', headline: 'Your application is under review', color: '#3b82f6', msg: 'Good news — the recruitment team has started reviewing your application.' },
    shortlisted:          { emoji: '⭐', headline: 'You\'ve been shortlisted!',        color: '#a855f7', msg: 'Excellent news! You\'ve been shortlisted for this position. The company was impressed with your profile.' },
    interview_completed:  { emoji: '🤝', headline: 'Interview completed',              color: '#8b5cf6', msg: 'Your interview has been marked as completed. The team will now deliberate and get back to you soon.' },
    final_review:         { emoji: '🔍', headline: 'You\'re in final review!',         color: '#f97316', msg: 'You\'ve made it to the final review stage. The company is making their final decision.' },
    accepted:             { emoji: '🎉', headline: 'You got the internship!',          color: '#84cc16', msg: 'Congratulations! Your application has been accepted. Welcome aboard!' },
    rejected:             { emoji: '📋', headline: 'Application decision',             color: '#6b7280', msg: 'The company has reviewed your application and decided to move forward with other candidates. Keep applying — more opportunities are waiting for you!' },
    // legacy
    reviewing: { emoji: '👀', headline: 'Your application is being reviewed!', color: '#3b82f6', msg: 'Good news — a company has started reviewing your application.' },
    pending:   { emoji: '🔄', headline: 'Application status updated',          color: '#f59e0b', msg: 'Your application status has been updated.' },
  };
  const s = MAP[status] || MAP.pending;
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const noteBlock = companyNote
    ? `<div style="background:rgba(132,204,22,0.06);border:1px solid rgba(132,204,22,0.2);border-radius:12px;padding:16px;margin-bottom:24px">
        <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.06em">Note from the company</p>
        <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.6;margin:0">${companyNote}</p>
       </div>`
    : '';

  return wrap(`
    <p style="font-size:36px;margin:0 0 16px">${s.emoji}</p>
    <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 12px">${s.headline}</h1>
    <p style="color:rgba(255,255,255,0.5);font-size:15px;line-height:1.6;margin:0 0 24px">
      Hi ${studentName},<br><br>${s.msg}
    </p>
    ${card([['Position', offerTitle], ['Status', `<span style="background:${s.color}22;color:${s.color};border:1px solid ${s.color}44;border-radius:6px;padding:3px 10px;font-size:12px;font-weight:600;text-transform:capitalize">${status}</span>`]])}
    ${noteBlock}
    ${btn(`${clientUrl}/student/applications`, 'View My Applications')}
  `);
}

function newApplicationEmail({ companyName, studentName, offerTitle, applicationId }) {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  return wrap(`
    <p style="font-size:36px;margin:0 0 16px">📬</p>
    <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 12px">New Application Received</h1>
    <p style="color:rgba(255,255,255,0.5);font-size:15px;line-height:1.6;margin:0 0 24px">
      Hi ${companyName},<br><br>A student just applied for one of your internship positions on InternBeacon.
    </p>
    ${card([['Applicant', studentName], ['Position', offerTitle]])}
    ${btn(`${clientUrl}/company/applications/${applicationId}`, 'Review Application')}
  `);
}

function offerExpiredEmail({ companyName, offerTitle }) {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  return wrap(`
    <p style="font-size:36px;margin:0 0 16px">⏰</p>
    <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 12px">Offer Deadline Reached</h1>
    <p style="color:rgba(255,255,255,0.5);font-size:15px;line-height:1.6;margin:0 0 24px">
      Hi ${companyName},<br><br>The application deadline for your internship offer has passed. The offer has been automatically closed.
    </p>
    ${card([['Offer', offerTitle]])}
    ${btn(`${clientUrl}/company/offers`, 'View My Offers')}
  `);
}

function interviewEmail({ studentName, offerTitle, interviewDate, interviewType, interviewLocation, interviewLink, interviewNotes }) {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const typeLabels = { in_person: 'In Person', google_meet: 'Google Meet', zoom: 'Zoom', teams: 'Microsoft Teams', phone: 'Phone Call', in_app_video: 'InternBeacon Video Call' };
  const typeLabel  = typeLabels[interviewType] || interviewType || 'TBD';

  const dateStr = interviewDate
    ? new Date(interviewDate).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })
    : 'To be confirmed';

  const locationBlock = interviewType === 'in_person' && interviewLocation
    ? `<p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.06em">Location</p>
       <p style="color:#fff;font-size:15px;font-weight:600;margin:0 0 14px">${interviewLocation}</p>`
    : '';

  const linkBlock = interviewLink
    ? `<p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.06em">Meeting Link</p>
       <p style="margin:0 0 14px"><a href="${interviewLink}" style="color:#84cc16;font-size:14px;font-weight:600">${interviewLink}</a></p>`
    : '';

  const notesBlock = interviewNotes
    ? `<div style="background:rgba(132,204,22,0.06);border:1px solid rgba(132,204,22,0.2);border-radius:12px;padding:16px;margin-bottom:24px">
        <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.06em">Instructions from the company</p>
        <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.6;margin:0">${interviewNotes}</p>
       </div>`
    : '';

  return wrap(`
    <p style="font-size:36px;margin:0 0 16px">📅</p>
    <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 12px">Interview Scheduled!</h1>
    <p style="color:rgba(255,255,255,0.5);font-size:15px;line-height:1.6;margin:0 0 24px">
      Hi ${studentName},<br><br>Great news — an interview has been scheduled for your application!
    </p>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:24px">
      <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.06em">Position</p>
      <p style="color:#fff;font-size:15px;font-weight:600;margin:0 0 14px">${offerTitle}</p>
      <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.06em">Date &amp; Time</p>
      <p style="color:#fff;font-size:15px;font-weight:600;margin:0 0 14px">${dateStr}</p>
      <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.06em">Interview Format</p>
      <p style="color:#fff;font-size:15px;font-weight:600;margin:0 0 14px">${typeLabel}</p>
      ${locationBlock}
      ${linkBlock}
    </div>
    ${notesBlock}
    ${btn(`${clientUrl}/student/applications`, 'View My Applications')}
  `);
}

function offerResponseEmail({ studentName, offerTitle, accepted, applicationId }) {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  return wrap(`
    <p style="font-size:36px;margin:0 0 16px">${accepted ? '🎉' : '↩'}</p>
    <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 12px">
      Offer ${accepted ? 'Accepted' : 'Declined'}
    </h1>
    <p style="color:rgba(255,255,255,0.5);font-size:15px;line-height:1.6;margin:0 0 24px">
      ${accepted
        ? `<strong style="color:#84cc16">${studentName}</strong> has accepted your offer. The position is now confirmed.`
        : `<strong style="color:rgba(255,255,255,0.8)">${studentName}</strong> has declined the offer. You may want to consider other shortlisted candidates.`
      }
    </p>
    ${card([['Position', offerTitle], ['Candidate', studentName]])}
    ${btn(`${clientUrl}/company/applications/${applicationId}`, 'View Application')}
  `);
}

module.exports = { sendMail, statusUpdateEmail, newApplicationEmail, offerExpiredEmail, interviewEmail, offerResponseEmail };
