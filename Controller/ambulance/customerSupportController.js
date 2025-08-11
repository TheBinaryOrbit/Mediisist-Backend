import { generatePassword, matchedPassword } from "../../Utils/password.js";
import prisma from "../../Utils/prismaClient.js";
import { uploadCallSupportImage } from "../../Storage/callSupport.js";
import deleteImage from "../../Utils/deleteImage.js";

// Add a new Customer Support
export const addCustomerSupport = async (req, res) => {
  try {
    uploadCallSupportImage(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ error: err.message });
      }

      const imageUrl = req.files?.image ? req.files.image[0].filename : null;

      console.log(req.body);
      const { name, phoneNumber, email, password } = req.body;

      if (!name || !phoneNumber || !email || !password) return res.status(400).json({ error: "All fields are required" });

      // Basic Validation
      if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Name is required" });
      }

      if (!phoneNumber || !/^[6-9]\d{9}$/.test(phoneNumber)) {
        return res.status(400).json({ error: "Valid 10-digit phone number is required" });
      }

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: "Valid email is required" });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const hasedPassword = generatePassword(password);

      // Create entry
      const support = await prisma.customerSupport.create({
        data: {
          name,
          phoneNumber,
          email,
          password: hasedPassword,
          isOnline: false,
          imageUrl: `callsupportimages/${imageUrl}`
        },
        select: {
          id: true,
          name: true,
          phoneNumber: true,
          email: true,
          isOnline: true,
          fcmToken: true
        }
      });

      if (!support) return res.status(500).json({ error: "Unable To Create Customer Support" });
      res.status(201).json(support);
    });
  } catch (err) {

    return res.status(500).json({ error: "Unable To Create Customer Support Internal server error" });
  }
};

// Get all Customer Supports
export const getAllCustomerSupports = async (req, res) => {
  try {
    const supports = await prisma.customerSupport.findMany();
    if (!supports) return res.status(500).json({ error: "Unable To Get Customer Supports" });
    res.status(200).json(supports);
  } catch (err) {

    return res.status(500).json({ error: "Unable To Get Customer Supports Internal server error" });
  }
};

// Get specific Customer Support by 
export const getCustomerSupportById = async (req, res) => {
  try {
    const { id } = req.params;


    const support = await prisma.customerSupport.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        email: true,
        isOnline: true,
        imageUrl: true
      }
    });

    if (!support) return res.status(500).json({ error: "Unable To Get Customer Support" });
    res.status(200).json({
      message: "Call Support Fetched Sucessfully",
      support: support
    });

  } catch (err) {

    return res.status(500).json({ error: "Unable To Get Customer Support Internal server error" });
  }
};


// Delete Customer Support
export const deleteCustomerSupport = async (req, res) => {
  try {
    const { id } = req.params;

    // delete image if exists
    const support = await prisma.customerSupport.findUnique({ where: { id: parseInt(id) } });
    if (support?.imageUrl) {
      const imagePath = `./public/${support.imageUrl}`;
      deleteImage(imagePath);
    }
    await prisma.customerSupport.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle isOnline status
export const toggleCustomerSupportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isOnline } = req.body;



    if (typeof isOnline !== 'boolean')
      return res.status(400).json({ error: 'Valid status is required' });

    const updated = await prisma.customerSupport.update({
      where: { id: +id },
      data: { isOnline },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        email: true,
        isOnline: true,
      }
    });



    return res.status(200).json({ message: `Marked ${isOnline ? 'Online' : 'Offline'}`, support: updated });
  } catch {
    return res.status(500).json({ error: 'Unable to update status' });
  }
};


// change password 
export const UpdatePassword = async (req, res) => {
  try {
    const id = req.params.id

    if (!id) return res.status(400).json({ "error": "Id Is Required" });

    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) return res.status(400).json({ "error": "All Fields Are Required" });
    if (oldPassword === newPassword) return res.status(400).json({ "error": "New password and old password should be diffrent" });

    const support = await prisma.customerSupport.findUnique({
      where: {
        id: +id
      }
    })


    if (!matchedPassword(oldPassword, support.password)) return res.status(403).json({ "error": "Old Password Is Incorrect" });



    const updatedsupport = await prisma.customerSupport.update({
      where: {
        id: +id
      },
      data: {
        password: generatePassword(newPassword)
      }
    })

    if (!updatedsupport) return res.status(500).json({ "error": "Unable To Update passwrod of Service Boy" });
    return res.status(200).json({ "message": "Password Updated Sucessfully" });

  } catch (error) {

    return res.status(500).json({ "error": "Unable To Update passwrod of Service Boy Internal Server Error" });
  }
}


export const customerSupportLogin = async (req, res) => {
  try {
    const { phoneNumber, password, fcmToken, loginFrom = "Mobile" } = req.body;

    console.log("Login attempt from:", loginFrom);

    if (!phoneNumber || !password)
      return res.status(400).json({ error: 'All fields are required' });

    if (loginFrom === "Mobile" && !fcmToken)
      return res.status(400).json({ error: "FCM Token is required" });

    const support = await prisma.customerSupport.findUnique({
      where: {
        phoneNumber: phoneNumber
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        password: true,
        isOnline: true,
        imageUrl: true,
        fcmToken: true
      },
    });

    if (!support)
      return res.status(404).json({ error: 'No user found with this phone number' });

    if (!matchedPassword(password, support.password))
      return res.status(403).json({ error: 'Incorrect password' });

    if (loginFrom === "Mobile") {
      // Update FCM token if provided
      await prisma.customerSupport.update({
        where: {
          id: support.id,
        },
        data: {
          fcmToken: fcmToken
        }
      });
    }

    return res.status(200).json({
      message: 'Login successful',
      customerSupport: {
        id: support.id,
        name: support.name,
        phoneNumber: support.phoneNumber,
        email: support.email,
        imageUrl: support.imageUrl,
        isOnline: support.isOnline,
      },
    });

  } catch (err) {

    return res.status(500).json({ error: 'Login failed due to server error' });
  }
};

