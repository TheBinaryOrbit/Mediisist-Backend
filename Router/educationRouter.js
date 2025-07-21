import express from 'express';
import {
  addEducationDetail,
  updateEducationDetail,
  deleteEducationDetail,
  getEducationDetails
} from '../Controller/educationController.js';

export const educationRouter = express.Router();

// Add education detail
educationRouter.post('/:doctorId', addEducationDetail);

// Update education detail
educationRouter.put('/:educationId', updateEducationDetail);

// Delete education detail
educationRouter.delete('/:educationId/:doctorId', deleteEducationDetail);

// Get education details of a doctor
educationRouter.get('/:doctorId', getEducationDetails);

