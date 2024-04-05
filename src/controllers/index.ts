import { Request, Response } from 'express';

const register = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello, world!' });
};

const login = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello, world!' });
};

const deleteAccount = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello, world!' });
};

const controller = {
  register,
  login,
  deleteAccount,
};

export default controller;
