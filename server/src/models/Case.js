import mongoose from 'mongoose';

const SuspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  alibi: { type: String, required: true },
  motive: { type: String, required: true },
  demeanor: { type: String, default: 'Suspicious' },
  dialogue: { type: String, default: '' }
}, { _id: false });

const ClueSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, default: 'Crime Scene' },
  discovered: { type: Boolean, default: false },
  discoveredAt: { type: Date }
}, { _id: false });

const HintSchema = new mongoose.Schema({
  id: { type: String, required: true },
  order: { type: Number, required: true },
  text: { type: String, required: true },
  revealed: { type: Boolean, default: false },
  revealedAt: { type: Date }
}, { _id: false });

const SolutionSchema = new mongoose.Schema({
  culpritId: { type: String, required: true },
  culpritName: { type: String, required: true },
  motive: { type: String, required: true },
  means: { type: String, required: true },
  opportunity: { type: String, required: true },
  fullExplanation: { type: String, required: true }
}, { _id: false });

const AccusationSchema = new mongoose.Schema({
  accusedSuspectId: { type: String },
  accusedSuspectName: { type: String },
  reasoning: { type: String },
  isCorrect: { type: Boolean },
  submittedAt: { type: Date }
}, { _id: false });

const ScoreSchema = new mongoose.Schema({
  basePoints: { type: Number, default: 0 },
  cluesPoints: { type: Number, default: 0 },
  hintsPenalty: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { _id: false });

const CaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  premise: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  story: { type: String, required: true },
  setting: { type: String, default: 'Unknown location' },
  victim: {
    name: { type: String, default: 'Unknown' },
    role: { type: String, default: 'Victim' },
    details: { type: String, default: '' }
  },
  crime: { type: String, required: true },
  suspects: [SuspectSchema],
  clues: [ClueSchema],
  hints: [HintSchema],
  solution: SolutionSchema,
  status: {
    type: String,
    enum: ['in_progress', 'solved', 'failed'],
    default: 'in_progress'
  },
  accusation: AccusationSchema,
  score: { type: ScoreSchema, default: () => ({}) }
}, {
  timestamps: true
});

// Sanitized output for frontend security: strictly hides solution before accusation
CaseSchema.methods.toClientJSON = function () {
  const doc = this.toObject();
  const isFinished = doc.status === 'solved' || doc.status === 'failed';

  if (!isFinished) {
    delete doc.solution;
  }

  // Also mask hint texts that haven't been revealed yet
  doc.hints = doc.hints.map(hint => {
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

  return doc;
};

export const Case = mongoose.model('Case', CaseSchema);
