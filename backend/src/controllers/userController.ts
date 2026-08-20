import { Request, Response } from 'express';
import User from '../models/User';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'RESTAURANT_MANAGER', 'STAFF']),
  restaurantId: z.string().optional(),
});

const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});

const updateUserRoleSchema = z.object({
  role: z.enum(['ADMIN', 'RESTAURANT_MANAGER', 'STAFF']),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6),
});

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = createUserSchema.safeParse(req.body);
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
      role,
      restaurantId,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = updateUserStatusSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ success: false, message: 'Invalid data', errors: parsedData.error.format() });
      return;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.isActive = parsedData.data.isActive;
    await user.save();

    res.status(200).json({ success: true, data: { _id: user._id, isActive: user.isActive } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = updateUserRoleSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ success: false, message: 'Invalid data', errors: parsedData.error.format() });
      return;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.role = parsedData.data.role;
    await user.save();

    res.status(200).json({ success: true, data: { _id: user._id, role: user.role } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetUserPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = resetPasswordSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ success: false, message: 'Invalid data', errors: parsedData.error.format() });
      return;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.password = parsedData.data.newPassword; // Pre-save hook hashes this
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
