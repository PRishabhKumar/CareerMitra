import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log("[EmailService] EMAIL_USER:", process.env.EMAIL_USER);
console.log("[EmailService] EMAIL_PASS length:", process.env.EMAIL_PASS?.length, "| value:", process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  pool: true,
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  maxConnections: 5,
  maxMessages: 100,
});

export const sendResetPasswordEmail = async (toEmail, resetUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "CareerMitra - Password Reset Request",
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your CareerMitra account.</p>
      <p>Click the link below to set a new password. This link is valid for 1 hour.</p>
      <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#6366f1;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to " + toEmail);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Could not send email.");
  }
};
