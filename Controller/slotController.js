import prisma from "../Utils/prismaClient.js";

export const addSlots = async (req, res) => {
    const { timingId, startTime, endTime } = req.body;

    try {

        if (!timingId || !startTime || !endTime) {
            return res.status(400).json({ error: "Timing ID, start time, and end time are required" });
        }

        const newSlot = await prisma.slots.create({
            data: {
                startTime,
                endTime,
                timmingsId : Number(timingId)
            }
        });

        if (!newSlot) {
            return res.status(500).json({ error: "Failed to create slot" });
        }
        
        res.status(201).json(newSlot);
    } catch (error) {
        res.status(500).json({ error: "Failed to create slot" });
    }
}

export const getSlots = async (req, res) => {
    const { timingId } = req.params;

    try {
        const slots = await prisma.slots.findMany({
            where: { timmingsId: Number(timingId) }
        });

        if (slots.length === 0) {
            return res.status(404).json({ error: "No slots found for the specified timing ID" });
        }

        res.status(200).json(slots);
    } catch (error) {
        console.error("Error fetching slots:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteSlot = async (req, res) => {
    const { slotId } = req.params;

    try {
        const deletedSlot = await prisma.slots.delete({
            where: { id: Number(slotId) }
        });

        if (!deletedSlot) {
            return res.status(404).json({ error: "Slot not found" });
        }

        res.status(200).json({ message: "Slot deleted successfully", slot: deletedSlot });
    } catch (error) {
        console.error("Error deleting slot:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}   