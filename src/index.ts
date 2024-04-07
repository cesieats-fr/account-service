import express, { Request, Response } from 'express';
import 'dotenv/config';
import router from './routers';
import { connectMongoose } from './database';
import { connectRabbitMQ } from './messaging';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

Promise.all([connectRabbitMQ(), connectMongoose()]).then(() => {
  app.get('/', (req: Request, res: Response) => {
    res.send('account-service running');
  });

  app.use('/', router);

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
});
