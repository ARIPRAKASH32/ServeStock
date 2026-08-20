import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';
import { z } from 'zod';
import { AuthRequest } from '../middleware/authMiddleware';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'RESTAURANT_MANAGER', 'STAFF']).optional(),
  restaurantId: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = registerSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ success: false, message: 'Invalid data', errors: parsedData.error.format() });
      return;
    }

    const { name, email, password, role, restaurantId } = parsedData.data;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(409).json({ success: false, message: 'User already exists' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'STAFF',
      restaurantId,
    });

    const token = generateToken(user._id as unknown as string, user.role);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = loginSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ success: false, message: 'Invalid credentials', errors: parsedData.error.format() });
      return;
    }

    const { email, password } = parsedData.data;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ success: false, message: 'Your account is inactive. Please contact the administrator.' });
      return;
    }

    const token = generateToken(user._id as unknown as string, user.role);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        restaurantId: user.restaurantId,
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};
