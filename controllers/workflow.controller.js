import { serve } from '@upstash/workflow/express';

import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

// How many days before renewal we send each reminder
const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  // Step 1: Get the subscriptionId that was passed when the workflow was triggered
  const { subscriptionId } = context.requestPayload;

  // Step 2: Fetch the subscription from MongoDB (including the user's name and email)
  const subscription = await context.run('fetch-subscription', async () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  });

  // Step 3: If subscription not found or already cancelled/expired, stop here
  if (!subscription || subscription.status !== 'active') return;

  const renewalDate = new Date(subscription.renewalDate);

  // Step 4: Loop through each reminder (7 days, 5 days, 2 days, 1 day before renewal)
  for (const daysBefore of REMINDERS) {
    // Calculate the exact date/time to send this reminder
    const reminderDate = new Date(renewalDate);
    reminderDate.setDate(reminderDate.getDate() - daysBefore);

    // Step 5: If the reminder date is in the future, sleep until then
    const now = new Date();
    if (reminderDate > now) {
      await context.sleepUntil(`reminder-${daysBefore}-days-before`, reminderDate);
    }

    // Step 6: After waking up, re-check if subscription is still active
    // (user might have cancelled it while we were sleeping)
    const freshSubscription = await context.run(`check-status-${daysBefore}-days`, async () => {
      return Subscription.findById(subscriptionId).select('status');
    });

    if (!freshSubscription || freshSubscription.status !== 'active') {
      console.log(`Subscription ${subscriptionId} is no longer active. Stopping reminders.`);
      return;
    }

    // Step 7: Send the reminder email
    await context.run(`send-email-${daysBefore}-days`, async () => {
      await sendReminderEmail({
        to: subscription.user.email,
        type: `${daysBefore} days before`,
        subscription,
      });
    });

    console.log(`Reminder sent to ${subscription.user.email} — ${daysBefore} days before renewal`);
  }
});
