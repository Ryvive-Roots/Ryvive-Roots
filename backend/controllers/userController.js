import Order from "../models/order.js";
import User from "../models/User.js";
import generateInvoice from "../utils/generateInvoice.js";
import fs from "fs";
import sendEmail from "../utils/sendEmail.js";

export const getUserOrders = async (req, res) => {
  try {
    const { membershipId } = req.query;

    const orders = await Order.find({ membershipId });

    const now = new Date();
    console.log("🕒 Server Time:", now);

    for (const order of orders) {
      console.log("⏳ Activation At:", order.subscription.activationAt);
      console.log("📌 Current Status:", order.subscription.status);

      if (
        order.subscription.status === "UNDER_PROCESS" &&
        order.subscription.activationAt &&
        new Date(order.subscription.activationAt) <= now
      ) {
        order.subscription.status = "ACTIVE";
        await order.save();
        console.log("✅ Activated:", order.membershipId);
      }
    }

    return res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const getReceipt = async (req, res) => {
  try {
    const { membershipId, receiptNumber } = req.query;

    const order = await Order.findOne({ membershipId, receiptNumber });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Always regenerate fresh PDF — no dependency on invoiceUrl
    const invoicePath = await generateInvoice(order);

    if (!fs.existsSync(invoicePath)) {
      return res.status(404).json({ success: false, message: "Could not generate invoice" });
    }

    // Stream PDF directly to browser as download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${receiptNumber}.pdf"`
    );

    const stream = fs.createReadStream(invoicePath);
    stream.pipe(res);

    // Clean up file after sending
    stream.on("end", () => {
      fs.unlink(invoicePath, (err) => {
        if (err) console.error("Cleanup error:", err);
      });
    });

  } catch (err) {
    console.error("Receipt error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { membershipId, email, phone } = req.body;

    const order = await Order.findOne({ membershipId });

    if (!order) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    const changes = [];
    const oldEmail = order.user.email;
    const oldPhone = order.user.phone;

    if (email && email !== oldEmail) {
      order.user.email = email;
      changes.push({ label: "Email", old: oldEmail || "N/A", new: email });
    }

    if (phone && phone !== oldPhone) {
      order.user.phone = phone;
      changes.push({ label: "Phone", old: oldPhone || "N/A", new: phone });
    }

    if (changes.length === 0) {
      return res.json({ success: true, message: "No changes detected" });
    }

    await order.save();

    const formattedPlan = `RYVIVE ${order.subscription?.plan?.split("_")[0] || ""}`;

    const footerHtml = `
<style>
@media only screen and (max-width:600px) {
  .footer-table td {
    display:block !important;
    width:100% !important;
    text-align:center !important;
    margin-bottom:15px;
  }
  .footer-icons img { margin:0 6px !important; }
}
</style>

<table style="width:100%; background:#f3f3f3; padding:25px; font-family:Arial, sans-serif; border-spacing:0;">
<tr><td align="center">
<table style="text-align:center; border-spacing:0;">

<tr><td style="padding:6px 0;">
<img src="https://ryviveroots.com/Ryvive.png" width="180" alt="Ryvive Roots Logo" style="border:none;">
</td></tr>

<tr><td style="padding:6px 0; font-size:13px; color:#333; line-height:1.5; text-align:center;">
You're receiving this email because you recently updated your Ryvive Roots profile.<br>
If you have any concerns, please contact us at 
<a href="mailto:customersupport@ryviveroots.com" style="text-decoration:none;">customersupport@ryviveroots.com</a>.
</td></tr>

<tr><td style="padding:8px 0; text-align:center;">
<a href="https://www.instagram.com/ryvive_roots/" style="margin-right:12px; text-decoration:none;">
<img src="https://cdn-icons-png.flaticon.com/512/1400/1400829.png" width="22" alt="Instagram" style="vertical-align:middle; border:none;">
</a>
<a href="https://www.linkedin.com/in/ryvive-roots-750b533a7/" style="text-decoration:none;">
<img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" width="22" alt="LinkedIn" style="vertical-align:middle; border:none;">
</a>
</td></tr>

<tr><td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">+91 9076000468 / 97656 00701</td></tr>
<tr><td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">
<a href="https://www.ryviveroots.com" style="text-decoration:none;">www.ryviveroots.com</a>
</td></tr>
<tr><td style="padding:6px 0; text-align:center;">
<a href="https://ryviveroots.com/privacy-policy" style="text-decoration:none;">Privacy Policy</a>
</td></tr>
<tr><td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">Dombivli East, Maharashtra 421201, India</td></tr>
<tr><td style="padding-top:10px; font-size:13px; color:#333; text-align:center;">© 2026 RYVIVE ROOTS All Rights Reserved.</td></tr>

</table>
</td></tr>
</table>`;

    // ── Customer Email ──────────────────────────────────────────
    if (order.user.email) {
      await sendEmail({
        to: order.user.email,
        subject: "Your Profile Has Been Updated – Ryvive Roots",
        html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6;">

<h2 style="font-family: Georgia, 'Times New Roman', serif; font-size:16px; margin-bottom:2px;">
  Dear ${order.user.firstName},
</h2>

<p style="font-size:15px; margin-bottom:10px;">
  Your profile details linked to your <b>${formattedPlan}</b> membership 
  have been successfully updated in our system.
</p>

<p>Here's a summary of the changes made:</p>

<table style="font-family: Arial, sans-serif; font-size:15px; margin-bottom:10px; border-collapse:collapse;">
  <tr>
    <td style="padding:6px 10px;"><b>Membership ID</b></td>
    <td style="padding:6px 10px;">: <b>${membershipId}</b></td>
  </tr>
  ${changes.map((c) => `
  <tr>
    <td style="padding:6px 10px;"><b>Updated ${c.label}</b></td>
    <td style="padding:6px 10px;">: <b>${c.new}</b></td>
  </tr>`).join("")}
  <tr>
    <td style="padding:6px 10px;"><b>Updated On</b></td>
    <td style="padding:6px 10px;">: <b>${new Date().toLocaleDateString("en-IN")}</b></td>
  </tr>
</table>

<br/>

<p>
  If you did not make this change, please contact us immediately at 
  <b>customersupport@ryviveroots.com</b> and we'll secure your account right away.
</p>

<p>
  Warmly,<br/>
  <b>Team Ryvive Roots</b>
</p>

${footerHtml}
</div>`,
      });
    }

    // ── Company Email ───────────────────────────────────────────
    if (process.env.COMPANY_EMAIL) {
      await sendEmail({
        to: process.env.COMPANY_EMAIL,
        subject: `✏️ Profile Updated by Member - ${membershipId}`,
        html: `
<h2>Member Profile Updated (Self-Service)</h2>

<ul>
  <li><b>Name:</b> ${order.user.firstName} ${order.user.lastName}</li>
  <li><b>Membership ID:</b> ${membershipId}</li>
  <li><b>Plan:</b> ${formattedPlan}</li>
</ul>

<p><b>Changes Made:</b></p>
<table style="border-collapse:collapse; font-family:Arial, sans-serif; font-size:14px;">
  <tr style="background:#f0f0f0;">
    <th style="padding:8px 14px; text-align:left;">Field</th>
    <th style="padding:8px 14px; text-align:left;">Old Value</th>
    <th style="padding:8px 14px; text-align:left;">New Value</th>
  </tr>
  ${changes.map((c) => `
  <tr>
    <td style="padding:8px 14px; border-bottom:1px solid #eee;"><b>${c.label}</b></td>
    <td style="padding:8px 14px; border-bottom:1px solid #eee; color:#c62828;">${c.old}</td>
    <td style="padding:8px 14px; border-bottom:1px solid #eee; color:#2e7d32;"><b>${c.new}</b></td>
  </tr>`).join("")}
</table>

<br/>
<p>🕒 Updated on: ${new Date().toLocaleString("en-IN")}</p>

<table style="width:100%; background:#f3f3f3; padding:25px; font-family:Arial, sans-serif;">
  <tr>
    <td style="width:33.33%; vertical-align:middle;">
      <h2 style="margin:0; font-size:22px; color:#243E36;">Ryvive Roots</h2>
      <p style="margin:3px 0 15px 0; color:#555;">Live | Relive | Believe</p>
      <a href="https://www.linkedin.com/in/ryvive-roots-750b533a7/" style="margin-right:8px;">
        <img src="https://ryviveroots.com/link.png" width="28" alt="LinkedIn"/>
      </a>
      <a href="https://www.instagram.com/ryvive_roots/">
        <img src="https://ryviveroots.com/ins.png" width="28" alt="Instagram"/>
      </a>
    </td>
    <td style="width:33.33%; text-align:center; vertical-align:middle;">
      <img src="https://ryviveroots.com/Ryvive.png" width="180" alt="Ryvive Roots"/>
    </td>
    <td style="width:33.33%; vertical-align:middle; font-size:14px; color:#333;">
      <p style="margin:5px 0;"><b>M:</b> 97656 00701</p>
      <p style="margin:5px 0;"><b>E:</b> customersupport@ryviveroots.com</p>
      <p style="margin:5px 0;">www.ryviveroots.com</p>
      <p style="margin:5px 0;">Dombivli East, Maharashtra 421201, India</p>
    </td>
  </tr>
</table>`,
      });
    }

 // Sync User collection too
await User.findOneAndUpdate(
  { membershipId },
  {
    ...(email && email !== oldEmail && { email }),
    ...(phone && phone !== oldPhone && { phone }),
  }
);

return res.json({ success: true, message: "Profile updated successfully" });

  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};