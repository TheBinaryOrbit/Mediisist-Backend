import {
    addExperienceDetail,
    updateExperienceDetail,
    deleteExperienceDetail,
    getExperienceDetails
} from '../Controller/experienceController.js';
import express from 'express';

const experienceRouter = express.Router();

// Add experience detail
experienceRouter.post('/:doctorId', addExperienceDetail);

// Update experience detail
experienceRouter.put('/:experienceId/:doctorId', updateExperienceDetail);

// Delete experience detail
experienceRouter.delete('/:experienceId/:doctorId', deleteExperienceDetail);

// Get experience details of a doctor
experienceRouter.get('/:doctorId', getExperienceDetails);

export default experienceRouter;