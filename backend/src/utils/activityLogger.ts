import ActivityLog from '../models/ActivityLog';
import mongoose from 'mongoose';

export const logActivity = async (
  userId: string | mongoose.Types.ObjectId,
  restaurantId: string | mongoose.Types.ObjectId,
  action: string,
  entity: string,
  entityId?: string | mongoose.Types.ObjectId,
  metadata?: any
) => {
  try {
    await ActivityLog.create({
      user: userId,
      restaurantId,
      action,
      entity,
      entityId,
      metadata,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // We intentionally don't throw here to avoid failing the main request if logging fails
  }
};
