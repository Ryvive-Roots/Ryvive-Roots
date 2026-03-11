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
    subject: "You're So Close Complete Your Ryvive Roots Subscription!",
    html: `
    <div style="font-family: Arial, Helvetica, sans-serif; line-height:1.7; color:#333; max-width:650px; margin:auto;">

      <h2 style="color:#166534;">Hi ${firstName || ""},</h2>

      <p>
        We noticed you started signing up for <b>Ryvive Roots</b> but didn't quite make it to the finish line. 
        We just didn't want you to miss out!
      </p>

      <p>
        Sometimes life gets in the way, and that's completely okay. But here's the exciting part your wellness journey 
        is just a few minutes away, and something really wonderful is waiting for you on the other side.
      </p>

      <p>
        A community that cares, resources that support you, and a subscription that's built entirely around you.
      </p>

      <p>
        All you need to do is head back to 
        <a href="https://www.ryviveroots.com/subscription"><b>www.ryviveroots.com</b></a> 
        and start your registration again. It's quick, it's simple, and we promise it's worth every second!
      </p>

      <h3 style="color:#166534;">Why Ryvive Roots?</h3>

      <p>
        We're not just a subscription, we're a wellness community that genuinely walks alongside you.
        From the moment you join, you'll have access to everything you need to feel your best, 
        at your own pace and in your own way.
      </p>

      <p>
        We're here for all of it the big wins and the small steps alike 🌱
      </p>

      <h3 style="color:#166534;">Need a Hand?</h3>

      <p>
        If you ran into any trouble during registration or have questions about our plans and pricing,
        please don't hesitate to reach out to us at 
        <b>customersupport@ryviveroots.com</b>.
      </p>

      <p>
        We're real people on the other end and we're always happy to help you through it!
      </p>

      <p>
        Your wellness journey deserves to start and we genuinely can't wait to welcome you 
        into the <b>Ryvive Roots family</b> 🌿
      </p>

      <p style="margin-top:25px;">
        Warmly,<br/>
        <b>Team Ryvive Roots 💚</b>
      </p>

      <table style="width:100%; background:#f3f3f3; padding:25px; font-family:Arial, sans-serif;">
  <tr>

    <!-- LEFT SIDE -->
    <td style="width:35%; vertical-align:top;">
      <h2 style="margin:0; font-weight:bold; font-size:22px; color:#243E36;">
        Ryvive Roots
      </h2>

      <p style="margin:3px 0 15px 0; color:#555;">
        Live | Relive | Believe
      </p>

      <!-- SOCIAL ICONS -->
      <a href="https://www.linkedin.com/in/ryvive-roots-750b533a7/" style="margin-right:8px;">
        <img src="https://ryviveroots.com/link.png" width="28" alt="LinkedIn"/>
      </a>

      <a href="https://www.instagram.com/ryvive_roots/">
        <img src="https://ryviveroots.com/ins.png" width="28" alt="Instagram"/>
      </a>
    </td>

    <!-- CENTER LOGO -->
    <td style="width:30%; text-align:center; vertical-align:middle;">
      <img src="https://ryviveroots.com/Ryvive.png" width="180" alt="Ryvive Roots"/>
    </td>

    <!-- RIGHT SIDE -->
    <td style="width:35%; vertical-align:top; font-size:14px; color:#333;">
      <p style="margin:5px 0;"><b>M:</b> 97656 00701</p>
      <p style="margin:5px 0;"><b>M:</b> 97656 00701</p>
      <p style="margin:5px 0;"><b>E:</b> subscribe@ryviveroots.com</p>
      <p style="margin:5px 0;">www.ryviveroots.com</p>
      <p style="margin:5px 0;">
        Dombivli East, Maharashtra 421201, India
      </p>
    </td>

  </tr>
</table>

    </div>
    `,
  });
}

    // Send notification to company also
   await sendEmail({
   to: [
    process.env.COMPANY_EMAIL,
    process.env.COMPANY_EMAIL_2,
    process.env.COMPANY_EMAIL_3
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

    <table style="width:100%; background:#f3f3f3; padding:25px; font-family:Arial, sans-serif;">
  <tr>

    <!-- LEFT SIDE -->
    <td style="width:35%; vertical-align:top;">
      <h2 style="margin:0; font-weight:bold; font-size:22px; color:#243E36;">
        Ryvive Roots
      </h2>

      <p style="margin:3px 0 15px 0; color:#555;">
        Live | Relive | Believe
      </p>

      <!-- SOCIAL ICONS -->
      <a href="https://www.linkedin.com/in/ryvive-roots-750b533a7/" style="margin-right:8px;">
        <img src="https://ryviveroots.com/link.png" width="28" alt="LinkedIn"/>
      </a>

      <a href="https://www.instagram.com/ryvive_roots/">
        <img src="https://ryviveroots.com/ins.png" width="28" alt="Instagram"/>
      </a>
    </td>

    <!-- CENTER LOGO -->
    <td style="width:30%; text-align:center; vertical-align:middle;">
      <img src="https://ryviveroots.com/Ryvive.png" width="180" alt="Ryvive Roots"/>
    </td>

    <!-- RIGHT SIDE -->
    <td style="width:35%; vertical-align:top; font-size:14px; color:#333;">
      <p style="margin:5px 0;"><b>M:</b> 97656 00701</p>
      <p style="margin:5px 0;"><b>M:</b> 97656 00701</p>
      <p style="margin:5px 0;"><b>E:</b> subscribe@ryviveroots.com</p>
      <p style="margin:5px 0;">www.ryviveroots.com</p>
      <p style="margin:5px 0;">
        Dombivli East, Maharashtra 421201, India
      </p>
    </td>

  </tr>
</table>

  </div>
  `,
});

    res.json({ success: true });
  } catch (err) {
    console.error("Abandoned form error:", err);
    res.status(500).json({ error: "Server error" });
  }
};