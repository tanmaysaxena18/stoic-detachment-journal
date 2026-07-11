import { Pillar, Quote, ShieldScenario } from "./types";

export const CATEGORY_INFO: Record<Pillar, { emoji: string; title: string; desc: string }> = {
  [Pillar.HumanNature]: {
    emoji: "⚡",
    title: "Human Nature & Manipulation",
    desc: "Analytical dissection of human transactional dynamics, ego, and the social chessboard."
  },
  [Pillar.ExpectationsConflict]: {
    emoji: "⚖️",
    title: "Expectations, Regret & Conflict",
    desc: "The cost of projecting desires onto reality and the dynamics of relational frictions."
  },
  [Pillar.LoveLoss]: {
    emoji: "🥀",
    title: "Love, Heartbreak & Loss of Connection",
    desc: "Clinical observation of emotional dependency, romantic illusions, and drifting apart."
  },
  [Pillar.IsolationShield]: {
    emoji: "🛡️",
    title: "Isolation, Silence & The Inner Shield",
    desc: "Developing self-reliance, stoic containment, and building an unassailable mindset."
  },
  [Pillar.ImpermanenceGrowth]: {
    emoji: "⏳",
    title: "Impermanence & Growth",
    desc: "Embracing change, learning through futility, and constant individual evolution."
  },
  [Pillar.SystemsLogic]: {
    emoji: "📊",
    title: "Systems & Data Logic",
    desc: "Applying systemic, technical, and architectural principles to life and emotional variables."
  },
  [Pillar.DialogueMask]: {
    emoji: "🎭",
    title: "The Dialogue of the Mask",
    desc: "The dichotomy between social presentation and underlying stoic reality."
  },
  [Pillar.EmotionalImmaturity]: {
    emoji: "📉",
    title: "The Cost of Emotional Immaturity",
    desc: "The clinical audit of what is lost when logic is surrendered to raw feeling."
  },
  [Pillar.TheShift]: {
    emoji: "🚪",
    title: "The Shift",
    desc: "Drastic pivots in perception, state transition, and the sudden severance of illusions."
  },
  [Pillar.VersesRhymes]: {
    emoji: "📝",
    title: "Verses & Rhymes",
    desc: "Poetic abstractions of decay, transience, accountability, and silence."
  }
};

export const INITIAL_QUOTES: Quote[] = [
  // Human Nature & Manipulation
  {
    id: "hn-1",
    text: "The best manipulation is thinking you are alone and you have to fight alone.",
    category: Pillar.HumanNature
  },
  {
    id: "hn-2",
    text: "People become liars not to gain something, but to escape reality through their own fabrications.",
    category: Pillar.HumanNature
  },
  {
    id: "hn-3",
    text: "The more you know the people around you, the more you will understand why being alone is important.",
    category: Pillar.HumanNature
  },
  {
    id: "hn-4",
    text: "A man will never admit it, but a female's interaction will always boost his ego.",
    category: Pillar.HumanNature
  },
  {
    id: "hn-5",
    text: "Why are girls so kleptic? Because they never forget to steal our hearts.",
    category: Pillar.HumanNature
  },
  {
    id: "hn-6",
    text: "Sudden opening of a person's persona may be a sign of how sad and depressed they were back then.",
    category: Pillar.HumanNature
  },
  {
    id: "hn-7",
    text: "Those who keep drinking poison due to others will either die of it one day, or become toxic enough to not let anyone else live.",
    category: Pillar.HumanNature
  },
  {
    id: "hn-8",
    text: "It was all just a rattrap—and we only realize it when we are finally caught inside.",
    category: Pillar.HumanNature
  },
  {
    id: "hn-9",
    text: "Sometimes ideals and hope work merely as a coping mechanism to keep ourselves going. It may sound bitter, but it is what it is.",
    category: Pillar.HumanNature
  },
  {
    id: "hn-10",
    text: "If you ever get high on ego, recall what happened to Ravana, the great Shiv Bhakta.",
    category: Pillar.HumanNature
  },
  {
    id: "hn-11",
    text: "The one who lights up others' worlds often lives the darkest life.",
    category: Pillar.HumanNature
  },
  {
    id: "hn-12",
    text: "People who seem the brightest hide the darkest secrets.",
    category: Pillar.HumanNature
  },

  // Expectations, Regret & Conflict
  {
    id: "erc-1",
    text: "Regret will always be a byproduct of expectation.",
    category: Pillar.ExpectationsConflict
  },
  {
    id: "erc-2",
    text: "The root of all suffering is expecting to bear fruits from someone else's tree.",
    category: Pillar.ExpectationsConflict
  },
  {
    id: "erc-3",
    text: "Efforts will always betray when you want something in return, because the latter is business and the former is kindness.",
    category: Pillar.ExpectationsConflict
  },
  {
    id: "erc-4",
    text: "It's not the investment that matters in a relationship; the thing that matters is genuinity.",
    category: Pillar.ExpectationsConflict
  },
  {
    id: "erc-5",
    text: "Anger will always rise from unfulfilled desire or being disappointed by someone.",
    category: Pillar.ExpectationsConflict
  },
  {
    id: "erc-6",
    text: "Do you know why a conflict rises? It's because of unfulfilled promises, wishes, and prolonged ignorance.",
    category: Pillar.ExpectationsConflict
  },
  {
    id: "erc-7",
    text: "Boundaries are always required, whether it is a match of cricket or relationships.",
    category: Pillar.ExpectationsConflict
  },
  {
    id: "erc-8",
    text: "No matter how hard you work, there will always be someone who will be disappointed with you.",
    category: Pillar.ExpectationsConflict
  },
  {
    id: "erc-9",
    text: "Use data to persuade a decision instead of just loud banter or big talk.",
    category: Pillar.ExpectationsConflict
  },
  {
    id: "erc-10",
    text: "Never get so lost in the feeling of revenge that you end up losing your loved ones.",
    category: Pillar.ExpectationsConflict
  },
  {
    id: "erc-11",
    text: "No matter how much you suffer, the other person's suffering will always be greater.",
    category: Pillar.ExpectationsConflict
  },
  {
    id: "erc-12",
    text: "Everyone deserves a chance at forgiveness, as long as they are willing to admit their fault and accept the consequences.",
    category: Pillar.ExpectationsConflict
  },
  {
    id: "erc-13",
    text: "Those who get too lost in others' work often tend to lose their own.",
    category: Pillar.ExpectationsConflict
  },

  // Love, Heartbreak & Loss of Connection
  {
    id: "lh-1",
    text: "One of the worst kinds of pain is to sacrifice for someone who misunderstands it for a betrayal.",
    category: Pillar.LoveLoss
  },
  {
    id: "lh-2",
    text: "You will be too late to realize what you're robbed of when you're in love.",
    category: Pillar.LoveLoss
  },
  {
    id: "lh-3",
    text: "Love will always lead to resentment if it is with the wrong person.",
    category: Pillar.LoveLoss
  },
  {
    id: "lh-4",
    text: "Love and resentment aren't mutually exclusive.",
    category: Pillar.LoveLoss
  },
  {
    id: "lh-5",
    text: "Resentment and Remorse are always directly proportional to each other.",
    category: Pillar.LoveLoss
  },
  {
    id: "lh-6",
    text: "I've never found a thing more dangerous than this, which is called one-sided love.",
    category: Pillar.LoveLoss
  },
  {
    id: "lh-7",
    text: "Why take a heartbreak when the best thing you can do is 'Zone' them?",
    category: Pillar.LoveLoss
  },
  {
    id: "lh-8",
    text: "Why waste time talking about a person who is dead for you?",
    category: Pillar.LoveLoss
  },
  {
    id: "lh-9",
    text: "To be angry or sad with a person and not confronting them is a sign of immaturity.",
    category: Pillar.LoveLoss
  },
  {
    id: "lh-10",
    text: "Love makes you blind, and blindness is accompanied by loss of vision. By it, you become inactive. By inactivity, you lose movement. By loss of movement, you become lethargic. By being lethargic, you lose energy, and gradually, this loss of energy will lead you toward your death.",
    category: Pillar.LoveLoss
  },
  {
    id: "lh-11",
    text: "The worst pain is not a cut, a bruise, or a broken nose; it is when the people you made memories with slowly become memories themselves.",
    category: Pillar.LoveLoss
  },

  // The Cost of Emotional Immaturity
  {
    id: "cei-1",
    text: "The cost of emotional immaturity is losing a sibling-like friend, a quiet friend group, a good mentor, one roleplay, and one project.",
    category: Pillar.EmotionalImmaturity
  },

  // The Shift
  {
    id: "ts-1",
    text: "Worst heartbreak journey was going from a SISCON to SIS Kaun?",
    category: Pillar.TheShift
  },
  {
    id: "ts-2",
    text: "From SISCON to ISKCON, the journey was always one of the toughest.",
    category: Pillar.TheShift
  },
  {
    id: "ts-3",
    text: "Why go about hitting girls? What spider goes out of its web to capture prey?",
    category: Pillar.TheShift
  },

  // Isolation, Silence & The Inner Shield
  {
    id: "is-1",
    text: "I once played with fire, but rather than getting burned, I was frozen.",
    category: Pillar.IsolationShield
  },
  {
    id: "is-2",
    text: "The more you realize, the more you detach yourself from the observable universe.",
    category: Pillar.IsolationShield
  },
  {
    id: "is-3",
    text: "Detachment might be the cure to most of the problems, but it will lead to heavy turmoil.",
    category: Pillar.IsolationShield
  },
  {
    id: "is-4",
    text: "The more you cry, the more you will realize something is drying out faster than your tears—it is your emotions.",
    category: Pillar.IsolationShield
  },
  {
    id: "is-5",
    text: "You can only blindly trust the person in the mirror.",
    category: Pillar.IsolationShield
  },
  {
    id: "is-6",
    text: "Only the person who comes to your help first is your inner god.",
    category: Pillar.IsolationShield
  },
  {
    id: "is-7",
    text: "Fire can never melt a real rock.",
    category: Pillar.IsolationShield
  },
  {
    id: "is-8",
    text: "Sometimes, some people don't deserve your mercy; they deserve to get burned.",
    category: Pillar.IsolationShield
  },
  {
    id: "is-9",
    text: "Remember: avoiding someone can sometimes lead them straight to you.",
    category: Pillar.IsolationShield
  },
  {
    id: "is-10",
    text: "Why go around looking strong, when you can look weak and do exactly what you want to do?",
    category: Pillar.IsolationShield
  },
  {
    id: "is-11",
    text: "Pain builds men; softness makes them stay a boy.",
    category: Pillar.IsolationShield
  },
  {
    id: "is-12",
    text: "If you think you have gone through hell, then it was just a warmup.",
    category: Pillar.IsolationShield
  },
  {
    id: "is-13",
    text: "To die with a burn and to burn to die are two completely different things.",
    category: Pillar.IsolationShield
  },
  {
    id: "is-14",
    text: "Abandoning emotions and being emotionless is the exact same as leaving the body and claiming you are the soul.",
    category: Pillar.IsolationShield
  },
  {
    id: "is-15",
    text: "Never explain yourself; your enemies won't believe you, and your friends don't need it.",
    category: Pillar.IsolationShield
  },
  {
    id: "is-16",
    text: "If you cannot control yourself, someone else will.",
    category: Pillar.IsolationShield
  },
  {
    id: "is-17",
    text: "To act authentically, you must live your life with authentication.",
    category: Pillar.IsolationShield
  },
  {
    id: "is-18",
    text: "It does not matter how many allies you have; when you die, you will be alone.",
    author: "The Honored One",
    category: Pillar.IsolationShield
  },

  // Impermanence & Growth
  {
    id: "ig-1",
    text: "The biggest truth humans deny is impermanence.",
    category: Pillar.ImpermanenceGrowth
  },
  {
    id: "ig-2",
    text: "Evolution is a process, not the stages of life we go through.",
    category: Pillar.ImpermanenceGrowth
  },
  {
    id: "ig-3",
    text: "Always the fool with the slowest heart.",
    category: Pillar.ImpermanenceGrowth
  },
  {
    id: "ig-4",
    text: "Death awaits us all; what matters is what we do before that fall.",
    category: Pillar.ImpermanenceGrowth
  },
  {
    id: "ig-5",
    text: "People fear change because they think something is not in their range.",
    category: Pillar.ImpermanenceGrowth
  },
  {
    id: "ig-6",
    text: "A goal chased only for its ending guarantees a heartbroken conclusion; you wanted the outcome, not the architecture.",
    category: Pillar.ImpermanenceGrowth
  },
  {
    id: "ig-7",
    text: "Losing a winning game is not something you should learn from a loser.",
    category: Pillar.ImpermanenceGrowth
  },
  {
    id: "ig-8",
    text: "The first person you will defeat will always be you.",
    category: Pillar.ImpermanenceGrowth
  },
  {
    id: "ig-9",
    text: "Creativity is the mother of creation.",
    category: Pillar.ImpermanenceGrowth
  },
  {
    id: "ig-10",
    text: "Destruction leads to creation.",
    author: "Shiva",
    category: Pillar.ImpermanenceGrowth
  },
  {
    id: "ig-11",
    text: "Failure can be fatal, if it happens to be your last lifeline.",
    category: Pillar.ImpermanenceGrowth
  },
  {
    id: "ig-12",
    text: "Competency does not come from birth; it comes by practice.",
    category: Pillar.ImpermanenceGrowth
  },
  {
    id: "ig-13",
    text: "Failure is the one thing that no one ever asks for, but everyone gets at least once in life.",
    category: Pillar.ImpermanenceGrowth
  },
  {
    id: "ig-14",
    text: "Why destroy yourself? Just think what point there could possibly be to committing such a permanent atrocity.",
    category: Pillar.ImpermanenceGrowth
  },
  {
    id: "ig-15",
    text: "You will face losses, but it is the way that you look at them that makes you get over them.",
    category: Pillar.ImpermanenceGrowth
  },
  {
    id: "ig-16",
    text: "Pain, suffering, and futility make you who you should be, instead of what you do not want to be: a failure.",
    category: Pillar.ImpermanenceGrowth
  },
  {
    id: "ig-17",
    text: "It may be your last attempt, but it will always be in your hands to give your 100%.",
    category: Pillar.ImpermanenceGrowth
  },
  {
    id: "ig-18",
    text: "Either learn to earn, or earn to live.",
    category: Pillar.ImpermanenceGrowth
  },

  // Systems & Data Logic
  {
    id: "sdl-1",
    text: "Atomicity means a single value—but no one ever asked if it was only about a column.",
    category: Pillar.SystemsLogic
  },
  {
    id: "sdl-2",
    text: "To know something and to apply what you know is what separates a bookworm from a genius.",
    category: Pillar.SystemsLogic
  },

  // Dialogue of the Mask
  {
    id: "dom-1",
    text: "External: 'Others: Why can't you just stop thinking about her?'\nInternal: 'Me: How can I, being a human, see her in anguish and pain because of a misunderstanding created by me?'",
    category: Pillar.DialogueMask
  },
  {
    id: "dom-2",
    text: "External: 'Why are you so serious?'\nInternal: 'Me: Wasn't she serious back then when she said, 'You'll regret it'?'",
    category: Pillar.DialogueMask
  },
  {
    id: "dom-3",
    text: "External: 'Someone asks: Why are you laughing?'\nInternal: 'Just say: Isn't laughing better than crying?'",
    category: Pillar.DialogueMask
  },
  {
    id: "dom-4",
    text: "External: 'Someone asks: Why are you so silent?'\nInternal: 'When did you ever see a tsunami coming from turbulent waters?'",
    category: Pillar.DialogueMask
  },

  // Verses & Rhymes
  {
    id: "vr-1",
    text: "I once spoke, and slowly, I fell silent.\nI once laughed, and slowly, I grew hollow.\nI once screamed, and slowly, I lost my voice.\nI once cried, and slowly, I ran out of tears.\n(The Erosion)",
    category: Pillar.VersesRhymes
  },
  {
    id: "vr-2",
    text: "Baarish mein girta hai paani,\nSuna hai gira rahe ho tum uske liye yaani.\n(The Transience)",
    category: Pillar.VersesRhymes
  },
  {
    id: "vr-3",
    text: "Blaming doesn't always prove you right,\nA fight like that would end up flaming you bright.",
    category: Pillar.VersesRhymes
  },
  {
    id: "vr-4",
    text: "You're not the body, you're the soul,\nSo why keep making a hole in the boat—\nAnd keep all the gloat?",
    category: Pillar.VersesRhymes
  },
  {
    id: "vr-5",
    text: "Why go crying about something for even a day,\nWhen you know it is lost forever?",
    category: Pillar.VersesRhymes
  },
  {
    id: "vr-6",
    text: "Always remember to win for someone, and win someone,\nAre two completely different things.",
    category: Pillar.VersesRhymes
  },
  {
    id: "vr-7",
    text: "Why fumble while lifting a dumbbell?\nDecrease the weight, Mr. Humble.",
    category: Pillar.VersesRhymes
  }
];

export const SHIELD_SCENARIOS: ShieldScenario[] = [
  {
    id: "scenario-1",
    scenario: "An intimate friend of five years suddenly ignores your messages and begins publicizing a minor private dispute to mutual peers.",
    vulnerabilityText: "You experience immediate panic, draft a 10-paragraph defensive retaliation, and check their status indicators hourly."
  },
  {
    id: "scenario-2",
    scenario: "A highly-anticipated project you led for three months is canceled overnight because of an executive level restructuring.",
    vulnerabilityText: "You feel worthless, take the decision personally, and waste several days seeking validation and blaming corporate politics."
  },
  {
    id: "scenario-3",
    scenario: "A romantic partner of several months tells you they 'need space' and abruptly distances themselves without clear feedback.",
    vulnerabilityText: "You blame yourself, obsessively analyze their last texts, send multiple pleading voicemails, and experience intense despair."
  },
  {
    id: "scenario-4",
    scenario: "Someone in your professional or study circle makes an analytical claim using false/manipulated facts to overshadow your efforts.",
    vulnerabilityText: "You raise your voice, argue defensively in public, and stay awake late at night fueled by intense resentment and a desire for revenge."
  }
];
