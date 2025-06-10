import prisma from "../Utils/prismaClient.js";
import { generateSessionKey } from '../Utils/sessionKeyGenerator.js';
import sendMessage from "../Utils/Sendmessage.js";
import { sentNotificationToCallSupport } from "../Utils/firebaseNotification.js";


export const addRide = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;

    // Validate required fields
    if (!name || !phoneNumber) {
      return res.status(400).json({ error: "Name and Phone Number are required" });
    }

    if (name.trim() === "") {
      return res.status(400).json({ error: "Name cannot be empty" });
    }

    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({ error: "Phone Number must be a valid 10-digit Indian number" });
    }

    let sessionKey;
    let newRide;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      sessionKey = generateSessionKey();

      try {
        newRide = await prisma.rides.create({
          data: {
            name,
            phoneNumber,
            sessionKey,
          },
        });
        break; // success
      } catch (error) {
        // Retry if sessionKey is duplicate
        if (error.code === 'P2002' && error.meta?.target?.includes("sessionKey")) {
          attempts++;
        } else {
          throw error; // some other error
        }
      }
    }

    if (!newRide) {
      return res.status(500).json({ error: "Failed to generate a unique session key after multiple attempts" });
    }

    sendMessage(newRide.sessionKey);
    sentNotificationToCallSupport({ name: name, phoneNumber: phoneNumber })

    return res.status(201).json({
      message: "Ride created successfully",
      ride: newRide
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error while creating ride" });
  }
};

export const updateRideLocationBySessionKey = async (req, res) => {
  try {
    const sessionKey = req.params.session;
    const { lat, lng } = req.body;

    console.log(lat, lng)

    if (!sessionKey) {
      return res.status(400).json({ error: "Session key is required" });
    }

    if (!lat || !lng) {
      return res.status(400).json({ error: "Both latitude and longitude are required" });
    }

    const ride = await prisma.rides.update({
      where: { sessionKey },
      data: {
        lat: String(lat),
        lng: String(lng),
        isLocationAvail: true
      },
    });

    return res.status(200).json({
      message: "Ride location updated successfully",
      ride,
    });

  } catch (error) {
    console.error("Error updating ride location:", error);
    return res.status(500).json({ error: "Internal Server Error while updating ride location" });
  }
};

export const acceptRideByCustomerSupport = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { customerSupportId } = req.body;

    if (!rideId || !customerSupportId) {
      return res.status(400).json({ error: "Ride ID and Customer Support ID are required" });
    }

    const ride = await prisma.rides.findUnique({ where: { id: +rideId } });
    if (!ride) return res.status(404).json({ error: "Ride not found" });

    if (ride.isCallAccepted) {
      return res.status(400).json({ error: "Ride is already accepted by another customer support" });
    }

    const updatedRide = await prisma.rides.update({
      where: { id: +rideId },
      data: {
        isCallAccepted: true,
        customerSupportId: +customerSupportId,
      },
    });

    return res.status(200).json({
      message: "Ride accepted by customer support",
      ride: updatedRide,
    });
  } catch (error) {
    console.error("Error accepting ride:", error);
    return res.status(500).json({ error: "Internal Server Error while accepting ride" });
  }
};

export const acceptRideByAmbulancePartner = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { ambulancePartnerId } = req.body;

    if (!rideId || !ambulancePartnerId) {
      return res.status(400).json({ error: "Ride ID and Ambulance Partner ID are required" });
    }

    const ride = await prisma.rides.findUnique({ where: { id: +rideId } });
    if (!ride) return res.status(404).json({ error: "Ride not found" });

    if (ride.isRideAcceptedBy) {
      return res.status(400).json({ error: "Ride is already accepted by another ambulance partner" });
    }

    const updatedRide = await prisma.rides.update({
      where: { id: +rideId },
      data: {
        isRideAcceptedBy: true,
        ambulancePartnerId: +ambulancePartnerId,
      },
    });

    return res.status(200).json({
      message: "Ride accepted by ambulance partner",
      ride: updatedRide,
    });
  } catch (error) {
    console.error("Error accepting ride:", error);
    return res.status(500).json({ error: "Internal Server Error while accepting ride" });
  }
};


export const getRideDetails = async (req, res) => {
  try {
    const sessionKey = req.params.session;
    if (!sessionKey) {
      return res.status(400).json({ error: "Session key is required" });
    }

    const ride = await prisma.rides.findUnique({
      where: { sessionKey },
    });

    if (!ride) return res.status(404).json({ error: "Ride not found" });
    return res.status(200).json({
      message: "Ride Fetched Sucessfully",
      ride: ride,
    });
  } catch (error) {
    console.error("Error accepting ride:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export const getCustomerSupportRide = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    const ride = await prisma.rides.findMany({
      where: {
        callAcceptedBy : (+id)
      },
    });

    if (!ride) return res.status(404).json({ error: "Rides not found" });
    return res.status(200).json({
      message: "Ride Fetched Sucessfully",
      ride: ride,
    });
  } catch (error) {
    console.error("Error accepting ride:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


export const getAmbulancePartnerRide = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    const ride = await prisma.rides.findMany({
      where: {
         rideAcceptedBy : +id
      },
    });

    if (!ride) return res.status(404).json({ error: "Rides not found" });
    return res.status(200).json({
      message: "Ride Fetched Sucessfully",
      ride: ride,
    });
  } catch (error) {
    console.error("Error accepting ride:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}