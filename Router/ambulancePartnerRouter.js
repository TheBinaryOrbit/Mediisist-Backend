import express from 'express';
import { 
    addAmbulancePartner , 
    getAllAmbulancePartners , 
    getAmbulancePartnerById , 
    deleteAmbulancePartner , 
    toggleAmbulancePartnerStatus , 
    updateAmbulancePartnerPassword , 
    ambulancePartnerLogin
} from '../Controller/ambulancePartnerController.js';
export const ambulanceRouter =  express.Router();

// Create
ambulanceRouter.post("/add", addAmbulancePartner); // admin protected

// Read
ambulanceRouter.get("/getallambulancepartner", getAllAmbulancePartners); // admin protected
ambulanceRouter.get("/getambulancepartner/:id", getAmbulancePartnerById);

// Delete
ambulanceRouter.delete("deleteambulancepartner/:id", deleteAmbulancePartner); // admin protected

// Update Status
ambulanceRouter.patch("/changestatus/:id", toggleAmbulancePartnerStatus);

// Update Password
ambulanceRouter.patch("/changepassword/:id", updateAmbulancePartnerPassword);


// Login
ambulanceRouter.post("/login", ambulancePartnerLogin);