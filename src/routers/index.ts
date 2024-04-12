import express, { Router } from 'express';
import controller from '../controllers';
import { middleware } from '../middlewares';

const router: Router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);

router.use(middleware);

router.post('/loginWithToken', controller.loginWithToken);
router.delete('/delete', controller.deleteAccount);
router.put('/edit', controller.edit);
router.post('/createApiKey', controller.createApiKey);
router.post('/verifyApiKey', controller.verifyApiKey);
router.get('/getAllClientAccounts', controller.getAllClientAccounts);

export default router;
