import prisma from "../Utils/prismaClient.js";
import { generateSessionKey } from '../Utils/sessionKeyGenerator.js';
import sendMessage from "../Utils/SendMessage.js";
import { sentNotificationToCallSupport, sentNotificationToAmbulancePartner } from "../Utils/firebaseNotification.js";


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

    await sendMessage(newRide.sessionKey, phoneNumber, name);
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

    sentNotificationToAmbulancePartner({ name: ride.name, phoneNumber: ride.phoneNumber, lat: ride.lat, lng: ride.lng })

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

    console.log(customerSupportId)

    const ride = await prisma.rides.findUnique({ where: { id: +rideId } });
    if (!ride) return res.status(404).json({ error: "Ride not found" });

    if (ride.isCallAccepted) {
      return res.status(409).json({ error: "Ride is already accepted by another customer support" });
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

    if (ride.isRideAccepted) {
      return res.status(409).json({ error: "Ride is already accepted by another ambulance partner" });
    }

    const updatedRide = await prisma.rides.update({
      where: { id: +rideId },
      data: {
        isRideAccepted: true,
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

    const matchedCondition = {
      customerSupportId : +id, 
    };


    console.log(req.query);
    // accepted but not completed
    if(req.query.status == 'active'){
      matchedCondition.isCallAccepted = true
      matchedCondition.isCallCompleted = false
    }

    // accepted and completed
    if(req.query.status == 'complete'){
      matchedCondition.isCallAccepted = true
      matchedCondition.isCallCompleted = true
    }


    const ride = await prisma.rides.findMany({
      where: matchedCondition,
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        isLocationAvail: true,
        isCallAccepted: true,
        isRideAccepted: true,
        createdAt: true,
        isCallCompleted : true
      }
    });

    console.log(ride);

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
        rideAcceptedBy: +id
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


export const getPendingCallsList = async (req, res) => {
  try {
    const ride = await prisma.rides.findMany({
      where: {
        isCallAccepted: false,
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        isLocationAvail: true,
        isCallAccepted: true,
        isRideAccepted: true,
        createdAt: true
      },
      orderBy : {
        createdAt : 'asc'
      }
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

export const getPendingAmbulanceList = async (req, res) => {
  try {
    const ride = await prisma.rides.findMany({
      where: {
        isRideAccepted: false
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


export const completeRideByCustomerSupport = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { customerSupportId } = req.body;

    if (!rideId || !customerSupportId) {
      return res.status(400).json({ error: "Ride ID and Customer Support ID are required" });
    }

    console.log(rideId , customerSupportId)


    const ride = await prisma.rides.findUnique({ where: { id: +rideId } });
    if (!ride) return res.status(404).json({ error: "Ride not found" });

    const updatedRide = await prisma.rides.update({
      where: { 
        id: +rideId,
        customerSupportId : +customerSupportId,
        isCallAccepted : true,
      },
      data: {
        isCallCompleted : true,
      },
    });

    return res.status(200).json({
      message: "Ride Completed by customer support",
    });
  } catch (error) {
    console.error("Error accepting ride:", error);
    return res.status(500).json({ error: "Internal Server Error while accepting ride" });
  }
};


export const deleteRide = async (req, res) => {
  try {
    const { rideId } = req.params;

    if (!rideId) {
      return res.status(400).json({ error: "Ride ID are required" });
    }

    console.log(rideId)

    const ride = await prisma.rides.delete({
      where : {
        id : +rideId
      }
    })

    console.log(ride);
    if (!ride) return res.status(404).json({ error: "Ride not found" });

    return res.status(200).json({
      message: "Ride Deleted Sucessfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error while Deleting ride" });
  }
};


export const sendSmsAgain = async (req, res) => {
  try {
    const { rideId } = req.params;

    console.log("sms sent again")
    if (!rideId) {
      return res.status(400).json({ error: "Ride ID are required" });
    }

    const ride = await prisma.rides.findUnique({
      where : {
        id : +rideId
      }
    })

    if (!ride) return res.status(404).json({ error: "Ride not found" });

    await sendMessage(ride.sessionKey , ride.phoneNumber , ride.name)

    return res.status(200).json({
      message: "Message send Sucessfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error Sending Message" });
  }
};


