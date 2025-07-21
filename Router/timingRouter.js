import {
  updateTimingDetails,
  getTimingDetails
} from '../Controller/timingController.js';
import express from 'express';

export const timingRouter = express.Router();


// Update an existing timing
timingRouter.put('/update/:id', updateTimingDetails);

// Get all timings
timingRouter.get('/', getTimingDetails  );
