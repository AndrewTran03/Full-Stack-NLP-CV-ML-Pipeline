import express from "express";
import { onSuccessMsg } from "./utils";
import LOGGER from "../utils/logger";

const router = express.Router();

router.post("/api/simple-ml", (req, res) => {
  const { message } = req.body as { message: string };
  LOGGER.debug(message);
  return res.status(200).json(onSuccessMsg("Simple ML API!"));
});

export { router as SIMPLE_ML_ROUTER };
