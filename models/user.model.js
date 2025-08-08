import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User Name is required'],
        trim: true,
        minLength: 3,
        maxLength:50,
    },
    email: {
        type: String,
        required: [true, 'User Email is required'],
        unique: true,
        lowercase: true,
        match: [ /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address' ] //regex

    },
    password: {
        type: String,
        required: [true, 'user password is required'],
        minLength: 5,
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [16, 'Age must be at least 16'],
        max: [100, 'Age must be less than or equal to 100']
    }

}, {timestamps: true}); //create,update timing save in db if put true

const User = mongoose.model('User', userSchema); //making usertable

export default User;