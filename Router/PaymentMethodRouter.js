import express from 'express';
import { addPaymentMethod , getPaymentMethodByDoctorId } from '../Controller/doctor/paymentMethodController.js';

export const paymentMethodRouter = express.Router();

paymentMethodRouter.post('/add', addPaymentMethod);
paymentMethodRouter.get('/get/:id', getPaymentMethodByDoctorId);