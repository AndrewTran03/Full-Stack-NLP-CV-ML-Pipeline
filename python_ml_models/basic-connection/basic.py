import json
from typing import List

import pika
import pika.adapters.blocking_connection
import pika.spec

# Constants
RABBITMQ_URL = "amqp://guest:guest@localhost:5672/"


def predict(number: int):
    return {"prediction": f"Hello World {number}"}


num_request = 0


def main(rabbitmq_url: str, prefix: str = "python") -> None:
    # Connect to RabbitMQ
    predict_connection = pika.BlockingConnection(pika.URLParameters(rabbitmq_url))
    channel = predict_connection.channel()

    REQUEST_QUEUE = f"{prefix}_request_queue"
    RESPONSE_QUEUE = f"{prefix}_response_queue"

    active_queues: List[str] = [REQUEST_QUEUE, RESPONSE_QUEUE]
    # Ensure that the queues exist (or are created)
    for queue_name in active_queues:
        channel.queue_declare(queue=queue_name, durable=True)

    def on_queue_request_received(
        channel: pika.adapters.blocking_connection.BlockingChannel,
        method: pika.spec.Basic.Deliver,
        properties: pika.BasicProperties,
        body: bytes,
    ) -> None:
        global num_request

        # Parse the incoming request
        request_data = json.loads(body)
        print(f" [{num_request}] Received Request Number: {properties.correlation_id}")
        print(f" [{num_request}] Received Request Message: {request_data}")
        num_request += 1

        # Perform the prediction
        response_data = predict(number=num_request)
        print(f" [{num_request}] Sending Response Number: {properties.correlation_id}")
        print(f" [{num_request}] Sending Response Message: {response_data}")

        # Send the response to the Response Queue
        channel.basic_publish(
            exchange="",
            routing_key=properties.reply_to,
            body=json.dumps(response_data),
            properties=pika.BasicProperties(correlation_id=properties.correlation_id),
        )

        # Acknowledge the request
        channel.basic_ack(delivery_tag=method.delivery_tag)
        return None

    # Start consuming from the Request Queue
    channel.basic_consume(
        queue=REQUEST_QUEUE, on_message_callback=on_queue_request_received
    )
    channel.start_consuming()

    return None


if __name__ == "__main__":
    main(rabbitmq_url=RABBITMQ_URL)
