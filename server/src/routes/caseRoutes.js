import express from 'express';
import {
  createCase,
  getCaseById,
  discoverClue,
  requestHint,
  accuseSuspect,
  getCaseResult
} from '../controllers/caseController.js';

const router = express.Router();

router.post('/', createCase);
router.get('/:id', getCaseById);
router.post('/:id/clues/:clueId/discover', discoverClue);
router.post('/:id/hints', requestHint);
router.post('/:id/accuse', accuseSuspect);
router.get('/:id/result', getCaseResult);

export default router;
