import { Response } from 'express';
import { Types } from 'mongoose';
import Note from '../models/Note';
import { AuthRequest } from '../types';

const MAX_HISTORY = 10;

export const getNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  const { search, sort = 'updatedAt', order = 'desc', tags } = req.query;
  const owner = new Types.ObjectId(req.user!.userId);

  const filter: Record<string, unknown> = { owner };

  if (typeof search === 'string' && search.trim()) {
    filter.$text = { $search: search };
  }

  if (typeof tags === 'string' && tags) {
    filter.tags = { $in: tags.split(',').map((t) => new Types.ObjectId(t)) };
  }

  const sortField = ['createdAt', 'updatedAt', 'title'].includes(sort as string)
    ? (sort as string)
    : 'updatedAt';
  const sortDir = order === 'asc' ? 1 : -1;

  const notes = await Note.find(filter, { history: 0 })
    .populate('tags', 'name')
    .sort({ [sortField]: sortDir });

  res.json(notes);
};

export const createNote = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, content = '', tags = [] } = req.body;
  const owner = new Types.ObjectId(req.user!.userId);

  const note = await Note.create({ title, content, tags, owner });
  await note.populate('tags', 'name');

  res.status(201).json(note);
};

export const getNoteById = async (req: AuthRequest, res: Response): Promise<void> => {
  const note = await Note.findOne(
    { _id: req.params.id, owner: req.user!.userId },
    { history: 0 }
  ).populate('tags', 'name');

  if (!note) {
    res.status(404).json({ message: 'Note not found' });
    return;
  }

  res.json(note);
};

export const updateNote = async (req: AuthRequest, res: Response): Promise<void> => {
  const note = await Note.findOne({ _id: req.params.id, owner: req.user!.userId });

  if (!note) {
    res.status(404).json({ message: 'Note not found' });
    return;
  }

  const snapshot = { title: note.title, content: note.content, savedAt: new Date() };
  note.history.unshift(snapshot);
  if (note.history.length > MAX_HISTORY) {
    note.history = note.history.slice(0, MAX_HISTORY);
  }

  const { title, content, tags } = req.body;
  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  if (tags !== undefined) note.tags = tags;

  await note.save();
  await note.populate('tags', 'name');

  res.json(note);
};

export const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user!.userId });

  if (!note) {
    res.status(404).json({ message: 'Note not found' });
    return;
  }

  res.status(204).send();
};

export const getNoteHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  const note = await Note.findOne(
    { _id: req.params.id, owner: req.user!.userId },
    { history: 1 }
  );

  if (!note) {
    res.status(404).json({ message: 'Note not found' });
    return;
  }

  res.json(note.history);
};
