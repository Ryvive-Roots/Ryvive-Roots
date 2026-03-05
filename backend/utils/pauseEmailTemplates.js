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

    <table style="margin-top:30px; border-top:1px solid #ddd; padding-top:15px;">
  <tr>
    <td style="padding-top:15px;">

   
      <p style="margin:6px 0;">
        <b>M:</b> 97656 00701
      </p>

      <p style="margin:6px 0;">
        <b>E:</b> management@ryviveroots.com |
        <a href="https://www.ryviveroots.com" style="color:#2e7d32;">
          www.ryviveroots.com
        </a>
      </p>

      <p style="margin:6px 0;">Mumbai, Maharashtra</p>
 
    <img 
  src="https://ryviveroots.com/Ryvive.png"
  alt="Ryvive Roots"
  width="180"
  style="display:block; margin-top:10px;"
/>

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

    <table style="margin-top:30px; border-top:1px solid #ddd; padding-top:15px;">
  <tr>
    <td style="padding-top:15px;">

   
      <p style="margin:6px 0;">
        <b>M:</b> 97656 00701
      </p>

      <p style="margin:6px 0;">
        <b>E:</b> management@ryviveroots.com |
        <a href="https://www.ryviveroots.com" style="color:#2e7d32;">
          www.ryviveroots.com
        </a>
      </p>

      <p style="margin:6px 0;">Mumbai, Maharashtra</p>
 
    <img 
  src="https://ryviveroots.com/Ryvive.png"
  alt="Ryvive Roots"
  width="180"
  style="display:block; margin-top:10px;"
/>

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

    <table style="margin-top:30px; border-top:1px solid #ddd; padding-top:15px;">
  <tr>
    <td style="padding-top:15px;">

   
      <p style="margin:6px 0;">
        <b>M:</b> 97656 00701
      </p>

      <p style="margin:6px 0;">
        <b>E:</b> management@ryviveroots.com |
        <a href="https://www.ryviveroots.com" style="color:#2e7d32;">
          www.ryviveroots.com
        </a>
      </p>

      <p style="margin:6px 0;">Mumbai, Maharashtra</p>
 
    <img 
  src="https://ryviveroots.com/Ryvive.png"
  alt="Ryvive Roots"
  width="180"
  style="display:block; margin-top:10px;"
/>

    </td>
  </tr>
</table>
  </div>
  `,
});
