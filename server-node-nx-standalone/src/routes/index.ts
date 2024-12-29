import express from "express";
import { HTTP_STATUS_CODE, onErrorMsg, onSuccessMsg } from "./utils";
import { PYTHON_INTEGRATION_ROUTER } from "./python-integration";
import { DATA_ROUTER } from "./data";
import { SIMPLE_ML_ROUTER } from "./simple-ml";

const APP_ROUTER = express.Router();
APP_ROUTER.use(DATA_ROUTER);
APP_ROUTER.use(PYTHON_INTEGRATION_ROUTER);
APP_ROUTER.use(SIMPLE_ML_ROUTER);

// Route for Testing (Generated by Nx by Default)
APP_ROUTER.get("/", (_, res) => {
  return res.status(HTTP_STATUS_CODE.OK).json(onSuccessMsg("Hello World!!!"));
});

APP_ROUTER.get("/api", (_, res) => {
  return res.status(HTTP_STATUS_CODE.OK).json(onSuccessMsg("Hello API!!!"));
});

// Fallback Route (If Passed as Un-Specified)
APP_ROUTER.get("*", (_, res) => {
  return res
    .status(HTTP_STATUS_CODE.BAD_REQUEST)
    .json(onErrorMsg("Invalid API endpoint specified."));
});

export default APP_ROUTER;
