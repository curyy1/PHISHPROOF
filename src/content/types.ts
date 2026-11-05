/**
 * Typed course content. Everything a learner sees (lessons, quizzes, simulator
 * items) is defined as data in src/content and validated by
 * scripts/validate-content.ts. SAFETY RULE: every brand is fictional and every
 * domain uses a reserved name (example.com/.net/.org, *.example, *.test, *.invalid)
 * or a documentation IP range (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24).
 */

/** Red-flag categories. Drill results are tracked per category to find weak spots. */
export type FlagType =
  | "sender" // sender name/address doesn't match who they claim to be
  | "lookalike" // misspelled / lookalike domain or characters
  | "link" // link text and real destination differ, shorteners, odd URLs
  | "urgency" // pressure, deadlines, threats
  | "request" // asks for passwords, codes, money, gift cards, personal info
  | "attachment" // unexpected or dangerous attachments
  | "too-good" // prizes, refunds, free stuff (greed/curiosity)
  | "context" // unexpected message, generic greeting, doesn't fit the situation
  | "url-structure"; // subdomain tricks, IPs, @ tricks, path tricks

export type Difficulty = "easy" | "medium" | "hard";

/** Rich text: a tiny, safe markdown subset rendered by <RichText>: **bold**, *italic*, `code`. */
export type Rich = string;

export type Block =
  | { type: "p"; text: Rich }
  | { type: "h"; text: string }
  | { type: "list"; items: Rich[]; ordered?: boolean }
  | { type: "callout"; tone: "tip" | "warning" | "fact" | "myth"; title?: string; text: Rich }
  | { type: "stat"; value: string; label: Rich; source?: string }
  | { type: "steps"; items: { title: string; text: Rich }[] }
  | { type: "compare"; left: { title: string; items: Rich[] }; right: { title: string; items: Rich[] } }
  | {
      type: "url";
      /** URL broken into labeled parts, rendered as an annotated diagram. */
      parts: { text: string; label?: string; tone?: "neutral" | "good" | "bad" | "warn" }[];
      caption?: Rich;
    }
  | {
      type: "message";
      kind: "email" | "sms" | "dm" | "call";
      from: string;
      subject?: string;
      body: Rich[];
      note?: Rich;
      verdict?: "phish" | "legit";
    }
  | {
      type: "check";
      question: string;
      options: { text: string; correct?: boolean; why: Rich }[];
    };

export type Lesson = {
  id: string; // globally unique slug
  title: string;
  summary: string;
  minutes: number;
  blocks: Block[];
  takeaways: Rich[];
};

export type QuizOption = { text: string; correct?: boolean; why: Rich };
export type QuizQuestion = {
  id: string; // globally unique
  prompt: Rich;
  /** Optional mini exhibit shown above the options (e.g. a URL or message). */
  exhibit?: Extract<Block, { type: "message" } | { type: "url" }>;
  options: QuizOption[];
};

export type DrillRef =
  | { kind: "inbox"; itemIds: string[] }
  | { kind: "sms"; itemIds: string[] }
  | { kind: "browser"; itemIds: string[] }
  | { kind: "urls"; itemIds: string[] }
  | { kind: "passwords" }
  | { kind: "scenario"; scenarioId: string };

export type Module = {
  id: string; // URL slug
  number: number;
  title: string;
  tagline: string;
  description: string;
  icon: string; // emoji, decorative
  lessons: Lesson[];
  drill: { title: string; description: string; ref: DrillRef };
  quiz: QuizQuestion[];
  /** Guests (no account) can open this module. */
  guestAccessible?: boolean;
};

/* ---------------------------------- Simulators --------------------------------- */

/** A clickable piece of a message. `hs` = hotspot id (a real red flag). Without `hs` it's a decoy (fine). */
export type Segment = string | { t: string; id: string; hs?: string; href?: string };

export type Hotspot = { id: string; type: FlagType; label: string; explain: Rich };

export type Email = {
  id: string;
  difficulty: Difficulty;
  isPhish: boolean;
  from: { name: string; address: string; hs?: string };
  replyTo?: { address: string; hs?: string };
  to: string;
  subject: { text: string; hs?: string };
  date: string;
  /** Paragraphs made of segments. */
  body: Segment[][];
  attachments?: { id: string; name: string; size: string; hs?: string }[];
  hotspots: Hotspot[];
  /** Shown after answering. For legit emails, explain the good signs. */
  explain: Rich;
};

export type SmsMessage = { me?: boolean; time: string; body: Segment[]; image?: { kind: "qr"; alt: string; decoded: string; hs?: string; id: string } };
export type Sms = {
  id: string;
  difficulty: Difficulty;
  isPhish: boolean;
  channel: "sms" | "dm" | "voicemail";
  contact: { name: string; detail: string; hs?: string };
  messages: SmsMessage[];
  hotspots: Hotspot[];
  explain: Rich;
};

export type BrowserPage = {
  id: string;
  difficulty: Difficulty;
  isPhish: boolean;
  /** What the learner was doing — sets the expectation. */
  scenario: Rich;
  /** The URL in the address bar, split into clickable parts. */
  url: { scheme: "https" | "http"; parts: { t: string; id: string; hs?: string }[] };
  brand: { name: string; color: string; initial: string };
  pageTitle: string;
  hotspots: Hotspot[];
  explain: Rich;
};

export type UrlItem = {
  id: string;
  difficulty: Difficulty;
  /** The site the learner expects, e.g. "Lumen Bank (lumenbank.example)". */
  expect: string;
  url: string;
  safe: boolean;
  type: FlagType | "safe";
  explain: Rich;
};

export type Scenario = {
  id: string;
  title: string;
  intro: Rich;
  steps: {
    id: string;
    situation: Rich;
    choices: { text: string; best?: boolean; feedback: Rich }[];
  }[];
};

export type ExamQuestion = QuizQuestion & { moduleId: string };
