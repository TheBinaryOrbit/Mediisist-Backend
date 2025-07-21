import express from "express";
import { addCustomerSupport ,
    getAllCustomerSupports ,
    getCustomerSupportById ,
    deleteCustomerSupport ,
    toggleCustomerSupportStatus ,
    UpdatePassword ,
    customerSupportLogin
 } from "../Controller/customerSupportController.js";


export const customerSupportRouter =  express.Router();

// Create
customerSupportRouter.post("/add",addCustomerSupport); // admin protected

// Read
customerSupportRouter.get("/getallcustomersupport", getAllCustomerSupports); // admin protected
customerSupportRouter.get("/getcustomersupport/:id", getCustomerSupportById);

// Delete
customerSupportRouter.delete("/deletecustomersupport/:id", deleteCustomerSupport); // admin protected

// Update status
customerSupportRouter.patch("/changestatus/:id", toggleCustomerSupportStatus);

// Update password
customerSupportRouter.patch("/changecustomersupportpassword/:id", UpdatePassword);

// Login
customerSupportRouter.post("/customersupportlogin", customerSupportLogin);

