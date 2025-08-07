import express from 'express';
import {
  addPatientDetail,
  updatePatientDetail,
  deletePatientDetail,
  getPatientByUserId
} from '../Controller/patientController.js';
export const patientRouter = express.Router();

// Define your patient-related routes here
// For example:
patientRouter.post('/add', addPatientDetail);
patientRouter.put('/update/:id', updatePatientDetail);
patientRouter.delete('/delete/:id', deletePatientDetail);
patientRouter.get('/user/:userId', getPatientByUserId);
