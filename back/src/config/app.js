import express from 'express';
import cors from 'cors';

import { router as bankAccountsRoutes } from '../api/routes/bankAccounts.js';
import { router as usersRoutes } from '../api/routes/users.js';

export const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/v1/bankAccount', bankAccountsRoutes);
app.use('/api/v1/user', usersRoutes);
