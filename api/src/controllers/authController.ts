import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { JwtPayload } from '../types';

const signToken = (payload: JwtPayload): string =>
  jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  });

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ message: 'Email already in use' });
    return;
  }

  const user = await User.create({ email, password, name });
  const token = signToken({ userId: user._id.toString(), email: user.email });

  res.status(201).json({
    token,
    user: { id: user._id, email: user.email, name: user.name },
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = signToken({ userId: user._id.toString(), email: user.email });

  res.json({
    token,
    user: { id: user._id, email: user.email, name: user.name },
  });
};
