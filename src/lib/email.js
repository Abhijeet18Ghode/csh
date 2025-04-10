import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"AlumNet" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to AlumNet!',
    text: `Welcome ${name} to AlumNet! We're excited to have you on board.`,
    html: `
      <h1>Welcome to AlumNet!</h1>
      <p>Dear ${name},</p>
      <p>Welcome to AlumNet! We're excited to have you on board.</p>
      <p>Start exploring the platform and connect with your peers!</p>
    `,
  }),
  mentorshipRequest: (mentorName, studentName) => ({
    subject: 'New Mentorship Request',
    text: `${studentName} has requested mentorship from you.`,
    html: `
      <h1>New Mentorship Request</h1>
      <p>Dear ${mentorName},</p>
      <p>${studentName} has requested mentorship from you.</p>
      <p>Please log in to your account to review and respond to this request.</p>
    `,
  }),
  eventReminder: (eventName, date) => ({
    subject: 'Event Reminder',
    text: `Reminder: ${eventName} is scheduled for ${date}.`,
    html: `
      <h1>Event Reminder</h1>
      <p>The event "${eventName}" is scheduled for ${date}.</p>
      <p>We look forward to seeing you there!</p>
    `,
  }),
}; 