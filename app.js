import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT } from './config/env.js';
                                              
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/db_connection.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(express.json()); //this allows app to handle json data sent in requests or api calls
app.use(express.urlencoded({extends: false})); //this helps to process the form data sent via html forms in a  simple format
app.use(cookieParser);

//api/v1/auth/sign-up
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);


app.use(errorMiddleware)

app.get('/', (req, res) => {
    res.send('welcome to the Subscription Tracker API!');
});

app.listen(PORT, async() => {
    console.log(`subscription Tracker API is running on http://localhost:${PORT}`);

    await connectToDatabase();
})
export default app; 

