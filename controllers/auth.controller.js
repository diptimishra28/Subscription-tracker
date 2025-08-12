import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//req body -> is an objject containing data from the client specially when have (POST request)

import User from '../models/user.model.js';
import {JWT_SECRET, JWT_EXPIRES_IN} from '../config/env.js';

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        //login to create a new user
        const {name, email,password, age} = req.body;
        console.log(name);

        //check if a user already exxists
        const existingUser = await User.findOne({email});

        if(existingUser) {
            const error = new Error('user already exists');
            error.statusCode = 409;
            throw error;
        }

        //Hash password -> means securing it because u never want to store password in plain text
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUsers = await User.create([{name, email, password: hashedPassword, age}], {session});

        const token = jwt.sign({user: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            mesage: 'user created successfully',
            data: {
                token,
                user: newUsers[0],
            }
        })

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
} 


export const signIn = async (req, res, next) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            const error = new Error('User not founnd');
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET,  {expiresIn: JWT_EXPIRES_IN});

        res.status(200).json({
            success: true,
            message: 'user signed in successfully',
            data: {
                token,
                user,
            }
        });
    } catch (error){
        next(error);
    }
}

//export const signOut = async (req, res, next) => {}