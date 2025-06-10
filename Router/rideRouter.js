import express from 'express';
import { acceptRideByAmbulancePartner, acceptRideByCustomerSupport, addRide, getAmbulancePartnerRide, getCustomerSupportRide, getRideDetails, updateRideLocationBySessionKey } from '../Controller/rideControllers.js';

export const rideRouter = express.Router();


rideRouter.post('/addride' , addRide);

rideRouter.patch('/updatelocation/:session' , updateRideLocationBySessionKey);

rideRouter.patch('/accept/customersupport/:rideId' , acceptRideByCustomerSupport);
rideRouter.patch('/accept/ambulancepartner/:rideId' , acceptRideByAmbulancePartner);


rideRouter.get('/getride/:session' , getRideDetails);

// get call support ride
rideRouter.get('/getcustomersupportride/:id' , getCustomerSupportRide);

// get ambulance partner
rideRouter.get('/getambulancepartnerride/:id' , getAmbulancePartnerRide);