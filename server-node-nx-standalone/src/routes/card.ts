import express from "express";
import { HTTP_STATUS_CODE, onSuccessMsg } from "./utils";
import LOGGER from "../utils/logger";

const router = express.Router();

router.get("/api/card", (req, res) => {
  // const { id } = req.body as { id: string };
  // console.log(id);
  LOGGER.info("GOT HERE");
  return res.status(HTTP_STATUS_CODE.OK).json(onSuccessMsg("Ham"));
});

export { router as CARD_ROUTER };
