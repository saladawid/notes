import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
  getNoteHistory,
} from '../controllers/noteController';
import auth from '../middleware/auth';
import validate from '../middleware/validate';

const router = Router();

router.use(auth);

router.get('/', getNotes);

router.post(
  '/',
  [body('title').trim().notEmpty()],
  validate,
  createNote
);

router.get(
  '/:id',
  [param('id').isMongoId()],
  validate,
  getNoteById
);

router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('title').optional().trim().notEmpty(),
  ],
  validate,
  updateNote
);

router.delete(
  '/:id',
  [param('id').isMongoId()],
  validate,
  deleteNote
);

router.get(
  '/:id/history',
  [param('id').isMongoId()],
  validate,
  getNoteHistory
);

export default router;
