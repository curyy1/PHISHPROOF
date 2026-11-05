/**
 * Lightweight module catalog for pages that only need titles (the landing page), so they
 * don't ship the full course text. Kept in sync with src/content/modules by scripts/validate-content.ts.
 */
export const catalog = [
  {
    "id": "what-is-phishing",
    "number": 1,
    "title": "What is phishing?",
    "tagline": "Why smart people still take the bait.",
    "icon": "🎣",
    "lessons": 4
  },
  {
    "id": "email-red-flags",
    "number": 2,
    "title": "Email red flags",
    "tagline": "Read an email like a detective.",
    "icon": "📧",
    "lessons": 5
  },
  {
    "id": "reading-links",
    "number": 3,
    "title": "Reading links & URLs",
    "tagline": "Find out where a link really goes.",
    "icon": "🔗",
    "lessons": 5
  },
  {
    "id": "beyond-email",
    "number": 4,
    "title": "Texts, calls, QR codes & DMs",
    "tagline": "Phishing followed you to your phone.",
    "icon": "📱",
    "lessons": 4
  },
  {
    "id": "advanced-attacks",
    "number": 5,
    "title": "Advanced attacks",
    "tagline": "When the scam knows your name.",
    "icon": "🎯",
    "lessons": 5
  },
  {
    "id": "passwords-and-accounts",
    "number": 6,
    "title": "Passwords & accounts",
    "tagline": "Make a stolen password useless.",
    "icon": "🔐",
    "lessons": 4
  },
  {
    "id": "what-to-do",
    "number": 7,
    "title": "What to do",
    "tagline": "Resist. Report. Delete.",
    "icon": "🛡️",
    "lessons": 4
  }
] as const;
