import { Request, Response } from 'express';
import { IAccount } from 'cesieats-service-types/src/account';
import { Account } from '../database';

//Crée un compte
const register = async (req: Request, res: Response) => {
  try {
    const acc: IAccount = {
      email: req.body.email,
      password: req.body.password,
      forname: req.body.forname,
      name: req.body.name,
    };
    const result = await Account.create(acc);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: 'an unexpected error occurred', error });
  }
};

//Connecte un compte
const login = async (req: Request, res: Response) => {
  try {
    const result = await Account.findOne({ email: req.body.email, password: req.body.password });

    if (!result || res.locals.identity._id !== result._id) {
      return res.status(404).json({ message: 'idIdentity not found or incorrect' });
    }

    res.status(200).json('Account succesfully logged');
  } catch (error) {
    res.status(400).json({ message: 'an unexpected error occurred', error });
  }
};

//Supprime un compte
const deleteAccount = async (req: Request, res: Response) => {
  try {
    const result = await Account.deleteOne({ idIdentity: res.locals.identity._id });

    if (!result) {
      return res.status(404).json({ message: 'account not found' });
    }

    res.status(200).json('Account succesfully deleted!');
  } catch (error) {
    res.status(400).json({ message: 'an unexpected error occurred', error });
  }
};

const edit = async (req: Request, res: Response) => {
  try {
    const update: IAccount = {
      email: req.body.email,
      password: req.body.password,
      forname: req.body.forname,
      name: req.body.name,
      address: req.body.address,
    };
    const result = await Account.findOneAndUpdate({ idIdentity: res.locals.identity._id }, update);

    if (!result) {
      return res.status(404).json({ message: 'account not found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: 'an unexpected error occurred', error });
  }
};

//Crée et associe une clé API à une identité connectée
const createApiKey = async (req: Request, res: Response) => {
  try {
    let apiKey = crypto.randomUUID();
    while ((await Account.find({ apiKey: apiKey })) != null) {
      apiKey = crypto.randomUUID();
    }
    await Account.findOneAndUpdate({ email: res.locals.identity.email }, { apiKey: apiKey });
    res.status(200).json(apiKey);
  } catch (error) {
    res.status(400).json({ message: 'an unexpected error occurred' });
  }
};

//Vérifie la clé API d'une identité
const verifyApiKey = async (req: Request, res: Response) => {
  try {
    if (Account.find({ apiKey: res.locals.identity.apiKey }) != null) {
      res.status(200).json();
    } else {
      res.status(401).json({ message: 'apiKey could not be verified' });
    }
  } catch (error) {
    res.status(400).json({ message: 'an unexpected error occurred' });
  }
};

const controller = {
  registerAccount: register,
  loginAccount: login,
  deleteAccount,
  editAccount: edit,
  createApiKeyIdentity: createApiKey,
  verifyApiKeyIdentity: verifyApiKey,
};

export default controller;
