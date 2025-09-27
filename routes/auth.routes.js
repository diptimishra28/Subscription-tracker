import { Router } from 'express'; //Router is like a mini-app inside Express

import  {signUp, signIn} from '../controllers/auth.controller.js'; //These are the actual functions that will run when someone hits the sign-up or sign-in endpoints.

                                                                    //Think of them as the employees who know how to create a new user or log a user in.

const authRouter = Router();  //Creates a new “sub-desk” (router) just for authentication.

//authRouter.post('/sign-up', (req, res) => res.send({title: 'sign up'}));
authRouter.post('/sign-up', signUp);   //this router sends it to the signUp controller. POST is used because we are creating a new user.
authRouter.post('/sign-in', signIn);   //Again POST, because we send a body (email & password) for checking
//authRouter.post('/sign-out', signOut);

export default authRouter;