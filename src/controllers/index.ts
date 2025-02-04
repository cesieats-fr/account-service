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
      address: req.body.address,
      accountType: req.body.accountType,
      
      codeSponsor: crypto.randomUUID(),
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

const loginWithToken = async (req: Request, res: Response) => {
  const result = await Account.findById(res.locals.account._id);
  if (!result) return res.status(404).json({ message: 'account not found' });
  res.status(200).json(result);
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

const deleteAccountById = async (req: Request, res: Response) => {
  try {
    const result = await Account.findByIdAndDelete(req.body.idAccount);

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
    const result = await Account.findByIdAndUpdate(res.locals.account._id, update, { new: true });

    if (!result) {
      return res.status(404).json({ message: 'account not found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: 'an unexpected error occurred', error });
  }
};

const editAccountByID = async (req: Request, res: Response) => {
  try {
    const update = {      
      forname: req.body.forname,
      name: req.body.name,
      address: req.body.address,
      email : req.body.email,
    };
    
    const result = await Account.findByIdAndUpdate(req.body.idAccount, update, { new: true });

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

const getAllClientAccounts = async (req: Request, res: Response) => {
  try {
    if (res.locals.account.accountType != 3) return res.status(401).json({ message: 'unauthorized' });
    const result = await Account.find({ accountType: 0 }).exec();

    if (!result) {
      return res.status(404).json({ message: 'account not found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: 'an unexpected error occurred', error });
  }
};

const controller = {
  register,
  login,
  loginWithToken,
  deleteAccount,
  edit,
  createApiKey,
  verifyApiKey,
  getAllClientAccounts,
  editAccountByID,
  deleteAccountById
};

export default controller;
