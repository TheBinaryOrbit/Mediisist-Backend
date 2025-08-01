import prisma from "../Utils/prismaClient.js";

// updatetiming details of a doctor
export const updateTimingDetails = async (req, res) => {
    const { doctorId } = req.params;
    const { day, startTime, endTime, isAvailable, fee } = req.body;

    try {
        if (isAvailable == true && (!day || !startTime || !endTime || !fee)) {
            return res.status(400).json({ error: "Day, start time, end time, and fee are required" });
        }

        let updatedTiming = null

        if (isAvailable == false) {
            updatedTiming = await prisma.timings.updateMany({
                where: { doctorId: Number(doctorId), day },
                data: {
                    isAvailable,
                }
            });
        }
        else {
            updatedTiming = await prisma.timings.updateMany({
                where: { doctorId: Number(doctorId), day },
                data: {
                    startTime,
                    endTime,
                    fee
                }
            });
        }

        if(!updatedTiming) return res.status(404).json({ error: "No timing found for the specified day" });


        res.status(200).json({ message: "Timing details updated successfully", timing: updatedTiming });
    } catch (error) {
        console.error("Error updating timing details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


// get timing details of a doctor
export const getTimingDetails = async (req, res) => {
    const { doctorId } = req.params;

    try {
        let timings = await prisma.timings.findMany({
            where: { doctorId: Number(doctorId) }
        });

        if (timings.length === 0) {
            timings = await prisma.timings.createMany({
                data: [
                    { day: 'Monday', doctorId },
                    { day: 'Tuesday', doctorId },
                    { day: 'Wednesday', doctorId },
                    { day: 'Thursday', doctorId },
                    { day: 'Friday', doctorId },
                    { day: 'Saturday', doctorId },
                    { day: 'Sunday', doctorId },
                ],
            });
        }

        res.status(200).json(timings);
    } catch (error) {
        console.error("Error fetching timing details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};