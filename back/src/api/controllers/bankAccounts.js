import { prisma } from '../../config/database.js';
import { generateUniqueId } from '../utils/generateUniqueId.js';

const BankAccount = prisma.bankAccount;

export const getBankAccount = async (req, res) => {
  const { id } = req.params;
  const bankAccount = await BankAccount.findUnique({
    select: {
      id: true,
      typeAccount: true,
      numberAccount: true,
      currentBalance: true,
      user: true,
    },
    where: {
      id: parseInt(id),
    },
  });

  if (!bankAccount) {
    return res.status(404).json({
      status: 404,
      error: 'Bank account not found',
    });
  }
  return res.status(200).json({
    status: 200,
    data: bankAccount,
  });
};

export const createBankAccount = async (req, res) => {
  const { typeAccount, nip, userId } = req.body;

  const numberAccount = generateUniqueId({ length: 20, useLetters: false });

  const bankAccount = await BankAccount.create({
    select: {
      id: true,
      typeAccount: true,
      numberAccount: true,
      currentBalance: true,
      user: true,
    },
    data: {
      typeAccount,
      numberAccount,
      nip,
      userId,
    },
  });

  bankAccount
    ? res.status(201).json({
        message: 'Bank account created successfully',
        data: bankAccount,
      })
    : res.status(400).json({
        message: 'Bank account not created',
      });
};

export const getBankAccountByAccountNumberAndNIP = async (req, res) => {
  const { numberAccount, nip } = req.body;

  const bankAccount = await BankAccount.findUnique({
    select: {
      id: true,
      typeAccount: true,
      numberAccount: true,
      currentBalance: true,
      nip: true,
      user: true,
    },
    where: {
      numberAccount,
    },
  });

  bankAccount && bankAccount.nip === nip
    ? res.status(200).json({
        message: 'Bank account found',
        data: bankAccount,
      })
    : res.status(404).json({
        message: 'Number Account or NIP incorrect',
      });
};

export const getCurrentBalance = async (req, res) => {
  const { id } = req.params;

  const currentBalance = await BankAccount.findUnique({
    select: {
      currentBalance: true,
    },
    where: {
      id: parseInt(id),
    },
  });

  currentBalance
    ? res.status(200).json({
        message: 'Bank account found',
        data: currentBalance,
      })
    : res.status(404).json({
        message: 'Bank account not found',
      });
};

export const withdraw = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const bankAccount = await BankAccount.findUnique({
    select: {
      currentBalance: true,
    },
    where: {
      id: parseInt(id),
    },
  });

  if (bankAccount && bankAccount.currentBalance >= amount) {
    const bankAccountUpdate = await BankAccount.update({
      select: {
        id: true,
        typeAccount: true,
        numberAccount: true,
        currentBalance: true,
      },
      where: {
        id: parseInt(id),
      },
      data: {
        currentBalance: bankAccount.currentBalance - amount,
      },
    });
    return res.status(200).json({
      message: 'Withdraw successfully',
      data: bankAccountUpdate,
    });
  } else if (bankAccount && bankAccount.currentBalance < amount) {
    return res.status(400).json({
      message: 'Not enough founds',
    });
  }

  return res.status(404).json({
    message: 'Bank account not found',
  });
};

export const deposit = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const bankAccount = await BankAccount.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (bankAccount) {
    const bankAccountUpdate = await BankAccount.update({
      select: {
        id: true,
        typeAccount: true,
        numberAccount: true,
        currentBalance: true,
      },
      where: {
        id: parseInt(id),
      },
      data: {
        currentBalance: bankAccount.currentBalance + amount,
      },
    });

    return res.status(200).json({
      message: 'Deposit is done',
      data: bankAccountUpdate,
    });
  }

  return res.status(404).json({
    message: 'Bank Account not found',
  });
};

export const performTransaction = async (req, res) => {
  const { originAccountID } = req.params;
  const { destinationAccountNumberAccount, amount } = req.body;

  const originAccount = await BankAccount.findUnique({
    where: {
      id: parseInt(originAccountID),
    },
  });

  const destinationAccount = await BankAccount.findUnique({
    where: {
      numberAccount: destinationAccountNumberAccount,
    },
  });

  if (originAccount && destinationAccount) {
    if (originAccount.currentBalance < amount) {
      res.status(400).json({
        message: 'Insufficient funds',
      });
    }

    const originAccountBalance = originAccount.currentBalance - amount;
    const destinationAccountBalance =
      destinationAccount.currentBalance + amount;

    const originAccountUpdate = await BankAccount.update({
      select: {
        id: true,
        typeAccount: true,
        numberAccount: true,
        currentBalance: true,
      },
      where: {
        id: parseInt(originAccountID),
      },
      data: {
        currentBalance: originAccountBalance,
      },
    });

    const destinationAccountUpdate = await BankAccount.update({
      where: { numberAccount: destinationAccountNumberAccount },
      data: { currentBalance: destinationAccountBalance },
    });

    return res.status(200).json({
      message: 'Transaction performed',
      data: originAccountUpdate,
    });
  }
  return res.status(404).json({
    message: 'Bank account not found',
  });
};
