import { sub } from './index';

sub.on('error', (err) => {
  // Maybe the consumer was cancelled, or the connection was reset before a
  // message could be acknowledged.
  console.log('consumer error (user-events)', err);
});
