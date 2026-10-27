import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

// Zod schemas for validating Gemini AI output
const SuspectSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  alibi: z.string(),
  motive: z.string(),
  demeanor: z.string().optional().default('Suspicious'),
  dialogue: z.string().optional().default('')
});

const ClueSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  location: z.string().optional().default('Crime Scene')
});

const HintSchema = z.object({
  id: z.string(),
  order: z.number(),
  text: z.string()
});

const SolutionSchema = z.object({
  culpritId: z.string(),
  culpritName: z.string(),
  motive: z.string(),
  means: z.string(),
  opportunity: z.string(),
  fullExplanation: z.string()
});

export const MysterySchema = z.object({
  title: z.string(),
  story: z.string(),
  setting: z.string(),
  victim: z.object({
    name: z.string(),
    role: z.string(),
    details: z.string()
  }),
  crime: z.string(),
  suspects: z.array(SuspectSchema),
  clues: z.array(ClueSchema),
  hints: z.array(HintSchema),
  solution: SolutionSchema
});

// Spec requirements by difficulty
export const DIFFICULTY_CONFIG = {
  Easy: { suspects: 3, clues: 5, hints: 2 },
  Medium: { suspects: 4, clues: 7, hints: 3 },
  Hard: { suspects: 5, clues: 9, hints: 3 }
};

/**
 * Fallback procedural mystery generator in case GEMINI_API_KEY is not configured or offline.
 */
function generateFallbackMystery(premise, difficulty) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.Medium;

  const themes = [
    {
      title: "The Phantom of Ravenswood Manor",
      setting: "A thunderstorm-drenched Victorian manor isolated by a washed-out bridge",
      victim: { name: "Lord Alistair Ravenswood", role: "Eccentric antiquities collector and billionaire", details: "Found poisoned in his locked private study with a shattered pocket watch." },
      crime: "Murder by rare alkaloid venom injected into his nightly port wine."
    },
    {
      title: "The Silicon Valley Cipher",
      setting: "The top-floor server penthouse of Apex Technologies during a launch gala",
      victim: { name: "Elena Vance", role: "Chief Security Architect", details: "Found unconscious beside an erased cryogenic mainframe with encrypted hardware tokens missing." },
      crime: "Corporate espionage and intentional fatal sabotage of life-support telemetry."
    },
    {
      title: "The Midnight Louvre Heist",
      setting: "A moonlit grand wing of the Grand Palais museum during midnight patrol",
      victim: { name: "Antoine Mercier", role: "Head Curator", details: "Discovered bound and silenced inside the vault with the priceless 'Sunburst Diamond' swapped for lead glass." },
      crime: "Multi-million dollar art jewel theft and aggravated assault."
    }
  ];

  const selectedTheme = themes[Math.floor(Math.random() * themes.length)];

  // Suspect pool
  const allSuspects = [
    {
      id: "suspect_1",
      name: "Arthur Pendelton",
      role: "Personal Butler / Confidant",
      alibi: "Polishing silver in the pantry between 10:00 PM and 11:30 PM. Claims he heard no footsteps.",
      motive: "Discovered he was cut out of the newly amended last will and testament.",
      demeanor: "Nervous, repeatedly rubs his cufflinks, speaks with clipped precision.",
      dialogue: "I served the family for thirty-two years! Why would I destroy my life's quiet retreat?"
    },
    {
      id: "suspect_2",
      name: "Vivienne Westwood-Cobb",
      role: "Estranged Business Partner",
      alibi: "Taking an urgent conference call on the terrace. Cell tower timestamps show heavy packet loss.",
      motive: "Lord Ravenswood threatened to reveal fraudulent accounting in their joint offshore holdings.",
      demeanor: "Cold, calculated, highly defensive when asked about timestamps.",
      dialogue: "Business disagreements are settled in chancery court, detective, not with cheap theatrics."
    },
    {
      id: "suspect_3",
      name: "Dr. Julian Finch",
      role: "Private Physician & Toxicologist",
      alibi: "Reviewing medical journals in the guest library with headphones on.",
      motive: "Blackmailed by the victim over forged clinical trials and medical malpractice.",
      demeanor: "Sweating slightly, smelling faintly of surgical disinfectant and pipe tobacco.",
      dialogue: "His heart was failing anyway. I did everything in my power to keep him alive."
    },
    {
      id: "suspect_4",
      name: "Cassandra Croft",
      role: "Apprentice Archivist & Rare Book Specialist",
      alibi: "Cataloging manuscripts in the south wing archives until the alarm sounded.",
      motive: "Seeking revenge for her family's heirloom collection plundered decades ago.",
      demeanor: "Unflinching gaze, gloves still worn, evasive regarding archival keys.",
      dialogue: "Some relics hold curses; greed always extracts its payment eventually."
    },
    {
      id: "suspect_5",
      name: "Marcus Vance",
      role: "Disinherited Stepson",
      alibi: "Claims he was asleep in the carriage house after drinking heavily.",
      motive: "Massive underground gambling debts coming due at midnight.",
      demeanor: "Agitated, pacing erratically, mud stains visible on his leather boots.",
      dialogue: "Check my pockets all you want! I didn't touch him, I just wanted what was mine!"
    }
  ];

  // Clue pool
  const allClues = [
    {
      id: "clue_1",
      title: "Shattered Pocket Watch",
      description: "Found beside the desk, hands frozen at 10:42 PM. The glass casing has trace oily residue matching apothecary lubricant.",
      location: "Private Study Floor"
    },
    {
      id: "clue_2",
      title: "Torn Manuscript Page",
      description: "A partially burned scrap from an 18th-century medical ledger detailing belladonna extraction ratios.",
      location: "Fireplace Hearth"
    },
    {
      id: "clue_3",
      title: "Rare Silver Cufflink",
      description: "Monogrammed silver cufflink with an engraved viper insignia, jammed beneath the floorboard.",
      location: "Under Study Rug"
    },
    {
      id: "clue_4",
      title: "Muddy Wingtip Footprints",
      description: "Size 10 shoe impressions leading from the terrace door directly to the victim's decanter.",
      location: "Terrace French Doors"
    },
    {
      id: "clue_5",
      title: "Altered Pharmacy Log",
      description: "A clinic ledger showing a missing ampoule of cardiac-inhibiting curare signed with a forged initials.",
      location: "Library Wastebasket"
    },
    {
      id: "clue_6",
      title: "Smudged Glasses Case",
      description: "Silk cleaning cloth stained with forensic dye that glows faintly under ultraviolet light.",
      location: "Side Table"
    },
    {
      id: "clue_7",
      title: "Encrypted Audio Dictaphone",
      description: "A 30-second recording capturing a muffled dispute: 'You promised me the papers before midnight!' followed by a gasp.",
      location: "Study Bookshelf"
    },
    {
      id: "clue_8",
      title: "Smelling Salts Vial",
      description: "Glass vial with a scratched-out serial number commonly used by medical professionals to mask toxin odors.",
      location: "Guest Coat Pocket"
    },
    {
      id: "clue_9",
      title: "Blackmail Letter Draft",
      description: "Handwritten draft on crested stationary demanding immediate resignation and surrender of medical license.",
      location: "Victim's Safe"
    }
  ];

  // Hints pool
  const allHints = [
    {
      id: "hint_1",
      order: 1,
      text: "Compare the medical knowledge required for the venom with each suspect's verified profession and access to surgical disinfectants."
    },
    {
      id: "hint_2",
      order: 2,
      text: "The frozen time on the pocket watch (10:42 PM) directly contradicts the physician's claim that he was secluded listening to music all night."
    },
    {
      id: "hint_3",
      order: 3,
      text: "Notice the pharmacy log and the smelling salts vial: only Dr. Julian Finch possessed both the lethal dosage knowledge and the monogrammed viper cufflink."
    }
  ];

  const suspects = allSuspects.slice(0, config.suspects);
  const clues = allClues.slice(0, config.clues);
  const hints = allHints.slice(0, config.hints);

  // Culprit is designated as suspect_3 (Dr. Julian Finch) if present, or suspect_1
  const culprit = suspects.find(s => s.id === 'suspect_3') || suspects[0];

  return {
    title: premise ? `Mystery: ${premise.slice(0, 45)}` : selectedTheme.title,
    story: `On a cold and turbulent evening, ${selectedTheme.victim.name} was discovered motionless in ${selectedTheme.setting}. ${selectedTheme.crime} The local authorities have sealed the perimeter, but the truth remains buried behind conflicting alibis and concealed motives. As the lead detective, you must examine the suspects, unearth key clues, and deduce who executed this calculated crime.`,
    setting: selectedTheme.setting,
    victim: selectedTheme.victim,
    crime: selectedTheme.crime,
    suspects,
    clues,
    hints,
    solution: {
      culpritId: culprit.id,
      culpritName: culprit.name,
      motive: culprit.motive,
      means: "Administered high-grade cardiac toxin into the victim's drink using medical access.",
      opportunity: "Sneaked into the study at 10:40 PM under the pretense of delivering evening medication, shattering the victim's watch during the struggle.",
      fullExplanation: `The evidence incontrovertibly points to ${culprit.name}. The torn manuscript page and missing pharmacy ampoule established that specialized toxicological knowledge was required. While ${culprit.name} claimed to have been listening to journals in the library, his monogrammed cufflink was recovered beneath the study rug, and forensic analysis confirmed the smelling salts in his possession were used to conceal the poison's scent.`
    }
  };
}

/**
 * Generate mystery using Gemini API or fallback
 */
export async function generateMysteryWithGemini(premise, difficulty = 'Medium') {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.Medium;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
    console.warn('[GeminiService] No GEMINI_API_KEY found in environment. Generating high-quality procedural case.');
    return generateFallbackMystery(premise, difficulty);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a master mystery game designer and detective author.
Generate a compelling, logically airtight murder mystery or heist puzzle based on:
Premise: "${premise || 'A high-stakes locked room murder mystery'}"
Difficulty: "${difficulty}"

STRICT REQUIREMENTS:
1. Suspects count: Exactly ${config.suspects}.
2. Clues count: Exactly ${config.clues}.
3. Hints count: Exactly ${config.hints}.
4. One suspect MUST be designated as the definitive culprit in the solution.
5. All clues must logically support the solution without contradictions. Innocent suspects must have reasonable red herrings, but clear physical or alibi evidence must identify the true culprit.
6. The hints should progressively guide the player without giving away the name on hint 1.

Return ONLY a valid JSON object matching this exact structure:
{
  "title": "A captivating, atmospheric title",
  "story": "Engaging narrative paragraph establishing the crime, atmosphere, and mystery",
  "setting": "Specific location and atmosphere",
  "victim": {
    "name": "Full name",
    "role": "Social status or occupation",
    "details": "Context about the victim"
  },
  "crime": "Description of the crime committed",
  "suspects": [
    {
      "id": "suspect_1",
      "name": "Full Name",
      "role": "Relationship or occupation",
      "alibi": "Where they claim they were",
      "motive": "Potential reason for crime",
      "demeanor": "Body language / personality",
      "dialogue": "A short in-character quote to the detective"
    }
  ],
  "clues": [
    {
      "id": "clue_1",
      "title": "Short descriptive title",
      "description": "Factual forensic or testimonial clue detail",
      "location": "Where clue was uncovered"
    }
  ],
  "hints": [
    {
      "id": "hint_1",
      "order": 1,
      "text": "Subtle deductive guidance"
    }
  ],
  "solution": {
    "culpritId": "suspect_1",
    "culpritName": "Full Name",
    "motive": "The exact confirmed motive",
    "means": "Weapon or technique utilized",
    "opportunity": "How and when they bypassed alibis",
    "fullExplanation": "Detailed step-by-step deductive explanation connecting clues to the culprit"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text;
    const parsedData = JSON.parse(responseText);

    // Validate with Zod
    const validatedData = MysterySchema.parse(parsedData);

    // Ensure counts match difficulty
    if (validatedData.suspects.length !== config.suspects ||
        validatedData.clues.length !== config.clues ||
        validatedData.hints.length !== config.hints) {
      console.warn('[GeminiService] Counts mismatch in AI output. Normalizing arrays.');
      validatedData.suspects = validatedData.suspects.slice(0, config.suspects);
      validatedData.clues = validatedData.clues.slice(0, config.clues);
      validatedData.hints = validatedData.hints.slice(0, config.hints);
    }

    return validatedData;
  } catch (error) {
    console.error('[GeminiService] Gemini API generation error, using fallback:', error.message);
    return generateFallbackMystery(premise, difficulty);
  }
}
