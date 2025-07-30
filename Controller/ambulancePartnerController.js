import { generatePassword, matchedPassword } from "../Utils/password.js";
import prisma from "../Utils/prismaClient.js";
import { uploadAmbulancePartnerImage } from "../Storage/ambulancePartner.js";
import deleteImage from "../Utils/deleteImage.js";


export const addAmbulancePartner = (req, res) => {
  uploadAmbulancePartnerImage(req, res, async (err) => {
    try {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ error: err.message });
      }

      const { name, phoneNumber, email, password, vehicleNumber } = req.body;

      // Check all required fields
      if (!name || !phoneNumber || !email || !password || !vehicleNumber) {
        return res.status(400).json({ error: "All fields are required." });
      }

      // Validate phone
      if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
        return res.status(400).json({ error: "Enter a valid 10-digit phone number." });
      }

      // Validate email
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: "Enter a valid email address." });
      }

      // Validate password
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters." });
      }

      // Validate file presence
      if (!req.files?.image) {
        return res.status(400).json({ error: "Image is required." });
      }

      const hashedPassword = generatePassword(password);

      const partner = await prisma.ambulancePartner.create({
        data: {
          name,
          phoneNumber,
          email,
          password: hashedPassword,
          vehicleNumber,
          isOnline: false,
          imageUrl: `/ambulancepartnerimages/${req.files.image[0].filename}`,
        },
      });

      return res.status(201).json({
        message: "Ambulance Partner added successfully.",
        partner,
      });

    } catch (error) {
      console.error("Add Ambulance Partner Error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  });
};

// Get all Ambulance Partners
export const getAllAmbulancePartners = async (req, res) => {
  try {
    const partners = await prisma.ambulancePartner.findMany();
    if (!partners) return res.status(500).json({ error: "Unable to get Ambulance Partners" });
    res.status(200).json(partners);
  } catch (err) {
    
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get specific Ambulance Partner by ID
export const getAmbulancePartnerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const partner = await prisma.ambulancePartner.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        email: true,
        isOnline: true,
        imageUrl : true,
        vehicleNumber: true,
      }
    });

    if (!partner) return res.status(500).json({ error: "Unable to get Ambulance Partner" });
    res.status(200).json({
      message : "Ambulance Partner Fetched Sucessfully",
      partner : partner
    }
    );
  } catch (err) {
    
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete Ambulance Partner
export const deleteAmbulancePartner = async (req, res) => {
  try {
    const { id } = req.params;
    //delete image if exists
    const partner = await prisma.ambulancePartner.findUnique({ where: { id: parseInt(id) } });
    if (partner?.imageUrl) {
      const imagePath = `./public/${partner.imageUrl}`;
      deleteImage(imagePath);
    }

    await prisma.ambulancePartner.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle isOnline status
export const toggleAmbulancePartnerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isOnline , lat ,lng } = req.body;

    


    if (typeof isOnline !== "boolean")
      return res.status(400).json({ error: "Valid status is required" });

    const updated = await prisma.ambulancePartner.update({
      where: { id: +id },
      data: { 
        isOnline : isOnline,
        lat : String(lat),
        lng : String(lng)
      },
    });

    

    return res.status(200).json({
      message: `Marked ${isOnline ? "Online" : "Offline"}`,
      partner: updated,
    });
  } catch {
    
    return res.status(500).json({ error: "Unable to update status" });
  }
};

// Change password
export const updateAmbulancePartnerPassword = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) return res.status(400).json({ error: "Id is required" });

    const { oldPassword, newPassword } = req.body;

    

    if (!oldPassword || !newPassword)
      return res.status(400).json({ error: "All fields are required" });

    if (oldPassword === newPassword)
      return res
        .status(400)
        .json({ error: "New password and old password should be different" });

    const partner = await prisma.ambulancePartner.findUnique({
      where: { id: +id },
    });

    if (!partner)
      return res.status(404).json({ error: "Ambulance Partner not found" });

    const isMatch = matchedPassword(oldPassword, partner.password);
    if (!isMatch)
      return res.status(403).json({ error: "Old password is incorrect" });

    const updated = await prisma.ambulancePartner.update({
      where: { id: +id },
      data: {
        password: generatePassword(newPassword),
      },
    });

    if (!updated)
      return res
        .status(500)
        .json({ error: "Unable to update password of Ambulance Partner" });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    
    return res
      .status(500)
      .json({ error: "Internal server error while updating password" });
  }
};

// Login
export const ambulancePartnerLogin = async (req, res) => {
  try {
    const { phoneNumber, password, fcmToken } = req.body;

    console.log("Login attempt from:", req.body.fcmToken || "Unknown");


    if (!phoneNumber || !password)
      return res.status(400).json({ error: "All fields are required" });

    if (!fcmToken)
      return res.status(400).json({ error: "FCM Token is required" });


    const partner = await prisma.ambulancePartner.findUnique({
      where: { 
        phoneNumber : phoneNumber
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        password: true,
        imageUrl: true,
        vehicleNumber: true,
        isOnline: true,
      },
    });

    

    if (!partner)
      return res.status(404).json({ error: "No user found with this phone number" });

    if (!matchedPassword(password, partner.password))
      return res.status(403).json({ error: "Incorrect password" });


    await prisma.ambulancePartner.update({
      where: {
        id: partner.id,
      },
      data: {
        fcmToken: fcmToken
      }
    });

    return res.status(200).json({
      message: "Login successful",
      partner: {
        id: partner.id,
        name: partner.name,
        phoneNumber: partner.phoneNumber,
        email: partner.email,
        imageUrl: partner.imageUrl,
        vehicleNumber: partner.vehicleNumber
      },
    });
  } catch (err) {
    console.error("Ambulance Partner Login Error:", err);
    return res.status(500).json({ error: "Login failed due to server error" });
  }
};