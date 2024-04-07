import { Channel } from 'amqplib';

interface ISenders {
  channel: Channel;
}

class Senders implements ISenders {
  channel: Channel;

  constructor(channel: Channel) {
    this.channel = channel;
  }

  async sendHelloWorld() {
    await this.channel.assertQueue('hello');
    this.channel.sendToQueue('hello', Buffer.from('Hello, World from order!'));
  }

  disconnect() {
    this.channel.close();
  }
}

export default Senders;
