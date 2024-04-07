import express, { Router } from 'express';
import controller from '../controllers';

const router: Router = express.Router();

router.post('/registerAccount', controller.registerAccount);

router.post('/loginAccount',controller.loginAccount);

router.delete('/deleteAccount/{idAccount}',controller.deleteAccount);

router.put('/editAccount/{idAccount}', controller.deleteAccount);

export default router;
