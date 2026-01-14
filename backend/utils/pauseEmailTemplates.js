export const goldPauseEmail = ({
  customerName,
  pauseStartDate,
  pauseEndDate,
  timeSlot,
  remainingPauses,
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
      <li><strong>Pause End Date:</strong> ${pauseEndDate}</li>
      <li><strong>Scheduled Delivery Time Slot:</strong> ${timeSlot}</li>
    </ul>

    <p>
      As a Gold member, you are entitled to <strong>2 pauses per month</strong>.<br/>
      After this request, your <strong>remaining pauses for the month are:</strong> ${remainingPauses}
    </p>

    <p>
      During the pause period, <strong>all deliveries will be temporarily stopped</strong>.
      Your subscription will <strong>automatically resume</strong> on the date mentioned above,
      and your meals will continue as per your selected time slot.
    </p>

    <p>
      If you wish to modify your pause dates or need assistance, please contact us at
      <strong>customersupport@ryviveroots.com</strong>
    </p>

    <p>
      Thank you for choosing <strong>Ryvive Roots</strong>.
    </p>

    <p>
      Warm regards,<br/>
      <strong>Team Ryvive Roots</strong>
    </p>

  </div>
  `,
});


export const platinumPauseEmail = ({
  customerName,
  pauseStartDate,
  pauseEndDate,
  timeSlot,
  remainingPauses,
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
      <li><strong>Pause End Date:</strong> ${pauseEndDate}</li>
      <li><strong>Scheduled Delivery Time Slot:</strong> ${timeSlot}</li>
    </ul>

    <p>
      As a Platinum member, you are entitled to <strong>3 pauses per month</strong>.<br/>
      After this request, your <strong>remaining pauses for the month are:</strong> ${remainingPauses}
    </p>

    <p>
      All deliveries will remain <strong>on hold during the pause period</strong> and
      your subscription will <strong>automatically resume</strong> on the stated end date,
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

  </div>
  `,
});
