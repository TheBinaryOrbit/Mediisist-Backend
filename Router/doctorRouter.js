import express from 'express';
import {
  addDoctor,
  getAllDoctors,
  getDoctorById,
  deleteDoctor,
  updateDoctorDetails,
  updateClinicDetails,
  changePassword,
  editProfileImage
} from '../Controller/doctorController.js';

export const doctorRouter = express.Router();

// Add a new doctor
doctorRouter.post('/add', addDoctor);

// Get all doctors
doctorRouter.get('/', getAllDoctors); // admin protected

// Get doctor by ID
doctorRouter.get('/:id', getDoctorById);

// Delete a doctor
doctorRouter.delete('/:id', deleteDoctor);

// Update doctor details
doctorRouter.put('/:id', updateDoctorDetails);

// Update clinic details
doctorRouter.put('/clinic/:id', updateClinicDetails);

// Change password
doctorRouter.put('/password/:id', changePassword);

// Edit profile image
doctorRouter.put('/profile-image/:id', editProfileImage);

