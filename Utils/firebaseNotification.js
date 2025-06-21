import prisma from "./prismaClient.js";
import { firebaseadmin } from "../firebase/firebaseadmin.js";


export const sentNotificationToCallSupport = async ({ name, phoneNumber }) => {
  const support = await getAllCustomerSupport(); // Should return array of tokens

  console.log(support )
  if (!support || support.length === 0) {
    console.log("No support tokens found");
    return 400;
  }

  const message = {
    tokens: support,
    data: {
      "message": `{\"name\": \"${name}\", \"phoneNumber\": \"${phoneNumber}\"}`
    }
  };

  try {
    const response = await firebaseadmin.messaging().sendEachForMulticast(message);
    // console.log(response.responses);
    return 200;
  } catch (error) {
    console.error(error);
    return 500;
  }
};




export const sentNotificationToAmbulancePartner = async ({ name, phoneNumber, lat = "28.752993", lng = "77.497431" }) => {
  const partner = await getAllAmbulancePartners()

  console.log(partner);

  const message = {
    data: {
      "message": `{\"name\": \"${name}\", \"phoneNumber\": \"${phoneNumber}\"}`
    },
    tokens: partner
  };
  try {
    const response = await firebaseadmin.messaging().sendEachForMulticast(message);
    return 200
  } catch (error) {
    console.log(error)
    return 500
  }
}



const getAllCustomerSupport = async () => {
  const arr = await prisma.customerSupport.findMany({
    where: {
      isOnline: true
    },
    select: {
      fcmToken: true
    }
  });

  return arr.map((support) => {
    return support.fcmToken
  })


}

const getAllAmbulancePartners = async () => {
  const arr = await prisma.ambulancePartner.findMany({
    where: {
      isOnline: true
    },
    select: {
      fcmToken: true
    }
  });

  return arr.map((partner) => {
    return partner.fcmToken
  });
}