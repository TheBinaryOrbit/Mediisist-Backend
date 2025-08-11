import express from 'express';
import { addWithdraw } from '../Controller/doctor/withdrawController.js';
export const withdrawRouter = express.Router();

withdrawRouter.post('/add', addWithdraw);