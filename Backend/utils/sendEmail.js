const nodemailer = require('nodemailer');

/**
 * Create reusable SMTP transporter
 * Uses Gmail SMTP by default — requires an App Password (not your regular password).
 * Set SMTP_EMAIL and SMTP_PASSWORD in your .env file.
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });
};

/**
 * Send welcome email with credentials when admin creates a new user.
 * @param {Object} options - { email, name, userId, password, role }
 */
const sendWelcomeEmail = async ({ email, name, userId, password, role }) => {
    const transporter = createTransporter();

    const rolePretty = role === 'teamleader' ? 'Team Leader' : 'Developer';
    const loginUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const mailOptions = {
        from: `"AXIS Platform" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: `Welcome to AXIS – Your ${rolePretty} Account is Ready`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#F4F5F7;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F5F7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#007BFF 0%,#4DA3FF 100%);padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.02em;">AXIS</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:12px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">Enterprise Project Management</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;font-size:20px;color:#212529;">Welcome aboard, ${name}! 🎉</h2>
              <p style="margin:0 0 24px;color:#6C757D;font-size:15px;line-height:1.6;">
                Your <strong>${rolePretty}</strong> account has been created by the administrator. Use the credentials below to access your workspace.
              </p>

              <!-- Credentials Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F9FC;border:1px solid #E9ECEF;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#868E96;font-weight:700;">User ID</span>
                          <span style="display:block;font-size:18px;font-weight:800;color:#212529;letter-spacing:0.02em;margin-top:4px;">${userId}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-top:1px solid #E9ECEF;">
                          <span style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#868E96;font-weight:700;">Password</span>
                          <span style="display:block;font-size:18px;font-weight:800;color:#212529;font-family:monospace;margin-top:4px;">${password}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-top:1px solid #E9ECEF;">
                          <span style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#868E96;font-weight:700;">Role</span>
                          <span style="display:block;font-size:14px;font-weight:700;color:#007BFF;margin-top:4px;">${rolePretty}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="${loginUrl}/login" style="display:inline-block;padding:14px 32px;background:#007BFF;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;box-shadow:0 4px 12px rgba(0,123,255,0.3);">
                      Login to AXIS →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <div style="background:#FFF3CD;border:1px solid #FFE380;border-radius:8px;padding:16px;margin-bottom:16px;">
                <p style="margin:0;font-size:13px;color:#856404;line-height:1.5;">
                  <strong>⚠️ Important:</strong> Please change your password after your first login for security. You can use the "Forgot Password" link on the login page.
                </p>
              </div>

              <p style="margin:0;color:#ADB5BD;font-size:13px;line-height:1.5;">
                If you didn't expect this email, please contact your system administrator.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background:#F8F9FC;border-top:1px solid #E9ECEF;">
              <p style="margin:0;font-size:12px;color:#ADB5BD;text-align:center;">
                © ${new Date().getFullYear()} AXIS Intelligence Systems. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
    };

    await transporter.sendMail(mailOptions);
};

/**
 * Send password-reset email with a token link.
 * @param {Object} options - { email, name, resetUrl }
 */
const sendPasswordResetEmail = async ({ email, name, resetUrl }) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"AXIS Platform" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'AXIS – Password Reset Request',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#F4F5F7;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F5F7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#007BFF 0%,#4DA3FF 100%);padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;">AXIS</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:12px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">Password Reset</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;font-size:20px;color:#212529;">Reset your password</h2>
              <p style="margin:0 0 24px;color:#6C757D;font-size:15px;line-height:1.6;">
                Hi <strong>${name}</strong>, we received a request to reset your AXIS account password. Click the button below to set a new password.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;background:#007BFF;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;box-shadow:0 4px 12px rgba(0,123,255,0.3);">
                      Reset Password →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;color:#6C757D;font-size:13px;line-height:1.5;">
                This link will expire in <strong>30 minutes</strong>. If you didn't request a password reset, you can safely ignore this email.
              </p>

              <div style="background:#F8F9FC;border:1px solid #E9ECEF;border-radius:8px;padding:16px;">
                <p style="margin:0;font-size:12px;color:#ADB5BD;word-break:break-all;">
                  Reset link: ${resetUrl}
                </p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background:#F8F9FC;border-top:1px solid #E9ECEF;">
              <p style="margin:0;font-size:12px;color:#ADB5BD;text-align:center;">
                © ${new Date().getFullYear()} AXIS Intelligence Systems. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail, sendPasswordResetEmail };
