import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html, attachments }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.verify(); // 🔥 This will throw error if config wrong

  await transporter.sendMail({
    from: `"Ryvive Roots" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments,
  });
};

export default sendEmail;
