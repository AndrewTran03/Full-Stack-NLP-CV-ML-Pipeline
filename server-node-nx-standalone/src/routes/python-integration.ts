import express from "express";
import { HTTP_STATUS_CODE, onErrorMsg, onSuccessMsg } from "./utils";
import LOGGER from "../utils/logger";
import {
  checkChannelQueuesStatus,
  createRabbitMQReqResChannel
} from "../utils/rabbitmq";
import { RABBITMQ_CONNECTION } from "../main";

const channelPrefix = "python" as const;
const REQUEST_QUEUE_STR = `${channelPrefix}_request_queue` as const;
const RESPONSE_QUEUE_STR = `${channelPrefix}_response_queue` as const;
const router = express.Router();

function generateRandomInt(min = 0, max = 1_000_000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// FOR TESTING:
router.get("/api/success", (_, res) => {
  return res.status(HTTP_STATUS_CODE.OK).json(onSuccessMsg("Python API!"));
});

// Interaction with Python
let counter = 0;
router.post("/api/python", async (req, res) => {
  LOGGER.debug(req.body);
  const { message } = req.body as { message: string };

  LOGGER.trace(`Previous: ${counter}`);
  // Generate a unique correlation ID for this request
  const correlationId = `${Date.now()}_${generateRandomInt()}_${counter}`;
  LOGGER.info(`Python Request ID: ${correlationId}`);
  counter++;
  LOGGER.trace(`Current: ${counter}`);

  try {
    const basicPythonChannel = await createRabbitMQReqResChannel(
      RABBITMQ_CONNECTION,
      channelPrefix
    );
    await checkChannelQueuesStatus(basicPythonChannel, channelPrefix);

    LOGGER.trace(`ID (Before Send): ${correlationId}`);
    // Send the request to the Request Queue
    basicPythonChannel.sendToQueue(
      REQUEST_QUEUE_STR,
      Buffer.from(JSON.stringify(message)),
      {
        correlationId,
        replyTo: RESPONSE_QUEUE_STR
      }
    );

    let parsedResponseData = { prediction: "" };
    // Listen for the response from the Response Queue
    basicPythonChannel.consume(RESPONSE_QUEUE_STR, (message) => {
      const messageCorrelationId = message.properties.correlationId as string;
      LOGGER.trace({
        messageCorrelationId,
        correlationId
      });
      if (message.content.length === 0) {
        throw new Error("Empty Response from Python");
      }
      if (messageCorrelationId === correlationId) {
        const responseData = message.content.toString();
        LOGGER.trace(
          `Python Response Message Content: ${message.content.toString()}`
        );

        parsedResponseData = JSON.parse(responseData) as {
          prediction: string;
        };
        const prediction = parsedResponseData.prediction;
        LOGGER.debug(`Parsed Prediction Response: ${prediction}`);

        // Acknowledge the message to RabbitMQ
        basicPythonChannel.ack(message);

        // Close the channel to avoid leak in abstraction (avoid listening for the different/"wrong" response messages)
        basicPythonChannel.close();

        return res
          .status(HTTP_STATUS_CODE.OK)
          .json(JSON.stringify(parsedResponseData));
      }
    });
  } catch (err) {
    LOGGER.error(`Error Handling Python Request: ${err}`);
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json(onErrorMsg(new Error(err)));
  }
});

export { router as PYTHON_INTEGRATION_ROUTER };
