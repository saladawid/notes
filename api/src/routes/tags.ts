import { Router } from 'express';
import { body, param } from 'express-validator';
import { getTags, createTag, deleteTag } from '../controllers/tagController';
import auth from '../middleware/auth';
import validate from '../middleware/validate';

const router = Router();

router.use(auth);

router.get('/', getTags);

router.post(
  '/',
  [body('name').trim().notEmpty().isLength({ max: 50 })],
  validate,
  createTag
);

router.delete(
  '/:id',
  [param('id').isMongoId()],
  validate,
  deleteTag
);

export default router;
