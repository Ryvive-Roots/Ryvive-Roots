export const silverPauseEmail = ({
  customerName,
  pauseStartDate,
  ResumeDate,
  timeSlot,
  remainingPauses,
  maxPauses,
}) => ({
  subject: "Your Ryvive Silver Subscription Has Been Paused",
  html: `
  <div style="font-family: Arial, sans-serif; font-size:14px; color:#333;">

    <p>Dear <strong>${customerName}</strong>,</p>

    <p>
      Your <strong>Ryvive Silver subscription has been successfully paused</strong>
      as requested through your dashboard.
    </p>

    <p><strong>Pause Details</strong></p>

    <ul>
      <li><strong>Pause Start Date:</strong> ${pauseStartDate}</li>
      <li><strong>Service Resume Date:</strong> ${ResumeDate}</li>
      <li><strong>Scheduled Delivery Time Slot:</strong> ${timeSlot}</li>
    </ul>

    ${
      maxPauses === 0
        ? `
        <p>
          Your current Silver plan duration does not include pause requests.
        </p>
      `
        : `
        <p>
          Your total pause allowance for the current Silver plan is
          <strong>${maxPauses}</strong> pause request(s).<br/>
          Remaining available pauses: <strong>${remainingPauses}</strong>
        </p>
      `
    }

    <p>
      Deliveries will remain on hold during this period and will
      automatically resume on the mentioned date.
    </p>

    <p>
      For any assistance, please contact
      <strong>customersupport@ryviveroots.com</strong>.
    </p>

    <p>
      Warm regards,<br/>
      <strong>Team Ryvive Roots</strong>
    </p>

 <style>
@media only screen and (max-width:600px) {
  .footer-table td {
    display:block !important;
    width:100% !important;
    text-align:center !important;
    margin-bottom:15px;
  }

  .footer-icons img{
    margin:0 6px !important;
  }
}
</style>

<table style="width:100%; background:#f3f3f3; padding:25px; font-family:Arial, sans-serif; border-spacing:0;">

<tr>
<td align="center">

<table style="text-align:center; border-spacing:0;">

<tr>
<td style="padding:6px 0;">
<img src="https://ryviveroots.com/Ryvive.png" width="180" alt="Ryvive Roots Logo" style="border:none;">
</td>
</tr>

<tr>
<td style="padding:6px 0; font-size:13px; color:#333; line-height:1.5; text-align:center;">
You're receiving this email because you recently activated a Ryvive Roots membership.<br>
If you have any concerns, please contact us at 
<a href="mailto:customersupport@ryviveroots.com" style="text-decoration:none;">
customersupport@ryviveroots.com
</a>.
</td>
</tr>

<tr>
<td style="padding:8px 0; text-align:center;">
<a href="https://www.instagram.com/ryvive_roots/" style="margin-right:12px; text-decoration:none;">
<img src="https://cdn-icons-png.flaticon.com/512/1400/1400829.png" width="22" alt="Instagram" style="vertical-align:middle; border:none;">
</a>

<a href="https://www.linkedin.com/in/ryvive-roots-750b533a7/" style="text-decoration:none;">
<img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" width="22" alt="LinkedIn" style="vertical-align:middle; border:none;">
</a>
</td>
</tr>

<tr>
<td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">
+91 9076000468 / 97656 00701
</td>
</tr>

<tr>
<td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">
<a href="https://www.ryviveroots.com" style="text-decoration:none;">
www.ryviveroots.com
</a>
</td>
</tr>

<tr>
<td style="padding:6px 0; text-align:center;">
<a href="https://ryviveroots.com/privacy-policy" style="text-decoration:none;">
Privacy Policy
</a>
</td>
</tr>

<tr>
<td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">
Dombivli East, Maharashtra 421201, India
</td>
</tr>

<tr>
<td style="padding-top:10px; font-size:13px; color:#333; text-align:center;">
© 2026 RYVIVE ROOTS All Rights Reserved.
</td>
</tr>

</table>

  </div>
  `,
});


export const goldPauseEmail = ({
  customerName,
  pauseStartDate,
  ResumeDate,
  timeSlot,
  remainingPauses,
  maxPauses,
}) => ({
  subject: "Your Ryvive Gold Subscription Has Been Paused",
  html: `
  <div style="font-family: Arial, sans-serif; font-size:14px; color:#333;">
    
    <p>Dear <strong>${customerName}</strong>,</p>

    <p>
      This is to confirm that your <strong>Ryvive Gold subscription has been successfully paused</strong>
      as per your request submitted through your dashboard.
    </p>

    <p><strong>Pause Details</strong></p>

    <ul>
      <li><strong>Pause Start Date:</strong> ${pauseStartDate}</li>
      <li><strong>Service Resume Date:</strong> ${ResumeDate}</li>
      <li><strong>Scheduled Delivery Time Slot:</strong> ${timeSlot}</li>
    </ul>

    <p>
      As a Gold member, you are entitled to a maximum of <strong>${maxPauses} requests(s)</strong> under your plan.<br/>
      After this request, your <strong>remaining available pauses:</strong> ${remainingPauses}
    </p>

    <p>
      During the pause period, <strong>all deliveries will remain temporarily suspended</strong>.
      Your subscription will <strong>automatically resume on the date mentioned above</strong>,
      and deliveries will continue as per your selected time slot.
    </p>

    <p>
      If you need any assistance or wish to modify your pause schedule, please contact us at
      <strong>customersupport@ryviveroots.com</strong>.
    </p>

    <p>
      Thank you for choosing <strong>Ryvive Roots</strong>.
    </p>

    <p>
      Warm regards,<br/>
      <strong>Team Ryvive Roots</strong>
    </p>

 <style>
@media only screen and (max-width:600px) {
  .footer-table td {
    display:block !important;
    width:100% !important;
    text-align:center !important;
    margin-bottom:15px;
  }

  .footer-icons img{
    margin:0 6px !important;
  }
}
</style>

<table style="width:100%; background:#f3f3f3; padding:25px; font-family:Arial, sans-serif; border-spacing:0;">

<tr>
<td align="center">

<table style="text-align:center; border-spacing:0;">

<tr>
<td style="padding:6px 0;">
<img src="https://ryviveroots.com/Ryvive.png" width="180" alt="Ryvive Roots Logo" style="border:none;">
</td>
</tr>

<tr>
<td style="padding:6px 0; font-size:13px; color:#333; line-height:1.5; text-align:center;">
You're receiving this email because you recently activated a Ryvive Roots membership.<br>
If you have any concerns, please contact us at 
<a href="mailto:customersupport@ryviveroots.com" style="text-decoration:none;">
customersupport@ryviveroots.com
</a>.
</td>
</tr>

<tr>
<td style="padding:8px 0; text-align:center;">
<a href="https://www.instagram.com/ryvive_roots/" style="margin-right:12px; text-decoration:none;">
<img src="https://cdn-icons-png.flaticon.com/512/1400/1400829.png" width="22" alt="Instagram" style="vertical-align:middle; border:none;">
</a>

<a href="https://www.linkedin.com/in/ryvive-roots-750b533a7/" style="text-decoration:none;">
<img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" width="22" alt="LinkedIn" style="vertical-align:middle; border:none;">
</a>
</td>
</tr>

<tr>
<td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">
+91 9076000468 / 97656 00701
</td>
</tr>

<tr>
<td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">
<a href="https://www.ryviveroots.com" style="text-decoration:none;">
www.ryviveroots.com
</a>
</td>
</tr>

<tr>
<td style="padding:6px 0; text-align:center;">
<a href="https://ryviveroots.com/privacy-policy" style="text-decoration:none;">
Privacy Policy
</a>
</td>
</tr>

<tr>
<td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">
Dombivli East, Maharashtra 421201, India
</td>
</tr>

<tr>
<td style="padding-top:10px; font-size:13px; color:#333; text-align:center;">
© 2026 RYVIVE ROOTS All Rights Reserved.
</td>
</tr>

</table>

  </div>
  `,
});

export const platinumPauseEmail = ({
  customerName,
  pauseStartDate,
  ResumeDate,
  timeSlot,
  remainingPauses,
  maxPauses,
}) => ({
  subject: "Your Ryvive Platinum Subscription Has Been Paused",
  html: `
  <div style="font-family: Arial, sans-serif; font-size:14px; color:#333;">

    <p>Dear <strong>${customerName}</strong>,</p>

    <p>
      We have successfully processed your request to
      <strong>pause your Ryvive Platinum subscription</strong>,
      submitted through your dashboard.
    </p>

    <p><strong>Pause Details</strong></p>

    <ul>
      <li><strong>Pause Start Date:</strong> ${pauseStartDate}</li>
      <li><strong>Service Resume Date:</strong> ${ResumeDate}</li>
      <li><strong>Scheduled Delivery Time Slot:</strong> ${timeSlot}</li>
    </ul>

    <p>
      As a Platinum member, you are entitled to a maximum of <strong>${maxPauses} requests(s)</strong> under your plan.<br/>
      After this request, your <strong>remaining available pauses:</strong> ${remainingPauses}
    </p>

    <p>
      All deliveries will remain <strong>on hold during the pause period</strong>.
      Your subscription will <strong>automatically resume on the above mentioned date</strong>,
      with your meal schedule continuing seamlessly.
    </p>

    <p>
      If you require any support or adjustments, please feel free to reach us at
      <strong>customersupport@ryviveroots.com</strong>.
    </p>

    <p>
      Warm regards,<br/>
      <strong>Team Ryvive Roots</strong>
    </p>

 <style>
@media only screen and (max-width:600px) {
  .footer-table td {
    display:block !important;
    width:100% !important;
    text-align:center !important;
    margin-bottom:15px;
  }

  .footer-icons img{
    margin:0 6px !important;
  }
}
</style>

<table style="width:100%; background:#f3f3f3; padding:25px; font-family:Arial, sans-serif; border-spacing:0;">

<tr>
<td align="center">

<table style="text-align:center; border-spacing:0;">

<tr>
<td style="padding:6px 0;">
<img src="https://ryviveroots.com/Ryvive.png" width="180" alt="Ryvive Roots Logo" style="border:none;">
</td>
</tr>

<tr>
<td style="padding:6px 0; font-size:13px; color:#333; line-height:1.5; text-align:center;">
You're receiving this email because you recently activated a Ryvive Roots membership.<br>
If you have any concerns, please contact us at 
<a href="mailto:customersupport@ryviveroots.com" style="text-decoration:none;">
customersupport@ryviveroots.com
</a>.
</td>
</tr>

<tr>
<td style="padding:8px 0; text-align:center;">
<a href="https://www.instagram.com/ryvive_roots/" style="margin-right:12px; text-decoration:none;">
<img src="https://cdn-icons-png.flaticon.com/512/1400/1400829.png" width="22" alt="Instagram" style="vertical-align:middle; border:none;">
</a>

<a href="https://www.linkedin.com/in/ryvive-roots-750b533a7/" style="text-decoration:none;">
<img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" width="22" alt="LinkedIn" style="vertical-align:middle; border:none;">
</a>
</td>
</tr>

<tr>
<td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">
+91 9076000468 / 97656 00701
</td>
</tr>

<tr>
<td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">
<a href="https://www.ryviveroots.com" style="text-decoration:none;">
www.ryviveroots.com
</a>
</td>
</tr>

<tr>
<td style="padding:6px 0; text-align:center;">
<a href="https://ryviveroots.com/privacy-policy" style="text-decoration:none;">
Privacy Policy
</a>
</td>
</tr>

<tr>
<td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">
Dombivli East, Maharashtra 421201, India
</td>
</tr>

<tr>
<td style="padding-top:10px; font-size:13px; color:#333; text-align:center;">
© 2026 RYVIVE ROOTS All Rights Reserved.
</td>
</tr>

</table>
  </div>
  `,
});
