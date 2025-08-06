import express from "express";

import { groqHandler } from "../controllers/groqController";

const groqRouter = express.Router();

groqRouter.post("/", groqHandler);

export default groqRouter;