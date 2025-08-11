import prisma from "../../Utils/prismaClient.js";
import { sendOTP , verifyOTPWithPhoneNumber } from "../../Utils/otp.js";


export const GetOTP = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        console.log("Get OTP :" + phoneNumber);

        if (!phoneNumber) {
            return res.status(400).json({ error: "Phone number is required." });
        }

        const OTPStatus = await sendOTP(phoneNumber);

        console.log("OTP Status:", OTPStatus); 

        if (!OTPStatus.status) {
            return res.status(503).json({ error: "Failed to send OTP. Service unavailable." });
        }

        return res.status(200).json({
            message: "OTP sent successfully.",
            sessionId: OTPStatus.sessionId || "mock-session-id", // Replace with real sessionId if using a service
        });
    } catch (error) {
        console.error("GetOTP Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const verifyOTP = async (req, res) => {
    try {
        const { phoneNumber, OTP, sessionId } = req.body;

        if (!phoneNumber || !OTP || !sessionId) {
            return res.status(400).json({ error: "All fields are required: phoneNumber, OTP, and sessionId." });
        }

        const OTPStatus = await verifyOTPWithPhoneNumber(phoneNumber, OTP, sessionId);

        if (!OTPStatus) {
            return res.status(400).json({ error: "Invalid or expired OTP." });
        }

        const user = await prisma.user.findUnique({
            where: { phoneNumber: phoneNumber },
            select: {
                id: true,
                fname : true,
                lname: true,
                phoneNumber: true,
                email: true,
                age : true,
                gender : true,
            }
        });


        if (!user) {
            return res.status(200).json({
                message: "OTP verified successfully, but user not found.",
                userStatus: 404,
            });
        }


        return res.status(200).json({
            message: "OTP verified successfully.",
            userStatus: 200,
            user: user
        });
    } catch (error) {
        console.error("verifyOTP Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const createUser = async (req, res) => {
    try {
        const { fname, lname, phoneNumber, email, age , gender} = req.body;

        if (!fname || !lname || !phoneNumber || !email || !age || !gender) {
            return res.status(400).json({ error: "All fields (fname, lname, phoneNumber, email, age, gender) are required." });
        }

    

        const newUser = await prisma.user.create({
            data: {
                fname,
                lname,
                phoneNumber,
                email,
                age : Number(age),
                gender
            }
        });

        return res.status(201).json({
            message: "User created successfully.",
            user: newUser
        });

    } catch (error) {
        // if already exists
        if (error.code === 'P2002') {
            return res.status(409).json({ error: "User with this phone number or email already exists." });
        }
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// update user details put req
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fname, lname, email , age , gender} = req.body;


        console.log("Updating user:", { id, fname, lname, email, age, gender });
        if (!fname || !lname  || !email || !age || !gender) {
            return res.status(400).json({ error: "All fields (fname, lname, phoneNumber, email, age, gender) are required." });
        }

        const updatedUser = await prisma.user.update({
            where: { id: +id },
            data: {
                fname,
                lname,
                email,
                age: Number(age),
                gender
            }
        });

        return res.status(200).json({
            message: "User updated successfully.",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// get user details by id
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;  
        if (!id) {
            return res.status(400).json({ error: "User ID is required." });
        }

        const user = await prisma.user.findUnique({
            where: { id: +id },
            select: {
                id: true,
                fname: true,
                lname: true,
                phoneNumber: true,
                email: true,
                age: true,
                gender: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        return res.status(200).json({
            message: "User retrieved successfully.",
            user: user
        });
    } catch (error) {
        console.error("Error retrieving user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


