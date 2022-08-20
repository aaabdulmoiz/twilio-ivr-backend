import mongoose from "mongoose";

const callSchema = mongoose.Schema(
  {
    callId: {
      type: String,
    },
    callStatus: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    callType: {
      type: String,
    },
    forwardedCallBridged: {
      type: Boolean,
    },
    forwardedCallDuration: {
      type: String,
    },
    forwardedCallStatus: {
      type: String,
    },
    recordingId: {
      type: String,
    },
    recordingUrl: {
      type: String,
    },
    recordingDuration: {
      type: String,
    },
  },
  { timestamps: true }
);

const Call = mongoose.model("call", callSchema);

export { Call };
