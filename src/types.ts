export enum Pillar {
  HumanNature = "Human Nature & Manipulation",
  ExpectationsConflict = "Expectations, Regret & Conflict",
  LoveLoss = "Love, Heartbreak & The Loss of Connection",
  IsolationShield = "Isolation, Silence & The Inner Shield",
  ImpermanenceGrowth = "Impermanence & Growth",
  SystemsLogic = "Systems & Data Logic",
  DialogueMask = "The Dialogue of the Mask",
  EmotionalImmaturity = "The Cost of Emotional Immaturity",
  TheShift = "The Shift",
  VersesRhymes = "Verses & Rhymes"
}

export interface Quote {
  id: string;
  text: string;
  author?: string;
  category: Pillar;
}

export interface Post {
  id: string;
  category: Pillar;
  quote: string;
  reflection: string;
  reflectionHinglish?: string;
  reflectionHindi?: string;
  tags: string[];
  dateCreated: string;
  status: "Draft" | "Published" | "Scheduled";
  scheduledDate?: string;
}

export interface DialogueItem {
  id: string;
  external: string;
  internal: string;
  internalHinglish?: string;
  internalHindi?: string;
  timestamp: string;
}

export interface ShieldScenario {
  id: string;
  scenario: string;
  vulnerabilityText: string;
}

export interface ShieldLog {
  id: string;
  scenarioId: string;
  scenarioText: string;
  userResponse: string;
  detachmentScore: number; // 0 to 100
  analysis: string;
  analysisHinglish?: string;
  analysisHindi?: string;
  timestamp: string;
}
