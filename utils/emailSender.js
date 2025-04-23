const nodemailer = require("nodemailer");
const fs = require("fs").promises;
const path = require("path");

const sendEmail = async ({ to, subject, loginLink }) => {
  try {
    // 1. Load the HTML template
    const templatePath = path.join(__dirname, "../emails/approvalEmail.html");
    let htmlContent = await fs.readFile(templatePath, "utf-8");

    // 2. Replace placeholders
    htmlContent = htmlContent.replace("{{loginLink}}", loginLink);

    // 3. Setup transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    // 4. Email options
    const mailOptions = {
      from: `"FilterFrame" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html: htmlContent,
    };

    // 5. Send Email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};

module.exports = { sendEmail };
