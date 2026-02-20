import { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

export interface INoteHistory {
  content: string;
  title: string;
  savedAt: Date;
}

export interface INote extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  tags: Types.ObjectId[];
  owner: Types.ObjectId;
  history: INoteHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITag extends Document {
  _id: Types.ObjectId;
  name: string;
  owner: Types.ObjectId;
  createdAt: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
