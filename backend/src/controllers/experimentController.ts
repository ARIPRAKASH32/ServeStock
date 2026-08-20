import { Request, Response } from 'express';
import ExperimentEvent from '../models/ExperimentEvent';
import { z } from 'zod';

const eventSchema = z.object({
  experimentId: z.string(),
  variant: z.string(),
  event: z.enum(['VIEW', 'CLICK', 'ACTION_COMPLETED']),
  metadata: z.any().optional(),
});

export const trackEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = eventSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ success: false, message: 'Invalid event data' });
      return;
    }

    const userId = (req as any).user?._id; // If authenticated

    await ExperimentEvent.create({
      ...parsedData.data,
      userId,
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExperimentResults = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const results = await ExperimentEvent.aggregate([
      { $match: { experimentId: id } },
      { $group: {
          _id: { variant: '$variant', event: '$event' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({ success: true, data: results });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
