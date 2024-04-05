import { Connection } from 'rabbitmq-client';

// Initialize:
const rabbit = new Connection('amqp://guest:guest@localhost:5672');
rabbit.on('error', (err) => {
  console.log('RabbitMQ connection error', err);
});

rabbit.on('connection', () => {
  console.log('Connection successfully (re)established');
});

// Consume messages from a queue:
// See API docs for all options
export const sub = rabbit.createConsumer(
  {
    queue: 'user-events',
    queueOptions: { durable: true },
    // handle 2 messages at a time
    qos: { prefetchCount: 2 },
    // Optionally ensure an exchange exists
    exchanges: [{ exchange: 'my-events', type: 'topic' }],
    // With a "topic" exchange, messages matching this pattern are routed to the queue
    queueBindings: [{ exchange: 'my-events', routingKey: 'users.*' }],
  },
  async (msg) => {
    console.log('received message (user-events)', msg);
    // The message is automatically acknowledged (BasicAck) when this function ends.
    // If this function throws an error, then msg is rejected (BasicNack) and
    // possibly requeued or sent to a dead-letter exchange. You can also return a
    // status code from this callback to control the ack/nack behavior
    // per-message.
  },
);

// Declare a publisher
// See API docs for all options
export const pub = rabbit.createPublisher({
  // Enable publish confirmations, similar to consumer acknowledgements
  confirm: true,
  // Enable retries
  maxAttempts: 2,
  // Optionally ensure the existence of an exchange before we use it
  exchanges: [{ exchange: 'my-events', type: 'topic' }],
});

// Clean up when you receive a shutdown signal
async function onShutdown() {
  // Waits for pending confirmations and closes the underlying Channel
  await pub.close();
  // Stop consuming. Wait for any pending message handlers to settle.
  await sub.close();
  await rabbit.close();
}
process.on('SIGINT', onShutdown);
process.on('SIGTERM', onShutdown);
