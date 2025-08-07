import express from 'express';
import { createUser, GetOTP , getUserById, updateUser, verifyOTP } from '../Controller/UserController.js';

export const userRouter = express.Router();

userRouter.post('/getotp' , GetOTP);
userRouter.post('/verifyotp', verifyOTP);
userRouter.post('/createaccount' ,  createUser);
userRouter.put('/updateaccount/:id', updateUser);
userRouter.get('/get/:id', getUserById);
