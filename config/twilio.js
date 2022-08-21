import "dotenv/config";
const accountSid = "AC4100f722d38ba234bcc0c43d956c5200";
const authToken = "12f36622b8e023f9a1deb91d88490aeb";
import twilio from "twilio";

const client = twilio(accountSid, authToken);

export { client, twilio };
