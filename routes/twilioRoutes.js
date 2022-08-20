import express from "express";
import { Call } from "../models/Call.js";
import { client, twilio } from "../config/twilio.js";
const VoiceResponse = twilio.twiml.VoiceResponse;
const router = express.Router();

router.post("/", twilio.webhook({ validate: false }), async (req, res) => {
  try {
    console.log(`the body for this ${req.url} is ${JSON.stringify(req.body)}`);
    const { CallSid, Caller } = req.body;
    await Call.create({
      callId: CallSid,
      phoneNumber: Caller,
      callStatus: "in-progress",
    });
    const bot = new VoiceResponse();
    const botResponse = bot.gather({
      numDigits: 1,
      action: "/api/twilio/call-process",
      method: "POST",
    });
    botResponse.say(
      "Hello. Press 1 to call Moiz and Press 2 to leave a voicemail."
    );

    res.type("text/xml");
    res.send(bot.toString());
  } catch (error) {
    console.log("the error is ", error);
    throw new Error("Unable to call.");
  }
});

router.post(
  "/call-process",
  twilio.webhook({ validate: false }),
  async (req, res) => {
    const bot = new VoiceResponse();
    try {
      const { Digits, CallSid } = req.body;
      console.log(
        `the body for this ${req.url} is ${JSON.stringify(req.body)}`
      );
      const callType = { 1: "Call Forwarding", 2: "Voicemail" };
      await Call.updateOne(
        { callId: CallSid },
        { callType: callType[Digits] ?? "Wrong Option" }
      );
      if (req.body.Digits) {
        switch (Digits) {
          case "1":
            bot.say("Connecting you to Moiz's phone Number.");
            bot.dial("+923223419894", {
              method: "POST",
              action: "/api/twilio/call-forwarding",
            });
            break;
          case "2":
            bot.say("Hello. Please leave a message after the beep.");
            bot.record({
              timeout: 5,
              maxLength: 5,
              method: "POST",
              action: "/api/twilio/call-record",
              recordingStatusCallbackEvent: "completed",
              recordingStatusCallbackMethod: "POST",
              recordingStatusCallback: "/api/twilio/record-completed",
            });
            break;
          default:
            bot.redirect("/api/twilio/");
        }
      }
      res.type("text/xml");
      res.send(bot.toString());
    } catch (error) {
      console.log("the error is ", error);
      throw new Error("Unable to call.");
    }
  }
);

router.post(
  "/call-forwarding",
  twilio.webhook({ validate: false }),
  async (req, res) => {
    const bot = new VoiceResponse();
    try {
      console.log(
        `the body for this ${req.url} is ${JSON.stringify(req.body)}`
      );
      const {
        CallSid,
        DialCallStatus,
        DialCallDuration,
        DialBridged,
        CallStatus,
      } = req.body;
      await Call.updateOne(
        { callId: CallSid },
        {
          callStatus: DialCallStatus,
          forwardedCallBridged: DialBridged,
          forwardedCallDuration: DialCallDuration,
          forwardedCallStatus: DialCallStatus,
        }
      );
      if (CallStatus === "in-progress") {
        res.type("text/xml");
        res.send(bot.toString());
      } else {
        bot.hangup();
        res.type("text/xml");
        res.send(bot.toString());
      }
    } catch (error) {
      console.log("the error is ", error);
      throw new Error("Unable to forward call.");
    }
  }
);

router.post(
  "/call-record",
  twilio.webhook({ validate: false }),
  async (req, res) => {
    const bot = new VoiceResponse();
    try {
      const { CallSid } = req.body;
      console.log(
        `the body for this ${req.url} is ${JSON.stringify(req.body)}`
      );
      await Call.updateOne({ callId: CallSid }, { callStatus: "completed" });
      bot.hangup();
      res.type("text/xml");
      res.send(bot.toString());
    } catch (error) {
      console.log("the error is ", error);
      throw new Error("Unable to update call status.");
    }
  }
);

router.post(
  "/record-completed",
  twilio.webhook({ validate: false }),
  async (req, res) => {
    const bot = new VoiceResponse();
    try {
      const { CallSid, RecordingSid, RecordingUrl, RecordingDuration } =
        req.body;
      console.log(
        `the body for this ${req.url} is ${JSON.stringify(req.body)}`
      );
      res.type("text/xml");
      await Call.updateOne(
        { callId: CallSid },
        {
          recordingId: RecordingSid,
          recordingUrl: `${RecordingUrl}.mp3`,
          recordingDuration: RecordingDuration,
        }
      );
      res.send(bot.toString());
    } catch (error) {
      console.log("the error is ", error);
      throw new Error("Unable to update recorded calls.");
    }
  }
);

router.get("/activity", async (req, res) => {
  try {
    const calls = await Call.find({});
    res.send(calls);
  } catch (error) {
    throw new Error("Unable to retrieve calls.");
  }
});

export { router as twilioRoutes };
