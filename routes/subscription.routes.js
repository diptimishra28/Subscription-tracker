import { Router } from 'express';

import authorize from '../middlewares/auth.middleware.js'
import {
  createSubscription,
  getUserSubscriptions,
} from '../controllers/subscription.controller.js'

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => { 
    res.send('GET all subscriptions');
});

subscriptionRouter.get('/:id', (req, res) => { 
    res.send('GET subscriptions details');
});

subscriptionRouter.post('/', (req, res) => { 
    res.send('CREATE subscriptions');
});

subscriptionRouter.put('/:id', (req, res) => { 
    res.send('UPDATE subscriptions');
});

subscriptionRouter.delete('/:id', (req, res) => { 
    res.send('DELETE subscriptions');
});

subscriptionRouter.get('/user/:id', (req, res) => { 
    res.send('GET all user subscriptions');
});

subscriptionRouter.put('/:id/cancel', (req, res) => { 
    res.send('CANCEL subscriptions');
});

subscriptionRouter.get('/upcoming-renewals', (req, res) => { 
    res.send('GET upcoming renewals');
});

export default subscriptionRouter;





