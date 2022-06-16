import { prisma } from '../../config/database.js';

const User = prisma.user;

export const createUser = async (req, res) => {
  const { firstName, lastName, rfc } = req.body;

  const userAlreadyExists = await User.findUnique({
    where: {
      rfc,
    },
  });

  if (userAlreadyExists) {
    return res.status(400).json({
      message: 'RFC already exists',
    });
  }

  const user = await User.create({
    data: {
      firstName,
      lastName,
      rfc,
    },
  });

  return res.status(201).json({
    message: 'User created successfully',
    data: user,
  });
};
