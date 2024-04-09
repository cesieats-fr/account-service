import express, { Router } from 'express';
import controller from '../controllers';
import { middleware } from '../middlewares';

const router: Router = express.Router();

router.post('/register', controller.registerAccount);

router.post('/login', controller.loginAccount);

router.use(middleware);

router.delete('/delete', controller.deleteAccount);

router.put('/edit', controller.editAccount);

router.post('/createApiKey', controller.createApiKeyIdentity);

router.post('/verifyApiKey', controller.verifyApiKeyIdentity);

export default router;
