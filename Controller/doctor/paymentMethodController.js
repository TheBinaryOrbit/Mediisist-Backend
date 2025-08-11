import prisma from "../../Utils/prismaClient.js";

export const addPaymentMethod = async (req, res) => {
    try {
        const { doctorId, bankName, accountNumber, ifscCode, bankeeName } = req.body;

        if (!doctorId || !bankName || !accountNumber || !ifscCode || !bankeeName) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newPayment = await prisma.paymentMethod.create({
            data: {
                doctorId: Number(doctorId),
                bankName,
                accountNumber,
                ifscCode,
                bankeeName,
            },
        });

        return res.status(201).json(newPayment);
    } catch (error) {
        logError("Error adding payment method:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// 🔍 Get Payment Method by ID
export const getPaymentMethodByDoctorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).json({ error: "PaymentMethod ID is required" });

        const payment = await prisma.paymentMethod.findUnique({
            where: { doctorId: +id },
            include: { doctor: true },
        });

        if (!payment) return res.status(404).json({ error: "Payment method not found" });

        return res.status(200).json(payment);
    } catch (error) {
        logError("Error fetching payment method:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};