import prisma from "../Utils/prismaClient.js";
import { uploadDoctorImage } from "../Storage/doctor.js";
import { generatePassword } from "../Utils/password.js";
import deleteImage from "../Utils/deleteImage.js";
import addTimingDetails from "../Utils/createTiming.js";

// Add a new Doctor
export const addDoctor = async (req, res) => {
    uploadDoctorImage(req, res, async (err) => {
        try {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            const imageUrl = req.files?.image ? req.files.image[0].filename : null;
            const { fName, lName, displayName, phoneNumber, email, password, clinicName, clinicAddress, lat, lng } = req.body;

            // Validate required fields
            if (!fName || !lName || !displayName || !phoneNumber || !email || !password) {
                return res.status(400).json({ error: "All fields are required" });
            }

            // Hash password
            const hashedPassword = generatePassword(password);

            // Create new doctor
            const newDoctor = await prisma.doctor.create({
                data: {
                    fName,
                    lName,
                    displayName,
                    phoneNumber,
                    email,
                    password: hashedPassword,
                    clinicName,
                    clinicAddress,
                    lat,
                    lng,
                    imageUrl: imageUrl ? `doctorimages/${imageUrl}` : null,
                }
            });

            // create timings for the doctor
            try {
                const timings = await addTimingDetails(newDoctor.id);
            } catch (error) {
                console.error("Error creating timing details:", error);
                res.status(201).json({ message: "Doctor added successfully but failed to create timing details", doctor: newDoctor });
            }

            res.status(201).json({ message: "Doctor added successfully", doctor: newDoctor });

        } catch (error) {
            // Unique constraint failed
            if (error.code === 'P2002') {
                return res.status(400).json({ error: "Phone number already exists" });
            }
            console.error("Error adding doctor:", error);

            res.status(500).json({ error: "Internal server error" });
        }
    });
}

// get all doctors)
export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await prisma.doctor.findMany({
            select: {
                id: true,
                fName: true,
                lName: true,
                displayName: true,
                phoneNumber: true,
                email: true,
                clinicName: true,
                clinicAddress: true,
                lat: true,
                lng: true,
                imageUrl: true,
            }
        });
        res.status(200).json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await prisma.doctor.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                fName: true,
                lName: true,
                displayName: true,
                phoneNumber: true,
                email: true,
                clinicName: true,
                clinicAddress: true,
                lat: true,
                lng: true,
                imageUrl: true,
                timings: {
                    select: {
                        id: true,
                        from: true,
                        to: true,
                        currentlyWorking: true
                    }
                }
            }
        });
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        res.status(200).json(doctor);
    } catch (error) {
        console.error("Error fetching doctor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const deleteDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await prisma.doctor.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message: "Doctor deleted successfully", doctor });
    } catch (error) {
        console.error("Error deleting doctor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// update doctor
export const updateDoctorDetails = async (req, res) => {
    const { id } = req.params;
    const { fName, lName, displayName, phoneNumber, email} = req.body;

    try {
        const updatedDoctor = await prisma.doctor.update({
            where: { id: Number(id) },
            data: {
                fName,
                lName,
                displayName,
                phoneNumber,
                email
            }
        });
        res.status(200).json({ message: "Doctor details updated successfully", doctor: updatedDoctor });
    } catch (error) {
        console.error("Error updating doctor details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


// update clinic details
export const updateClinicDetails = async (req, res) => {
    const { id } = req.params;
    const { clinicName, clinicAddress, lat, lng } = req.body;

    try {
        const updatedDoctor = await prisma.doctor.update({
            where: { id: Number(id) },
            data: {
                clinicName,
                clinicAddress,
                lat,
                lng
            }
        });
        res.status(200).json({ message: "Clinic details updated successfully", doctor: updatedDoctor });
    } catch (error) {
        console.error("Error updating clinic details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// chage password
export const changePassword = async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    try {
        const doctor = await prisma.doctor.findUnique({
            where: { id: Number(id) },
        });

        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        // Verify old password
        if (doctor.password !== generatePassword(oldPassword)) {
            return res.status(400).json({ error: "Old password is incorrect" });
        }

        // Update with new password
        const updatedDoctor = await prisma.doctor.update({
            where: { id: Number(id) },
            data: {
                password: generatePassword(newPassword),
            }
        });

        res.status(200).json({ message: "Password updated successfully", doctor: updatedDoctor });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// edit progile imagee
export const editProfileImage = async (req, res) => {
    uploadDoctorImage(req, res, async (err) => {
        try {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            const { id } = req.params;
            const imageUrl = req.files?.image ? req.files.image[0].filename : null;

            if (!imageUrl) {
                return res.status(400).json({ error: "Image file is required" });
            }

            // delete old image if exists
            const doctor = await prisma.doctor.findUnique({ where: { id: Number(id) } });

            if (doctor?.imageUrl) {
                const oldImagePath = `./public/${doctor.imageUrl}`;
                deleteImage(oldImagePath);
            }

            const updatedDoctor = await prisma.doctor.update({
                where: { id: Number(id) },
                data: { imageUrl: `doctorimages/${imageUrl}` }
            });

            res.status(200).json({ message: "Profile image updated successfully", doctor: updatedDoctor });
        } catch (error) {
            console.error("Error updating profile image:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
}