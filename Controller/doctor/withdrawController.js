import prisma from "../../Utils/prismaClient.js";
// ➕ Add Withdraw
export const addWithdraw = async (req, res) => {
    try {
        const { doctorId, amount } = req.body;

        if (!doctorId || !amount) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const doctor = await prisma.doctor.findUnique({
            where: {
                id: +doctorId
            },
            include : {
                paymentMethod: true
            }
        });

        if(!doctor.paymentMethod) return res.status(400).json({ error: "Payment method not found Please add Bank Details" });

        if (+amount > +doctor.amount) return res.status(402).json({ error: "Insufficient balance" });

        await prisma.doctor.update({
            where: {
                id: +doctorId
            },
            data: {
                amount: {
                    decrement: (+amount)
                }
            }
        })


        const withdraw = await prisma.withdraw.create({
            data: {
                doctorId: +doctorId,
                amount: +amount,
                paymentMethodId: doctor.paymentMethod.id,
            },
        });

        return res.status(201).json(withdraw);
    } catch (error) {
        logError(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


// 🔍 Get Withdraw by ID
export const getWithdrawByDoctorId = async (req, res) => {
    try {
        const { id } = req.params;

        const withdraw = await prisma.withdraw.findMany({
            where: { doctorId: Number(id) },
            include: {
                doctor: true,
                paymentMethod: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!withdraw) return res.status(404).json({ error: "Withdraw not found" });
        return res.status(200).json(withdraw);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// 📃 Get All Withdraws
export const getAllWithdraws = async (req, res) => {
    try {
        const withdraws = await prisma.withdraw.findMany({
            where : {
                status : String(req.query.status).toUpperCase()
            },
            include: {
                doctor: true,
                paymentMethod: true,
            },
            orderBy: { id: "desc" },
        });

        return res.status(200).json({
            message : "Withdraws Request Fetched Sucessfully",
            withdraw : withdraws
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


// ✅ Update Withdraw Status
export const updateWithdrawStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status  , doctorId , amount } = req.body;


        // Validate ID and Status
        if (!id || !status || !doctorId || !amount) {
            return res.status(400).json({ error: "Withdraw ID and status are required" });
        }

        // Optional: Validate allowed statuses
        const allowedStatuses = ["PENDING", "SUCCESS", "REJECTED"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }


        if(status == 'REJECTED'){
            await prisma.doctor.update({
                where : {
                    id : +doctorId
                },
                data : {
                  amount : {
                    increment : +amount
                  }  
                }
            })
        }

        const updatedWithdraw = await prisma.withdraw.update({
            where: { id: Number(id) },
            data: { status },
        });

        return res.status(200).json({ message: "Status updated successfully", data: updatedWithdraw });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};