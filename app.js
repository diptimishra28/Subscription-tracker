import express from 'express';

import { PORT } from './config/env.js';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/db_connection.js';

const app = express();

//api/v1/auth/sign-up
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.get('/', (req, res) => {
    res.send('welcome to the Subscription Tracker API!');
});

app.listen(PORT, async() => {
    console.log(`subscription Tracker API is running on http://localhost:${PORT}`);

    await connectToDatabase();
})
export default app; 

