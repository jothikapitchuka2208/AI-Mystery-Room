/**
 * AI Mystery Room Scoring Engine
 * Rules strictly per spec:
 * - Correct Accusation:
 *     Easy: 100 pts
 *     Medium: 150 pts
 *     Hard: 200 pts
 * - Incorrect Accusation: 0 base pts
 * - Each discovered clue: +5 pts
 * - Each hint used (revealed): -10 pts
 * - Minimum score floor: 0
 */

export const BASE_POINTS = {
  Easy: 100,
  Medium: 150,
  Hard: 200
};

export const CLUE_POINTS = 5;
export const HINT_PENALTY = 10;

export function calculateScore({ difficulty, isCorrect, discoveredCluesCount, hintsRevealedCount }) {
  const basePoints = isCorrect ? (BASE_POINTS[difficulty] || 100) : 0;
  const cluesPoints = discoveredCluesCount * CLUE_POINTS;
  const hintsPenalty = hintsRevealedCount * HINT_PENALTY;

  const rawTotal = basePoints + cluesPoints - hintsPenalty;
  const total = Math.max(0, rawTotal);

  return {
    basePoints,
    cluesPoints,
    hintsPenalty,
    total
  };
}
