import prisma from "./prismaClient.js";
import { firebaseadmin } from "../firebase/firebaseadmin.js";


export const sentNotificationToCallSupport = async ({ name, phoneNumber }) => {
    const support = getAllCustomerSupport()

    console.log(support);

    const message = {
        notification: {
            title: "Hello Team",
            body: "New Ambulance Request Raised"
        },
        data: {
            message: JSON.stringify({
                name: name,
                phoneNumber: phoneNumber,
            })
        },
        tokens: support
    };
    try {
        const response = await firebaseadmin.messaging().sendEachForMulticast(message);
        return 200
    } catch (error) {
        console.log(error)
        return 500
    }
}


export const sentNotificationToAmbulancePartner = async ({ name, phoneNumber , lat , lng }) => {
    const partner = getAllAmbulancePartners()

    console.log(partner);

    const message = {
        notification: {
            title: "Hello Team",
            body: "New Ambulance Request Raised"
        },
        data: {
            message: JSON.stringify({
                name: name,
                phoneNumber: phoneNumber,
                lat : lat,
                lng : lng,
            })
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
    return await prisma.customerSupport.findMany({
        where: {
            isOnline: true
        },
        select: {
            fcmToken: true
        }
    });
}

const getAllAmbulancePartners = async () => {
    return await prisma.ambulancePartner.findMany({
        where: {
            isOnline: true
        },
        select: {
            fcmToken: true
        }
    });
}