import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html, attachments }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    // ✅ 1. Send email to customer
    await transporter.sendMail({
      from: `"Ryvive Roots" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });

    // ✅ 2. Notify company
    await transporter.sendMail({
      from: `"Ryvive Roots" <${process.env.EMAIL_USER}>`,
      to: process.env.COMPANY_EMAIL,
      subject: `📩 New email sent to customer`,
      html: `
        <h2>Customer Email Notification</h2>
        <p><strong>To:</strong> ${to}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr/>
        <p><strong>Message Preview:</strong></p>
        <div>${html}</div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};

export default sendEmail;