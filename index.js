import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { connectDb } from "./config/db.js";
import { twilioRoutes } from "./routes/twilioRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
const urlencoded = bodyParser.urlencoded;
app.use(express.json());
app.use(urlencoded({ extended: false }));
connectDb();

app.use("/api/twilio", twilioRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server is up at Port.", process.env.PORT);
});
