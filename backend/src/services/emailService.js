const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@internbeacon.com',
      to,
      subject,
      html,
    });
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (to, name) => {
  const subject = 'Welcome to InternBeacon!';
  const html = `
    <h1>Welcome, ${name}!</h1>
    <p>Thank you for joining InternBeacon. We're excited to help you find your dream internship!</p>
    <p>Get started by updating your profile and browsing available opportunities.</p>
    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard">Go to Dashboard</a>
  `;
  return await sendEmail(to, subject, html);
};

const sendApplicationSubmittedEmail = async (to, studentName, offerTitle, companyName) => {
  const subject = 'Application Submitted Successfully';
  const html = `
    <h1>Application Submitted</h1>
    <p>Hi ${studentName},</p>
    <p>Your application for <strong>${offerTitle}</strong> at <strong>${companyName}</strong> has been submitted successfully.</p>
    <p>You can track the status of your application in your dashboard.</p>
    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard">View Applications</a>
  `;
  return await sendEmail(to, subject, html);
};

const sendApplicationStatusUpdateEmail = async (to, studentName, offerTitle, status) => {
  const subject = `Application Status Update: ${status}`;
  const html = `
    <h1>Application Update</h1>
    <p>Hi ${studentName},</p>
    <p>Your application for <strong>${offerTitle}</strong> has been updated to: <strong>${status}</strong>.</p>
    <p>Check your dashboard for more details.</p>
    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard">View Applications</a>
  `;
  return await sendEmail(to, subject, html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendApplicationSubmittedEmail,
  sendApplicationStatusUpdateEmail,
};