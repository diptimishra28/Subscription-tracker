import transporter, { accountEmail } from '../config/nodemailer.js';

// ─── Main Function ────────────────────────────────────────────────────────────
// This is called from workflow.controller.js for each reminder
// Parameters:
//   to           — the user's email address
//   type         — e.g. "7 days before", "1 days before"
//   subscription — the full subscription object from MongoDB

export const sendReminderEmail = async ({ to, type, subscription }) => {
  const subject = getEmailSubject(type, subscription.name);
  const body = getEmailBody(type, subscription);

  await transporter.sendMail({
    from: `Subscription Tracker <${accountEmail}>`,
    to,
    subject,
    html: body,
  });
};

// ─── Subject Line ─────────────────────────────────────────────────────────────
const getEmailSubject = (type, subscriptionName) => {
  const subjectMap = {
    '7 days before': `Reminder: ${subscriptionName} renews in 7 days`,
    '5 days before': `Reminder: ${subscriptionName} renews in 5 days`,
    '2 days before': `Heads up! ${subscriptionName} renews in 2 days`,
    '1 days before': `Last warning: ${subscriptionName} renews tomorrow!`,
  };

  return subjectMap[type] ?? `Reminder: ${subscriptionName} is renewing soon`;
};

// ─── Email Body (HTML) ────────────────────────────────────────────────────────
const getEmailBody = (type, subscription) => {
  const { name, price, currency, renewalDate, frequency, category } = subscription;

  // Format the renewal date nicely, e.g. "30 April 2026"
  const formattedDate = new Date(renewalDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Choose the right urgency message based on how close the renewal is
  const urgencyMap = {
    '7 days before': 'Your subscription is renewing in <strong>7 days</strong>.',
    '5 days before': 'Your subscription is renewing in <strong>5 days</strong>.',
    '2 days before': 'Your subscription is renewing in <strong>2 days</strong>. Please make sure your payment is ready.',
    '1 days before': 'Your subscription renews <strong>tomorrow</strong>! Ensure your payment method is up to date.',
  };

  const urgencyMessage = urgencyMap[type] ?? 'Your subscription is renewing soon.';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">

      <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

        <h2 style="color: #333333; margin-top: 0;">Subscription Renewal Reminder</h2>

        <p style="color: #555555; font-size: 16px;">
          ${urgencyMessage}
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f2f2f2;">
            <td style="padding: 10px 14px; font-weight: bold; color: #444;">Subscription</td>
            <td style="padding: 10px 14px; color: #333;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; color: #444;">Amount</td>
            <td style="padding: 10px 14px; color: #333;">${price} ${currency}</td>
          </tr>
          <tr style="background-color: #f2f2f2;">
            <td style="padding: 10px 14px; font-weight: bold; color: #444;">Frequency</td>
            <td style="padding: 10px 14px; color: #333; text-transform: capitalize;">${frequency}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; color: #444;">Category</td>
            <td style="padding: 10px 14px; color: #333; text-transform: capitalize;">${category}</td>
          </tr>
          <tr style="background-color: #f2f2f2;">
            <td style="padding: 10px 14px; font-weight: bold; color: #444;">Renewal Date</td>
            <td style="padding: 10px 14px; color: #333;">${formattedDate}</td>
          </tr>
        </table>

        <p style="color: #777777; font-size: 14px; margin-top: 24px;">
          If you no longer need this subscription, make sure to cancel it before the renewal date to avoid being charged.
        </p>

        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 24px 0;" />

        <p style="color: #aaaaaa; font-size: 12px; text-align: center; margin: 0;">
          This is an automated reminder from Subscription Tracker. Please do not reply to this email.
        </p>

      </div>
    </div>
  `;
};
