import { Router } from 'express';
import { createUser } from '../controllers/users.js';

export const router = Router();

router.post('/', createUser);
