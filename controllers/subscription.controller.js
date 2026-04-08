import Subscription from '../models/subscription.model.js'
import { workflowClient } from '../config/upstash.js'
import { SERVER_URL } from '../config/env.js'

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        'content-type': 'application/json',
      },
      retries: 0,
    })

    res.status(201).json({ success: true, data: { subscription, workflowRunId } });
  } catch (e) {
    next(e);
  }
}

export const getUserSubscriptions = async (req, res, next) => {
  try {
    // Check if the user is the same as the one in the token
    if(req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.statusCode = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
}

// Get all subscriptions (useful for admin purposes)
export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
}

// Get a single subscription by its ID
export const getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      const error = new Error('Subscription not found');
      error.statusCode = 404;
      throw error;
    }

    // Only the owner of the subscription can view it
    if (subscription.user.toString() !== req.user.id) {
      const error = new Error('You are not the owner of this subscription');
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (e) {
    next(e);
  }
}

// Update a subscription's details
export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      const error = new Error('Subscription not found');
      error.statusCode = 404;
      throw error;
    }

    // Only the owner can update
    if (subscription.user.toString() !== req.user.id) {
      const error = new Error('You are not the owner of this subscription');
      error.statusCode = 401;
      throw error;
    }

    const updated = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // return updated doc and run schema validators
    );

    res.status(200).json({ success: true, data: updated });
  } catch (e) {
    next(e);
  }
}

// Permanently delete a subscription
export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      const error = new Error('Subscription not found');
      error.statusCode = 404;
      throw error;
    }

    // Only the owner can delete
    if (subscription.user.toString() !== req.user.id) {
      const error = new Error('You are not the owner of this subscription');
      error.statusCode = 401;
      throw error;
    }

    await Subscription.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Subscription deleted successfully' });
  } catch (e) {
    next(e);
  }
}

// Cancel a subscription — keeps the record but marks it as cancelled
export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      const error = new Error('Subscription not found');
      error.statusCode = 404;
      throw error;
    }

    // Only the owner can cancel
    if (subscription.user.toString() !== req.user.id) {
      const error = new Error('You are not the owner of this subscription');
      error.statusCode = 401;
      throw error;
    }

    if (subscription.status === 'cancelled') {
      const error = new Error('Subscription is already cancelled');
      error.statusCode = 400;
      throw error;
    }

    subscription.status = 'cancelled';
    await subscription.save();

    res.status(200).json({ success: true, message: 'Subscription cancelled successfully', data: subscription });
  } catch (e) {
    next(e);
  }
}