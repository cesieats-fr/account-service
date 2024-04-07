import * as amqp from 'amqplib';
import Senders from './senders';
import Receivers from './receivers';

export let messaging: Messaging;

interface IMessaging {
  connection: amqp.Connection;
  senders: Senders;
  receivers: Receivers;
  channel: amqp.Channel;
}

class Messaging implements IMessaging {
  connection: amqp.Connection;
  senders: Senders;
  receivers: Receivers;
  channel: amqp.Channel;

  constructor(connection: amqp.Connection, channel: amqp.Channel, senders: Senders, receivers: Receivers) {
    this.connection = connection;
    this.senders = senders;
    this.receivers = receivers;
    this.channel = channel;
  }

  disconnect() {
    this.senders.disconnect();
    this.receivers.disconnect();
    this.connection.close();
  }
}

export async function connectRabbitMQ() {
  const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_URL}`, {
    username: process.env.RABBITMQ_USERNAME,
    password: process.env.RABBITMQ_PASSWORD,
  });
  const channel = await connection.createChannel();
  const receivers = new Receivers(channel);
  const senders = new Senders(channel);
  messaging = new Messaging(connection, channel, senders, receivers);
  console.log('Connected to RabbitMQ ');
}

export default Messaging;
