import { Schema, model, Types } from 'mongoose';
import { ITag } from '../types';

const tagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, trim: true, lowercase: true },
    owner: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

tagSchema.index({ owner: 1, name: 1 }, { unique: true });

export default model<ITag>('Tag', tagSchema);
