import { Response } from 'express';
import { Types } from 'mongoose';
import Tag from '../models/Tag';
import Note from '../models/Note';
import { AuthRequest } from '../types';

export const getTags = async (req: AuthRequest, res: Response): Promise<void> => {
  const tags = await Tag.find({ owner: req.user!.userId }).sort({ name: 1 });
  res.json(tags);
};

export const createTag = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name } = req.body;
  const owner = new Types.ObjectId(req.user!.userId);

  const existing = await Tag.findOne({ name: name.toLowerCase(), owner });
  if (existing) {
    res.status(409).json({ message: 'Tag already exists' });
    return;
  }

  const tag = await Tag.create({ name, owner });
  res.status(201).json(tag);
};

export const deleteTag = async (req: AuthRequest, res: Response): Promise<void> => {
  const tag = await Tag.findOneAndDelete({ _id: req.params.id, owner: req.user!.userId });

  if (!tag) {
    res.status(404).json({ message: 'Tag not found' });
    return;
  }

  await Note.updateMany({ owner: req.user!.userId }, { $pull: { tags: tag._id } });

  res.status(204).send();
};
