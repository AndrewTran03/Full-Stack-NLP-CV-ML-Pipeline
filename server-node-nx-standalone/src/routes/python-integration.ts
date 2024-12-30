import express from "express";
import { HTTP_STATUS_CODE, onErrorMsg, onSuccessMsg } from "./utils";
import LOGGER from "../utils/logger";
import {
  RABBITMQ_TIMEOUT_TIME_MS,
  checkChannelQueuesStatus,
  createRabbitMQReqResChannel,
  generateCorrelationIDRabbitMQ,
  generateReqAndResQueueStrings
} from "../utils/rabbitmq";
import { RABBITMQ_CONNECTION } from "../main";

const CHANNEL_PREFIX = "python" as const;
const { REQUEST_QUEUE_STR, RESPONSE_QUEUE_STR } =
  generateReqAndResQueueStrings(CHANNEL_PREFIX);

const router = express.Router();

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
  const correlationId = generateCorrelationIDRabbitMQ(counter);
  LOGGER.info(`Python Request ID: ${correlationId}`);
  counter++;
  LOGGER.trace(`Current: ${counter}`);

  try {
    const basicPythonChannel = await createRabbitMQReqResChannel(
      RABBITMQ_CONNECTION!,
      CHANNEL_PREFIX
    );
    await checkChannelQueuesStatus(basicPythonChannel, CHANNEL_PREFIX);

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

    // Listen for the response from the Response Queue
    const response = await new Promise<string>((resolve, reject) => {
      // Fallback for too long of a response time
      const timeout = setTimeout(() => {
        LOGGER.error(
          `Timeout: No response received for correlationId: ${correlationId}`
        );
        basicPythonChannel.close();
        throw new Error("Timeout: No response received from Python");
      }, RABBITMQ_TIMEOUT_TIME_MS);

      basicPythonChannel.consume(
        RESPONSE_QUEUE_STR,
        (message) => {
          if (message == null) {
            clearTimeout(timeout);
            basicPythonChannel.close();
            reject(new Error("Invalid Response from Python"));
            return;
          }
          const messageCorrelationId = message.properties
            .correlationId as string;
          LOGGER.trace({
            messageCorrelationId,
            correlationId
          });

          if (message.content.length === 0) {
            clearTimeout(timeout);
            basicPythonChannel.close();
            reject(new Error("Empty Response from Python"));
            return;
          }

          if (messageCorrelationId === correlationId) {
            const responseData = message.content.toString();
            LOGGER.trace(
              `Python Response Message Content: ${message.content.toString()}`
            );

            clearTimeout(timeout);
            // Acknowledge the message from RabbitMQ
            basicPythonChannel.ack(message);

            resolve(responseData);
          }
        },
        { noAck: false } // Ensure manual acknowledgment
      );
    });

    const parsedResponseData = JSON.parse(response) as {
      prediction: string;
    };
    const prediction = parsedResponseData.prediction;
    LOGGER.debug(`Parsed Prediction Response: ${prediction}`);

    // Close the channel to avoid leak in abstraction (avoid listening for the different/"wrong" response messages)
    basicPythonChannel.close();

    return res
      .status(HTTP_STATUS_CODE.OK)
      .json(onSuccessMsg(parsedResponseData));
  } catch (err: unknown) {
    LOGGER.error(`Error Handling Python Request: ${err}`);
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json(onErrorMsg(err as string));
  }
});

export { router as PYTHON_INTEGRATION_ROUTER };
