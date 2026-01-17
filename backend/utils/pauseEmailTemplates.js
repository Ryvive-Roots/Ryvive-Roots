export const goldPauseEmail = ({
  customerName,
  pauseStartDate,
  ResumeDate,
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
      <li><strong>Service Resume Date:</strong> ${ResumeDate}</li>
      <li><strong>Scheduled Delivery Time Slot:</strong> ${timeSlot}</li>
    </ul>

    <p>
      As a Gold member, you are entitled to a maximum of <strong>2 pause requests</strong> under your plan.<br/>
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

  </div>
  `,
});

export const platinumPauseEmail = ({
  customerName,
  pauseStartDate,
  ResumeDate,
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
      <li><strong>Service Resume Date:</strong> ${ResumeDate}</li>
      <li><strong>Scheduled Delivery Time Slot:</strong> ${timeSlot}</li>
    </ul>

    <p>
      As a Platinum member, you are entitled to a maximum of <strong>3 pause requests</strong> under your plan.<br/>
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

  </div>
  `,
});
