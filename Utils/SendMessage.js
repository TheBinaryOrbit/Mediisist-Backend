import axios from 'axios';
import twilio from 'twilio';


/*
// ============================twilio SMS ============================================ //

const accountSid = process.env.YOUR_TWILIO_ACCOUNT_SID;
const authToken = process.env.YOUR_TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.YOUR_TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendMessage = (sessionKey, phoneNumber , name) => {
    const messageBody = `Hello ${name} please let us know you location http://localhost:3000/getlocation/${sessionKey}`;

    console.log(`http://localhost:3000/getlocation/${sessionKey}`);
    client.messages
        .create({
            body: messageBody,
            from: twilioPhoneNumber,
            to: `+91${phoneNumber}`,
        })
        .then(message => console.log(`Message sent with SID: ${message.sid}`))
        .catch(error => console.error(`Failed to send message: ${error.message}`));
};

// ============================twilio SMS ============================================ //
*/


// ============================twilio SMS ============================================ //



// ============================Fast2SMS ============================================ //
/*
const sendMessage = async (sessionKey, phoneNumber, name) => {
    try {
        const data = {
            "route": "q",
            "message": `Hello ${name} please let us know you location http://localhost:3000/getlocation/${sessionKey}`,
            "flash": 0,
            "numbers": `${phoneNumber}`,
        }

        const res = await axios.post('https://www.fast2sms.com/dev/bulkV2', data, {
            headers: {
                "authorization": process.env.API_KEY,
                "Content-Type": "application/json"
            }
        })

        if(res.status == 200 || res.status == 201){
            console.log("SMS Sent Sucessfully")
        }
    } catch (error) {
        console.error(error.response.data);
        console.error(`Failed to send message: ${error}`)
    }
}
*/
// ============================Fast2SMS ============================================ //


const sendMessage = async (sessionKey, phoneNumber, name) => {
    console.log(`http://localhost:3000/getlocation/${sessionKey}`)
}

export default sendMessage;
