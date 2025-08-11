import express from 'express';

import { 
    acceptAppointment, 
    addAppointment, 
    cancelAppointment, 
    completedAppointment, 
    inProgressAppointment, 
    rejectAppointment, 
    getUserAppointments, 
    getDoctorAppointments,
    createOrder,
    getAppointmentById,
    handleUpload,
    handleRescheduled
} from '../Controller/appointment/appointmentController.js';

export const appointmentRouter = express.Router();

appointmentRouter.post('/add', addAppointment);
appointmentRouter.post('/create-order', createOrder);

appointmentRouter.patch('/cancel/:appointmentId/:userId', cancelAppointment);
appointmentRouter.patch('/accept/:appointmentId/:doctorId', acceptAppointment);
appointmentRouter.patch('/reject/:appointmentId/:doctorId', rejectAppointment);


appointmentRouter.patch('/complete/:appointmentId/:doctorId', completedAppointment);
appointmentRouter.patch('/in-progress/:appointmentId/:doctorId', inProgressAppointment);

appointmentRouter.get('/get/user/:userId', getUserAppointments);
appointmentRouter.get('/get/doctor/:doctorId', getDoctorAppointments);
appointmentRouter.get('/get/:appointmentId', getAppointmentById);


appointmentRouter.patch('/upload/prescription/:appointmentId', handleUpload);
appointmentRouter.patch('/reschedule/:appointmentId', handleRescheduled);




