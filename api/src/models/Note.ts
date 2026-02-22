import { Schema, model, Types } from 'mongoose';
import { INote } from '../types';

const historySchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: '' },
    savedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    tags: [{ type: Types.ObjectId, ref: 'Tag' }],
    owner: { type: Types.ObjectId, ref: 'User', required: true },
    history: { type: [historySchema], default: [] },
  },
  { timestamps: true }
);

noteSchema.index({ owner: 1, updatedAt: -1 });
noteSchema.index({ title: 'text', content: 'text' });

export default model<INote>('Note', noteSchema);
