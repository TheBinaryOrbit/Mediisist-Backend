import axios from "axios";

const API_KEY = process.env.OTP_KEY;

export const sendOTP = async (phoneNumber) => {
    try {
        if (phoneNumber == '6203821043') {
            return {
                status: true,
                sessionId: 'test-session-id' // For testing purposes, return a mock session ID
            };
        }

        
        const response = await axios.get(`https://2factor.in/API/V1/${API_KEY}/SMS/${phoneNumber}/AUTOGEN2/OTP on Login`);


        const { Status, Details } = response.data;

        console.log("OTP Response:", response.data);

        if (Status === "Success") {
            return {
                status: true,
                sessionId: Details
            };
        } else {
            return {
                status: false,
                message: "Failed to send OTP"
            };
        }
    } catch (error) {
        console.error("Error sending OTP:", error.response?.data || error.message);
        return {
            status: false,
            message: "Error sending OTP"
        };
    }
};


export const verifyOTPWithPhoneNumber = async (phoneNumber, OTP, sessionId) => {
    try {
        if (phoneNumber == '6203821043' && OTP == '123456') {
            return true; // For testing purposes, bypass OTP verification
        }
        const response = await axios.get(`https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${OTP}`);
        const { Status, Details } = response.data;

        if (Status === "Success" && Details === "OTP Matched") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("OTP verification failed:", error.response?.data || error.message);
        return false;
    }
};