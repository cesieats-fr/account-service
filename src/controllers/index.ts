import { Request, Response } from 'express';
import { IAccount } from 'cesieats-service-types/src/account';
import { Account } from '../database';

//Crée un compte
const registerAccount = async (req: Request, res: Response) => {
  try {
    const acc: IAccount = {
      forname: req.body.forname,
      name: req.body.name,
      idIdentity: res.locals.identity,
    };
    const result = await Account.create(acc);

    res.status(200).json(result);
  } catch (error) {
    console.log('[IDENTITY-SERVICE] registerAccount error: ', error);
    res.status(400).json({ message: 'an unexpected error occurred' });
  }
};

//Connecte un compte
const loginAccount = async (req: Request, res: Response) => {
  try {
    const result = await Account.findOne({ idIdentity: res.locals.identity._id });

    if (!result) {
      res.status(404).json({ message: 'idIdentity not found or incorrect' });
    }

    res.status(200).json('Account succesfully logged');
  } catch (error) {
    console.log('[IDENTITY-SERVICE] loginAccount error: ', error);
    res.status(400).json({ message: 'an unexpected error occurred' });
  }
};

//Supprime un compte
const deleteAccount = async (req: Request, res: Response) => {
  try {
    const result = await Account.deleteOne({ idIdentity: res.locals.identity });

    if (!result) {
      res.status(404).json({ message: 'account not found' });
    }

    res.status(200).json('Account succesfully deleted!');
  } catch (error) {
    console.log('[IDENTITY-SERVICE] deleteAccount error: ', error);
    res.status(400).json({ message: 'an unexpected error occurred' });
  }
};

const controller = {
  registerAccount,
  loginAccount,
  deleteAccount,
};

export default controller;
