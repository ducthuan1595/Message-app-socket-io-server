import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import initial from "./router";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express Typescript Server");
});

initial(app);

const url_mongoDB = process.env.ACCESS_URL_MONGODB;
if (url_mongoDB) {
  mongoose
    .connect(url_mongoDB)
    .then((res) => {
      console.log("Connected to mongoDB");
      app.listen(port, () => {
        console.log("Server is running on" + port);
      });
    })
    .catch((err) => console.log(err));
}
