import amqp from "amqplib";
import LOGGER from "./logger";
import assert from "assert";

// Default Timeout for RabbitMQ Operations
const RABBITMQ_TIMEOUT_TIME_SEC = 30;
export const RABBITMQ_TIMEOUT_TIME_MS = RABBITMQ_TIMEOUT_TIME_SEC * 1000;

export async function startRabbitMQConnection(
  rabbitmq_url: string
): Promise<amqp.Connection> {
  assert(rabbitmq_url.length > 0, "RabbitMQ URL should not be empty");
  try {
    // Setup RabbitMQ connection
    const connection = await amqp.connect(rabbitmq_url);

    LOGGER.info("Connection created successfully.");
    return connection;
  } catch (err) {
    LOGGER.error(
      `Error: Failed to start RabbitMQ connection properly. Full Error Message - ${err}`
    );
    process.exit(1);
  }
}

export async function createRabbitMQReqResChannel(
  connection: amqp.Connection,
  channelUsagePrefix: string
): Promise<amqp.Channel> {
  assert(
    channelUsagePrefix.length > 0,
    "Channel-Usage Prefix should not be empty"
  );
  try {
    // Setup a new RabbitMQ channel for transactions
    const channel = await connection.createChannel();

    // Declare Request and Response Queues
    const activeQueues = [
      `${channelUsagePrefix}_REQUEST_QUEUE`,
      `${channelUsagePrefix}_RESPONSE_QUEUE`
    ] as const;
    for (const queue of activeQueues) {
      await channel.assertQueue(queue, { durable: true });
    }

    return channel;
  } catch (err) {
    LOGGER.error(
      `Error: Failed to initiate RabbitMQ channels properly. Full Error Message - ${err}`
    );
    process.exit(1);
  }
}

export async function checkChannelQueuesStatus(
  channel: amqp.Channel,
  channelUsagePrefix: string
): Promise<void> {
  assert(
    channelUsagePrefix.length > 0,
    "Channel-Usage Prefix should not be empty"
  );

  const activeQueues = [
    `${channelUsagePrefix}_REQUEST_QUEUE`,
    `${channelUsagePrefix}_RESPONSE_QUEUE`
  ] as const;
  for (const queue of activeQueues) {
    const queueInfo = await channel.checkQueue(queue);
    LOGGER.debug(`Queue: ${queue}`);
    LOGGER.debug(`Details: ${JSON.stringify(queueInfo)}`);
  }
}
