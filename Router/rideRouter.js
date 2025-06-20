import express from 'express';
import { acceptRideByAmbulancePartner, acceptRideByCustomerSupport, addRide, completeRideByCustomerSupport, deleteRide, getAmbulancePartnerRide, getCustomerSupportRide, getPendingAmbulanceList, getPendingCallsList, getRideDetails, sendSmsAgain, updateRideLocationBySessionKey } from '../Controller/rideControllers.js';

export const rideRouter = express.Router();


rideRouter.post('/addride' , addRide);

rideRouter.patch('/updatelocation/:session' , updateRideLocationBySessionKey);

rideRouter.patch('/accept/customersupport/:rideId' , acceptRideByCustomerSupport);
rideRouter.patch('/complete/customersupport/:rideId' , completeRideByCustomerSupport);



rideRouter.patch('/accept/ambulancepartner/:rideId' , acceptRideByAmbulancePartner);


rideRouter.get('/getride/:session' , getRideDetails);

// get call support ride
rideRouter.get('/getcustomersupportride/:id' , getCustomerSupportRide);

// get ambulance partner
rideRouter.get('/getambulancepartnerride/:id' , getAmbulancePartnerRide);


// get pending Call List  
rideRouter.get('/getpendingcalllist' , getPendingCallsList);

// get pending Rides 
rideRouter.get('/getpendingambulancelist' , getPendingAmbulanceList);


// delete ride 
rideRouter.delete('/decline/:rideId' , deleteRide)

// sned sms
rideRouter.get('/sendsms/:rideId' , sendSmsAgain)