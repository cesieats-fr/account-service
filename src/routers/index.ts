import express, { Router, Request, Response } from 'express';
import controller from '../controllers';

const router: Router = express.Router();

router.post('/registerAccount', controller.register);

router.post('/loginAccount',controller.login);

router.delete('/deleteAccount/{idAccount}',controller.deleteAccount);

router.put('/editAccount/{idAccount}', controller.deleteAccount);

export default router;
