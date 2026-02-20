// ASL Grammar Converter - Rule-based English to ASL-style grammar

const REMOVE_WORDS = new Set([
  'is', 'am', 'are', 'was', 'were', 'the', 'a', 'an',
  'will', 'shall', 'have', 'has', 'had', 'do', 'does', 'did',
  'been', 'being', 'be', 'to', 'of', 'that', 'this', 'it',
  'can', 'could', 'would', 'should', 'may', 'might', 'must',
]);

const TIME_WORDS = new Set([
  'today', 'tomorrow', 'yesterday', 'now', 'later', 'soon',
  'morning', 'evening', 'night', 'always', 'never', 'sometimes',
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
]);

const VERB_MAP: Record<string, string> = {
  going: 'GO',
  eating: 'EAT',
  running: 'RUN',
  walking: 'WALK',
  talking: 'TALK',
  speaking: 'SPEAK',
  reading: 'READ',
  writing: 'WRITE',
  playing: 'PLAY',
  working: 'WORK',
  sleeping: 'SLEEP',
  drinking: 'DRINK',
  cooking: 'COOK',
  learning: 'LEARN',
  teaching: 'TEACH',
  singing: 'SING',
  dancing: 'DANCE',
  swimming: 'SWIM',
  driving: 'DRIVE',
  sitting: 'SIT',
  standing: 'STAND',
  helping: 'HELP',
  watching: 'WATCH',
  listening: 'LISTEN',
  buying: 'BUY',
  selling: 'SELL',
  giving: 'GIVE',
  taking: 'TAKE',
  making: 'MAKE',
  saying: 'SAY',
  telling: 'TELL',
  thinking: 'THINK',
  feeling: 'FEEL',
  knowing: 'KNOW',
  wanting: 'WANT',
  needing: 'NEED',
  loving: 'LOVE',
  liking: 'LIKE',
  hating: 'HATE',
};

export function convertToASL(text: string): string {
  if (!text.trim()) return '';

  // Clean and split
  const cleaned = text.replace(/[.,!?;:'"]/g, '').toLowerCase().trim();
  const words = cleaned.split(/\s+/);

  // Separate time words, subjects, and content
  const timeWords: string[] = [];
  const contentWords: string[] = [];

  for (const word of words) {
    if (REMOVE_WORDS.has(word)) continue;

    if (TIME_WORDS.has(word)) {
      timeWords.push(word.toUpperCase());
    } else {
      // Map verb forms
      const mapped = VERB_MAP[word];
      if (mapped) {
        contentWords.push(mapped);
      } else {
        // Remove -ing, -ed, -s endings for simplification
        let simplified = word;
        if (simplified.endsWith('ing') && simplified.length > 4) {
          simplified = simplified.slice(0, -3);
        } else if (simplified.endsWith('ed') && simplified.length > 3) {
          simplified = simplified.slice(0, -2);
        } else if (simplified.endsWith('ies') && simplified.length > 4) {
          simplified = simplified.slice(0, -3) + 'y';
        }
        contentWords.push(simplified.toUpperCase());
      }
    }
  }

  // ASL Topic-Comment order: TIME + TOPIC + COMMENT
  const result = [...timeWords, ...contentWords];
  return result.join(' ');
}

// Common ASL signs we have "visual" representations for
export const KNOWN_SIGNS = new Set([
  'HELLO', 'THANK', 'YOU', 'PLEASE', 'SORRY', 'YES', 'NO', 'HELP',
  'WANT', 'NEED', 'LIKE', 'LOVE', 'EAT', 'DRINK', 'SLEEP', 'GO',
  'COME', 'STOP', 'WAIT', 'GOOD', 'BAD', 'HAPPY', 'SAD', 'HOW',
  'WHAT', 'WHERE', 'WHEN', 'WHO', 'WHY', 'I', 'ME', 'MY', 'MINE',
  'YOUR', 'HE', 'SHE', 'WE', 'THEY', 'SCHOOL', 'HOME', 'WORK',
  'FRIEND', 'FAMILY', 'MOTHER', 'FATHER', 'BABY', 'WATER', 'FOOD',
  'NAME', 'LEARN', 'TEACH', 'READ', 'WRITE', 'PLAY', 'RUN', 'WALK',
  'SIT', 'STAND', 'THINK', 'KNOW', 'SEE', 'HEAR', 'FEEL', 'MAKE',
  'GIVE', 'TAKE', 'BUY', 'SELL', 'COOK', 'DRIVE', 'SING', 'DANCE',
  'TODAY', 'TOMORROW', 'YESTERDAY', 'NOW', 'MORNING', 'NIGHT',
  'APPLE', 'BOOK', 'CAR', 'DOG', 'CAT', 'HOUSE', 'PHONE', 'MONEY',
]);

// Hand gesture emoji representations for known signs
export const SIGN_VISUALS: Record<string, { emoji: string; description: string }> = {
  HELLO: { emoji: '👋', description: 'Open hand wave near forehead' },
  THANK: { emoji: '🤲', description: 'Flat hand from chin forward' },
  YOU: { emoji: '👉', description: 'Point forward' },
  PLEASE: { emoji: '🤚', description: 'Flat hand circles chest' },
  SORRY: { emoji: '✊', description: 'Fist circles chest' },
  YES: { emoji: '✊', description: 'Fist nods like head' },
  NO: { emoji: '🤏', description: 'Index + middle finger snap to thumb' },
  HELP: { emoji: '👍', description: 'Fist on palm, lift up' },
  WANT: { emoji: '🤲', description: 'Clawed hands pull toward body' },
  NEED: { emoji: '☝️', description: 'Index finger bends down' },
  LIKE: { emoji: '🤏', description: 'Thumb + middle finger from chest' },
  LOVE: { emoji: '🤟', description: 'ILY handshape' },
  EAT: { emoji: '🤌', description: 'Flat O to mouth' },
  DRINK: { emoji: '🤜', description: 'C-hand tips to mouth' },
  SLEEP: { emoji: '😴', description: '5-hand down face, close' },
  GO: { emoji: '👉', description: 'Both index fingers arc forward' },
  COME: { emoji: '🫴', description: 'Index fingers beckon' },
  STOP: { emoji: '🤚', description: 'Flat hand chops palm' },
  WAIT: { emoji: '🖐️', description: 'Both 5-hands wiggle fingers' },
  GOOD: { emoji: '👍', description: 'Flat hand from chin to palm' },
  BAD: { emoji: '👎', description: 'Flat hand from chin flip down' },
  HAPPY: { emoji: '😊', description: 'Flat hands brush chest up' },
  SAD: { emoji: '😢', description: '5-hands drop down face' },
  I: { emoji: '👆', description: 'Point to self' },
  ME: { emoji: '👆', description: 'Point to self' },
  SCHOOL: { emoji: '👏', description: 'Clap hands twice' },
  HOME: { emoji: '🤌', description: 'Flat O from cheek to jaw' },
  WORK: { emoji: '✊', description: 'Fist taps fist' },
  FRIEND: { emoji: '🤝', description: 'Hook index fingers together' },
  FAMILY: { emoji: '👨‍👩‍👧', description: 'F-hands circle out from body' },
  WATER: { emoji: '💧', description: 'W-hand taps chin' },
  FOOD: { emoji: '🍽️', description: 'Flat O taps mouth' },
  NAME: { emoji: '✌️', description: 'H-fingers tap H-fingers' },
  LEARN: { emoji: '📖', description: 'Pick up from palm to forehead' },
  TODAY: { emoji: '📅', description: 'Y-hands drop down' },
  TOMORROW: { emoji: '👍', description: 'A-hand thumb from cheek forward' },
  YESTERDAY: { emoji: '🔙', description: 'A-hand thumb jaw to ear' },
  NOW: { emoji: '👇', description: 'Y-hands drop sharply' },
  APPLE: { emoji: '🍎', description: 'X-hand twists at cheek' },
  BOOK: { emoji: '📖', description: 'Palms open like book' },
  DOG: { emoji: '🐕', description: 'Snap fingers, pat leg' },
  CAT: { emoji: '🐱', description: 'F-hand from cheek (whiskers)' },
  SEE: { emoji: '👀', description: 'V-hand from eyes outward' },
  HEAR: { emoji: '👂', description: 'Point to ear' },
  THINK: { emoji: '🧠', description: 'Index finger to forehead' },
  KNOW: { emoji: '🤔', description: 'Fingertips tap forehead' },
  WHAT: { emoji: '🤷', description: 'Palms up, shake' },
  WHERE: { emoji: '☝️', description: 'Index finger wags' },
  WHO: { emoji: '👄', description: 'Thumb circles at chin' },
  WHY: { emoji: '🤔', description: 'Touch forehead, bring down Y-hand' },
  MY: { emoji: '🫳', description: 'Palm flat on chest' },
  YOUR: { emoji: '🫴', description: 'Palm pushes toward person' },
  MORNING: { emoji: '🌅', description: 'Flat hand rises in arm crook' },
  NIGHT: { emoji: '🌙', description: 'Bent hand arcs down over arm' },
  READ: { emoji: '📖', description: 'V-hand scans palm' },
  WRITE: { emoji: '✍️', description: 'Mime writing on palm' },
  PLAY: { emoji: '🤙', description: 'Y-hands shake' },
  RUN: { emoji: '🏃', description: 'L-hands hook, pull forward' },
  WALK: { emoji: '🚶', description: 'Flat hands alternate steps' },
  PHONE: { emoji: '📱', description: 'Y-hand to ear' },
  MONEY: { emoji: '💰', description: 'Flat O taps palm' },
  SHE: { emoji: '👉', description: 'Point to side' },
  HE: { emoji: '👉', description: 'Point to side' },
  WE: { emoji: '👉', description: 'Point around group' },
  THEY: { emoji: '👉', description: 'Point and sweep' },
};
