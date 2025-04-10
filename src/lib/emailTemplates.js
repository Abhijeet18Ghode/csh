export const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to Career Switching Hub!',
    text: `Hi ${name},\n\nWelcome to Career Switching Hub! We're excited to have you join our community of career switchers and mentors.\n\nYour account has been created successfully. Please verify your email address to get started.\n\nBest regards,\nThe Career Switching Hub Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Welcome to Career Switching Hub!</h2>
        <p>Hi ${name},</p>
        <p>Welcome to Career Switching Hub! We're excited to have you join our community of career switchers and mentors.</p>
        <p>Your account has been created successfully. Please verify your email address to get started.</p>
        <p>Best regards,<br>The Career Switching Hub Team</p>
      </div>
    `,
  }),
  verification: (name, token) => ({
    subject: 'Verify your email address',
    text: `Hi ${name},\n\nPlease verify your email address by clicking the following link:\n\n${process.env.NEXTAUTH_URL}/auth/verify?token=${token}\n\nThis link will expire in 24 hours.\n\nBest regards,\nThe Career Switching Hub Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Verify your email address</h2>
        <p>Hi ${name},</p>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${process.env.NEXTAUTH_URL}/auth/verify?token=${token}" 
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Verify Email
        </a>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The Career Switching Hub Team</p>
      </div>
    `,
  }),
  passwordReset: (name, token) => ({
    subject: 'Reset your password',
    text: `Hi ${name},\n\nYou requested to reset your password. Click the following link to set a new password:\n\n${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe Career Switching Hub Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Reset your password</h2>
        <p>Hi ${name},</p>
        <p>You requested to reset your password. Click the button below to set a new password:</p>
        <a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}" 
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Career Switching Hub Team</p>
      </div>
    `,
  }),
}; 