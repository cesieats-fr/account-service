import { pub } from './index';

// Publish a message to a custom exchange
pub.send(
  { exchange: 'my-events', routingKey: 'users.visit' }, // metadata
  { id: 1, name: 'Alan Turing' },
); // message content

// Or publish directly to a queue
pub.send('user-events', { id: 1, name: 'Alan Turing' });
