import { Router } from 'express';

import {
  getBankAccountByAccountNumberAndNIP,
  getCurrentBalance,
  withdraw,
  deposit,
  performTransaction,
  getBankAccount,
  createBankAccount,
} from '../controllers/bankAccounts.js';

export const router = Router();

router.get('/:id', getBankAccount);
router.post('/', createBankAccount);
router.post('/login', getBankAccountByAccountNumberAndNIP);
router.get('/:id/current-balance', getCurrentBalance);
router.put('/:id/withdraw', withdraw);
router.put('/:id/deposit', deposit);
router.post('/:originAccountID/performTransaction', performTransaction);
