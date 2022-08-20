import "dotenv/config";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
import twilio from "twilio";

const client = twilio(accountSid, authToken);

export { client, twilio };
