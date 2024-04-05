import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

router.post('/register', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

router.post('/login', (req: Request, res: Response) => {
  res.json('login');
});

router.delete('/delete/{id}', (req: Request, res: Response) => {
  res.json('delete');
});

router.put('/edit/{id}', (req: Request, res: Response) => {
  res.json('edit');
});

export default router;
