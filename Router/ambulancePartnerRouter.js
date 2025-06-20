import express from 'express';
import { 
    addAmbulancePartner , 
    getAllAmbulancePartners , 
    getAmbulancePartnerById , 
    deleteAmbulancePartner , 
    toggleAmbulancePartnerStatus , 
    updateAmbulancePartnerPassword , 
    ambulancePartnerLogin, 
    updateAmbulancePartnerLocation} from '../Controller/ambulancePartnerController.js';

export const ambulanceRouter =  express.Router();

// Create
ambulanceRouter.post("/addambulancepartner", addAmbulancePartner);

// Read
ambulanceRouter.get("/gteallambulancepartner", getAllAmbulancePartners); // admin protected
ambulanceRouter.get("/getambulancepartner/:id", getAmbulancePartnerById);

// Delete
ambulanceRouter.delete("deleteambulancepartner/:id", deleteAmbulancePartner);

// Update Status
ambulanceRouter.patch("/changestatus/:id", toggleAmbulancePartnerStatus);

// Update Password
ambulanceRouter.patch("/changepassword/:id", updateAmbulancePartnerPassword);

// Update location
ambulanceRouter.patch("/updatelocation/:id", updateAmbulancePartnerLocation);

// Login
ambulanceRouter.post("/login", ambulancePartnerLogin);