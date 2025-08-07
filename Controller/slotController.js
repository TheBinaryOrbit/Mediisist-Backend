import { parse, format, addMinutes, isBefore } from "date-fns";
import prisma from "../Utils/prismaClient.js";

export const addSlots = async (req, res) => {
  const { timingId, startTime, endTime, timeFrame } = req.body;

  if (!timingId || !startTime || !endTime || !timeFrame) {
    return res.status(400).json({
      error: "Timing ID, start time, end time, and time frame are required",
    });
  }

  console.log("Adding slots for timing ID:", timingId);
  console.log("Start time:", startTime, "End time:", endTime, "Time frame:", timeFrame);

  try {
    const slots = [];
    const timeFormat = "HH:mm";

    // Parse start and end time as Date objects
    let start = parse(startTime, timeFormat, new Date());
    const end = parse(endTime, timeFormat, new Date());

    // Generate time slots
    while (
      isBefore(addMinutes(start, timeFrame), addMinutes(end, 1)) // include last slot
    ) {
      const slotStart = format(start, timeFormat);
      const slotEnd = format(addMinutes(start, timeFrame), timeFormat);

      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        timmingsId: Number(timingId),
      });

      start = addMinutes(start, timeFrame);
    }

    // Bulk insert all slots
    const created = await prisma.slots.createMany({
      data: slots,
      skipDuplicates: true, // Optional: avoid duplicates if already exist
    });

    return res.status(201).json({
      message: "Slots created successfully",
      totalCreated: created.count,
    });
  } catch (error) {
    console.error("Error creating slots:", error);
    return res.status(500).json({ error: "Failed to create slots" });
  }
};


export const getSlots = async (req, res) => {
    const { timingId } = req.params;

    try {
        const slots = await prisma.slots.findMany({
            where: { timmingsId: Number(timingId) }
        });

        console.log("Fetched slots:", slots);

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

        console.log("Deleting slot with ID:", slotId);

        
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