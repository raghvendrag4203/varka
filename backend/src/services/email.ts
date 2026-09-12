import { BrevoClient } from "@getbrevo/brevo"
import config from "../config/index.js"

const { brevoApiKey, senderEmail, senderName} = config 
type state = "alert" | "otp"

// Pre-designed HTML templates with {{MSG}} placeholder
const TEMPLATES: Record<state, string> = {
  otp: `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-top: 0; text-align: center;">Security Verification</h2>
      <p style="color: #475569; font-size: 15px; line-height: 1.5; text-align: center;">Use the verification code below to complete your authentication:</p>
      <div style="background-color: #f1f5f9; border-radius: 6px; padding: 16px; margin: 24px 0; text-align: center;">
        <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2563eb;">{{MSG}}</span>
      </div>
      <p style="color: #64748b; font-size: 13px; line-height: 1.4; text-align: center; margin-bottom: 0;">This code is valid for 10 minutes. For security, do not share this code with anyone.</p>
    </div>
  `,
  alert: `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #fee2e2; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #dc2626; margin-top: 0;">Security Alert</h2>
      <p style="color: #334155; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">{{MSG}}</p>
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
      <p style="color: #64748b; font-size: 12px; line-height: 1.4; margin-bottom: 0;">If you did not perform this action, please log in to your account and update your password immediately.</p>
    </div>
  `
};

const brevo = new BrevoClient({
    apiKey: brevoApiKey
})

const sendEmail = async (toEmail: string, msg: string, s: state) => {
  try {
    const rawTemplate = TEMPLATES[s];
    const finalHtml = rawTemplate.replace("{{MSG}}", msg);
    const subject = s === "otp" ? "Your Verification Code" : "Security Alert Notification";

    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [{ email: toEmail }],
      subject: subject,
      htmlContent: finalHtml,
    });

    console.log(`Email [${s}] successfully sent to ${toEmail}. Message ID: ${response.messageId}`);
    return { success: true, messageId: response.messageId };
  } catch (error: any) {
    console.error(`Failed to send ${s} email:`, error.response?.body || error.message);
    return { success: false, error };
  }
};

export default sendEmail;