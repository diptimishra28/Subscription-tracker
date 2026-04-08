import { Router } from 'express';

import authorize from '../middlewares/auth.middleware.js';
import {
  createSubscription,
  getUserSubscriptions,
  getAllSubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription,
  cancelSubscription,
} from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

// GET /api/v1/subscriptions — get all subscriptions (admin use)
subscriptionRouter.get('/', authorize, getAllSubscriptions);

// GET /api/v1/subscriptions/:id — get one subscription by ID
subscriptionRouter.get('/:id', authorize, getSubscription);

// POST /api/v1/subscriptions — create a new subscription
subscriptionRouter.post('/', authorize, createSubscription);

// PUT /api/v1/subscriptions/:id — update a subscription
subscriptionRouter.put('/:id', authorize, updateSubscription);

// DELETE /api/v1/subscriptions/:id — delete a subscription
subscriptionRouter.delete('/:id', authorize, deleteSubscription);

// GET /api/v1/subscriptions/user/:id — get all subscriptions for a specific user
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

// PUT /api/v1/subscriptions/:id/cancel — cancel a subscription
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);

export default subscriptionRouter;
