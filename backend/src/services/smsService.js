const AfricasTalking = require('africastalking');
const credentials = {
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME || 'internbeacon',
};
const africasTalking = AfricasTalking(credentials);
const sms = africasTalking.SMS;

const sendSMS = async (to, message) => {
  try {
    const options = {
      to,
      message,
    };
    const response = await sms.send(options);
    return { success: true, data: response };
  } catch (error) {
    console.error('SMS send error:', error);
    return { success: false, error: error.message };
  }
};

const sendWelcomeSMS = async (to, name) => {
  const message = `Welcome to InternBeacon, ${name}! Start your internship journey today. Visit ${process.env.FRONTEND_URL || 'http://localhost:3000'}`;
  return await sendSMS(to, message);
};

const sendApplicationSubmittedSMS = async (to, offerTitle) => {
  const message = `Your application for ${offerTitle} has been submitted. Track status in your dashboard.`;
  return await sendSMS(to, message);
};

const sendApplicationStatusUpdateSMS = async (to, offerTitle, status) => {
  const message = `Application update for ${offerTitle}: ${status}. Check dashboard for details.`;
  return await sendSMS(to, message);
};

module.exports = {
  sendSMS,
  sendWelcomeSMS,
  sendApplicationSubmittedSMS,
  sendApplicationStatusUpdateSMS,
};