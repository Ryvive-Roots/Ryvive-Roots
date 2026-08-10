import nodemailer from "nodemailer";

const sendEmail = async ({
  to,
  subject,
  html,
  attachments = [],
  supportEmail = false,
  notifyCompany = true,
}) => {
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

    // =====================================================
    // 1. SEND EMAIL TO RECIPIENT
    // =====================================================

    await transporter.sendMail({
      from: `"Ryvive Roots" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });

    console.log(`✅ Email sent to: ${to}`);

    // =====================================================
    // 2. OPTIONAL COMPANY NOTIFICATION
    // =====================================================

    if (
      notifyCompany &&
      process.env.COMPANY_EMAIL
    ) {
      const notificationEmail =
        supportEmail
          ? process.env.COMPANY_EMAIL_2
          : process.env.COMPANY_EMAIL;

      if (notificationEmail) {
        await transporter.sendMail({
          from: `"Ryvive Roots" <${process.env.EMAIL_USER}>`,

          to: notificationEmail,

          subject: supportEmail
            ? `🎫 Support Ticket Email - ${subject}`
            : `📩 New email sent to customer`,

          html: `
            <div style="
              font-family: Arial, sans-serif;
              max-width: 700px;
              margin: auto;
              color: #333;
              line-height: 1.6;
            ">

              <h2>
                ${
                  supportEmail
                    ? "🎫 Customer Support Notification"
                    : "📩 Customer Email Notification"
                }
              </h2>

              <p>
                <strong>Customer Email:</strong>
                ${to}
              </p>

              <p>
                <strong>Subject:</strong>
                ${subject}
              </p>

              <hr />

              <p>
                <strong>Message:</strong>
              </p>

              <div>
                ${html}
              </div>

            </div>
          `,
        });

        console.log(
          `✅ Company notification sent to: ${notificationEmail}`
        );
      }
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "❌ Email Error:",
      error
    );

    throw error;
  }
};

export default sendEmail;