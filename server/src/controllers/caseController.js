import mongoose from 'mongoose';
import { Case } from '../models/Case.js';
import { generateMysteryWithGemini } from '../services/geminiService.js';
import { calculateScore } from '../utils/scoring.js';

// In-memory fallback repository in case MongoDB is offline
const memoryCases = new Map();

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

function sanitizeCase(caseObj) {
  const isFinished = caseObj.status === 'solved' || caseObj.status === 'failed';
  const copy = JSON.parse(JSON.stringify(caseObj));

  if (!isFinished) {
    delete copy.solution;
  }

  copy.hints = copy.hints.map(hint => {
    if (!hint.revealed && !isFinished) {
      return {
        id: hint.id,
        order: hint.order,
        revealed: false,
        text: 'Hidden hint. Unlock by requesting this hint.'
      };
    }
    return hint;
  });

  return copy;
}

/**
 * POST /api/cases
 * Generate a new mystery with Gemini AI and save to database
 */
export async function createCase(req, res) {
  try {
    const { premise = 'A mysterious crime at midnight', difficulty = 'Medium' } = req.body;

    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return res.status(400).json({ error: 'Difficulty must be Easy, Medium, or Hard.' });
    }

    console.log(`[CaseController] Creating mystery: "${premise}" (${difficulty})`);

    // Generate case with Gemini AI or rich fallback
    const mysteryData = await generateMysteryWithGemini(premise, difficulty);

    const initialScore = {
      basePoints: 0,
      cluesPoints: 0,
      hintsPenalty: 0,
      total: 0
    };

    const caseData = {
      ...mysteryData,
      premise,
      difficulty,
      status: 'in_progress',
      score: initialScore
    };

    if (isDbConnected()) {
      const newCase = new Case(caseData);
      await newCase.save();
      return res.status(201).json(newCase.toClientJSON());
    } else {
      // Memory fallback
      const id = 'mem_' + Date.now();
      const storedCase = { _id: id, id, ...caseData, createdAt: new Date() };
      memoryCases.set(id, storedCase);
      return res.status(201).json(sanitizeCase(storedCase));
    }
  } catch (error) {
    console.error('[CaseController] createCase error:', error);
    return res.status(500).json({ error: 'Failed to generate mystery: ' + error.message });
  }
}

/**
 * GET /api/cases/:id
 * Retrieve active mystery (without solution/culprit)
 */
export async function getCaseById(req, res) {
  try {
    const { id } = req.params;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const foundCase = await Case.findById(id);
      if (!foundCase) {
        return res.status(404).json({ error: 'Case not found.' });
      }
      return res.json(foundCase.toClientJSON());
    } else if (memoryCases.has(id)) {
      const memCase = memoryCases.get(id);
      return res.json(sanitizeCase(memCase));
    }

    return res.status(404).json({ error: 'Case not found.' });
  } catch (error) {
    console.error('[CaseController] getCaseById error:', error);
    return res.status(500).json({ error: 'Failed to fetch case: ' + error.message });
  }
}

/**
 * POST /api/cases/:id/clues/:clueId/discover
 * Discover a clue and award +5 points
 */
export async function discoverClue(req, res) {
  try {
    const { id, clueId } = req.params;

    let targetCase = null;
    let isMemory = false;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      targetCase = await Case.findById(id);
    } else if (memoryCases.has(id)) {
      targetCase = memoryCases.get(id);
      isMemory = true;
    }

    if (!targetCase) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    if (targetCase.status !== 'in_progress') {
      return res.status(400).json({ error: 'Case investigation is already concluded.' });
    }

    const clue = targetCase.clues.find(c => c.id === clueId);
    if (!clue) {
      return res.status(404).json({ error: 'Clue not found in this case.' });
    }

    if (!clue.discovered) {
      clue.discovered = true;
      clue.discoveredAt = new Date();

      const discoveredCount = targetCase.clues.filter(c => c.discovered).length;
      const hintsRevealed = targetCase.hints.filter(h => h.revealed).length;

      targetCase.score = calculateScore({
        difficulty: targetCase.difficulty,
        isCorrect: false, // Base points only awarded upon correct accusation
        discoveredCluesCount: discoveredCount,
        hintsRevealedCount: hintsRevealed
      });

      if (isMemory) {
        memoryCases.set(id, targetCase);
      } else {
        await targetCase.save();
      }
    }

    const clientOutput = isMemory ? sanitizeCase(targetCase) : targetCase.toClientJSON();
    return res.json({
      message: `Clue "${clue.title}" discovered! (+5 points)`,
      clue,
      case: clientOutput
    });
  } catch (error) {
    console.error('[CaseController] discoverClue error:', error);
    return res.status(500).json({ error: 'Failed to discover clue: ' + error.message });
  }
}

/**
 * POST /api/cases/:id/hints
 * Request a hint with a -10 point penalty
 */
export async function requestHint(req, res) {
  try {
    const { id } = req.params;

    let targetCase = null;
    let isMemory = false;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      targetCase = await Case.findById(id);
    } else if (memoryCases.has(id)) {
      targetCase = memoryCases.get(id);
      isMemory = true;
    }

    if (!targetCase) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    if (targetCase.status !== 'in_progress') {
      return res.status(400).json({ error: 'Case investigation is already concluded.' });
    }

    // Find first unrevealed hint
    const unrevealedHint = targetCase.hints.find(h => !h.revealed);
    if (!unrevealedHint) {
      return res.status(400).json({ error: 'All available hints have already been revealed!' });
    }

    unrevealedHint.revealed = true;
    unrevealedHint.revealedAt = new Date();

    const discoveredCount = targetCase.clues.filter(c => c.discovered).length;
    const hintsRevealed = targetCase.hints.filter(h => h.revealed).length;

    targetCase.score = calculateScore({
      difficulty: targetCase.difficulty,
      isCorrect: false,
      discoveredCluesCount: discoveredCount,
      hintsRevealedCount: hintsRevealed
    });

    if (isMemory) {
      memoryCases.set(id, targetCase);
    } else {
      await targetCase.save();
    }

    const clientOutput = isMemory ? sanitizeCase(targetCase) : targetCase.toClientJSON();
    return res.json({
      message: `Hint #${unrevealedHint.order} unlocked! (-10 points)`,
      hint: unrevealedHint,
      case: clientOutput
    });
  } catch (error) {
    console.error('[CaseController] requestHint error:', error);
    return res.status(500).json({ error: 'Failed to request hint: ' + error.message });
  }
}

/**
 * POST /api/cases/:id/accuse
 * Submit accusation and determine verdict and final score
 */
export async function accuseSuspect(req, res) {
  try {
    const { id } = req.params;
    const { suspectId, reasoning = '' } = req.body;

    if (!suspectId) {
      return res.status(400).json({ error: 'Must provide suspectId to accuse.' });
    }

    let targetCase = null;
    let isMemory = false;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      targetCase = await Case.findById(id);
    } else if (memoryCases.has(id)) {
      targetCase = memoryCases.get(id);
      isMemory = true;
    }

    if (!targetCase) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    if (targetCase.status !== 'in_progress') {
      return res.status(400).json({ error: 'Accusation already submitted for this case.' });
    }

    const accused = targetCase.suspects.find(s => s.id === suspectId);
    if (!accused) {
      return res.status(404).json({ error: 'Suspect does not exist in this case.' });
    }

    const isCorrect = suspectId === targetCase.solution.culpritId;
    const discoveredCount = targetCase.clues.filter(c => c.discovered).length;
    const hintsRevealed = targetCase.hints.filter(h => h.revealed).length;

    const finalScore = calculateScore({
      difficulty: targetCase.difficulty,
      isCorrect,
      discoveredCluesCount: discoveredCount,
      hintsRevealedCount: hintsRevealed
    });

    targetCase.status = isCorrect ? 'solved' : 'failed';
    targetCase.accusation = {
      accusedSuspectId: accused.id,
      accusedSuspectName: accused.name,
      reasoning,
      isCorrect,
      submittedAt: new Date()
    };
    targetCase.score = finalScore;

    if (isMemory) {
      memoryCases.set(id, targetCase);
    } else {
      await targetCase.save();
    }

    // Now reveal full case data including solution
    const finalData = isMemory ? JSON.parse(JSON.stringify(targetCase)) : targetCase.toObject();

    return res.json({
      verdict: isCorrect ? 'CASE CLOSED - GUILTY' : 'COLD CASE - WRONGFUL ACCUSATION',
      isCorrect,
      accused: accused.name,
      culprit: targetCase.solution.culpritName,
      score: finalScore,
      solution: targetCase.solution,
      case: finalData
    });
  } catch (error) {
    console.error('[CaseController] accuseSuspect error:', error);
    return res.status(500).json({ error: 'Failed to submit accusation: ' + error.message });
  }
}

/**
 * GET /api/cases/:id/result
 * Retrieve completed result after accusation has been made
 */
export async function getCaseResult(req, res) {
  try {
    const { id } = req.params;

    let targetCase = null;
    let isMemory = false;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      targetCase = await Case.findById(id);
    } else if (memoryCases.has(id)) {
      targetCase = memoryCases.get(id);
      isMemory = true;
    }

    if (!targetCase) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    if (targetCase.status === 'in_progress') {
      return res.status(400).json({
        error: 'The case is still in progress. Submit an accusation to see the result and solution.'
      });
    }

    const fullDoc = isMemory ? JSON.parse(JSON.stringify(targetCase)) : targetCase.toObject();

    return res.json({
      verdict: targetCase.accusation?.isCorrect ? 'CASE CLOSED - GUILTY' : 'COLD CASE - WRONGFUL ACCUSATION',
      isCorrect: targetCase.accusation?.isCorrect || false,
      accusation: targetCase.accusation,
      score: targetCase.score,
      solution: targetCase.solution,
      case: fullDoc
    });
  } catch (error) {
    console.error('[CaseController] getCaseResult error:', error);
    return res.status(500).json({ error: 'Failed to fetch case result: ' + error.message });
  }
}
