import { Request, Response } from 'express';
import { IAccount } from 'cesieats-service-types/src/account';
import { Account } from '../database';
import jwt from 'jsonwebtoken';

//Crée un compte
const register = async (req: Request, res: Response) => {
  try {
    //Vérifie si l'email est déjà utilisé
    const email = await Account.findOne({ email: req.body.email });
    if (email) {
      return res.status(409).json({ message: 'email already used' });
    }

    const acc: IAccount = {
      email: req.body.email,
      password: req.body.password,
      forname: req.body.forname,
      name: req.body.name,
      accountType: req.body.accountType,
    };
    const result = await Account.create(acc);

    const token = jwt.sign(result.toJSON(), process.env.JWT_KEY!);

    res.status(200).json({
      token: token,
      account: result,
    });
  } catch (error) {
    res.status(400).json({ message: 'an unexpected error occurred', error });
  }
};

//Connecte un compte
const login = async (req: Request, res: Response) => {
  try {
    console.log('req: ', req);
    console.log('req.body: ', req.body);
    const tokenClient = req.header('Authorization')?.replace('Bearer ', '');

    console.log('tokenClient: ', tokenClient);

    if (tokenClient) {
      const account = jwt.verify(tokenClient!, process.env.JWT_KEY!);
      console.log('account: ', account);
      return res.status(200).json({ token: tokenClient, account });
    }

    const result = await Account.findOne({ email: req.body.email, password: req.body.password });

    if (result === null) {
      return res.status(404).json({ message: 'email/password not found or incorrect' });
    }

    const token = jwt.sign(result.toJSON(), process.env.JWT_KEY!);

    res.status(200).json({
      token: token,
      account: result,
    });
  } catch (error) {
    res.status(400).json({ message: 'an unexpected error occurred', error });
  }
};

//Supprime un compte
const deleteAccount = async (req: Request, res: Response) => {
  try {
    const result = await Account.findByIdAndDelete(res.locals.account._id);

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
    const update = {
      password: req.body.password,
      forname: req.body.forname,
      name: req.body.name,
      address: req.body.address,
    };
    const result = await Account.findByIdAndUpdate(res.locals.account._id, update);

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
    await Account.findByIdAndUpdate(res.locals.account._id, { apiKey: apiKey });
    res.status(200).json(apiKey);
  } catch (error) {
    res.status(400).json({ message: 'an unexpected error occurred' });
  }
};

//Vérifie la clé API d'une identité
const verifyApiKey = async (req: Request, res: Response) => {
  try {
    if (Account.find({ apiKey: res.locals.account.apiKey }) != null) {
      res.status(200).json();
    } else {
      res.status(401).json({ message: 'apiKey could not be verified' });
    }
  } catch (error) {
    res.status(400).json({ message: 'an unexpected error occurred' });
  }
};

const controller = {
  register,
  login,
  deleteAccount,
  edit,
  createApiKey,
  verifyApiKey,
};

export default controller;
