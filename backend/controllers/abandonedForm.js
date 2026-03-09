export const abandonedForm = async (req, res) => {
  try {
    const { email, phone, firstName } = req.body;

    if (!email && !phone) {
      return res.status(200).json({ message: "No contact info" });
    }

    // Send reminder email
    if (email) {
      await sendEmail({
        to: email,
        subject: "Complete Your Subscription – Ryvive Roots",
        html: `
        <div style="font-family: Arial; line-height:1.6">
          <h2>Hi ${firstName || ""},</h2>

          <p>
          We noticed you started filling your Ryvive Roots subscription form
          but didn’t complete the process.
          </p>

          <p>
          Your wellness journey is just one step away.
          Click below to continue your subscription.
          </p>

          <a href="https://www.ryviveroots.com/subscription"
             style="background:#2e7d32;color:white;padding:10px 18px;border-radius:6px;text-decoration:none;">
             Complete Subscription
          </a>

          <p style="margin-top:20px">
          If you need any help, feel free to contact us.
          </p>

          <p>
          <b>Phone:</b> 9765600701<br/>
          <b>Email:</b> subscribe@ryviveroots.com
          </p>

          <p>Stay Healthy,<br/>Team Ryvive Roots</p>
        </div>
        `,
      });
    }

    // Send notification to company also
   await sendEmail({
   to: [
    process.env.COMPANY_EMAIL,
    process.env.COMPANY_EMAIL_2
  ],
  subject: "New Incomplete Subscription Form – Ryvive Roots",
  html: `
  <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">

    <h2>Incomplete Subscription Form Notification</h2>

    <p>
      A customer started filling the subscription form on the website but did not complete the process.
    </p>

    <p><b>Customer Information:</b></p>

    <table style="border-collapse: collapse;">
      <tr>
        <td style="padding:6px 10px;"><b>Name</b></td>
        <td style="padding:6px 10px;">: ${firstName || "N/A"}</td>
      </tr>
      <tr>
        <td style="padding:6px 10px;"><b>Phone</b></td>
        <td style="padding:6px 10px;">: ${phone || "N/A"}</td>
      </tr>
      <tr>
        <td style="padding:6px 10px;"><b>Email</b></td>
        <td style="padding:6px 10px;">: ${email || "N/A"}</td>
      </tr>
    </table>

    <br/>

    <p>
      You may reach out to the customer to assist them in completing their subscription.
    </p>

    <br/>

    <p>
      Regards,<br/>
      <b>Ryvive Roots Website System</b>
    </p>

  </div>
  `,
});

    res.json({ success: true });
  } catch (err) {
    console.error("Abandoned form error:", err);
    res.status(500).json({ error: "Server error" });
  }
};