import type { BrowserPage } from "./types";

/** Fake login page drill. 8 pages, 3 legit. The learner inspects the address bar. Forms never submit. */
export const browserPages: BrowserPage[] = [
  {
    id: "b01",
    difficulty: "easy",
    isPhish: true,
    scenario: "You tapped **Verify my account** in an email from “Lumen Bank.”",
    url: {
      scheme: "https",
      parts: [
        { t: "lumenbank.example", id: "p1", hs: "h-sub" },
        { t: ".verify-id.test", id: "p2", hs: "h-real" },
        { t: "/login", id: "p3" },
      ],
    },
    brand: { name: "Lumen Bank", color: "#0f766e", initial: "L" },
    pageTitle: "Sign in to Online Banking",
    hotspots: [
      { id: "h-sub", type: "url-structure", label: "Brand used as a subdomain", explain: "lumenbank.example is placed at the start to fool you." },
      { id: "h-real", type: "url-structure", label: "Real domain: verify-id.test", explain: "Read right-to-left: this page belongs to **verify-id.test**." },
    ],
    explain: "Subdomain trick. The page looks perfect, but the domain is verify-id.test.",
  },
  {
    id: "b02",
    difficulty: "easy",
    isPhish: false,
    scenario: "You typed **streambox.example** into your browser yourself and clicked Sign in.",
    url: {
      scheme: "https",
      parts: [
        { t: "www.", id: "p1" },
        { t: "streambox.example", id: "p2" },
        { t: "/login", id: "p3" },
      ],
    },
    brand: { name: "StreamBox", color: "#dc2626", initial: "S" },
    pageTitle: "Sign in to StreamBox",
    hotspots: [],
    explain: "Legit. You went direct, and the domain is exactly streambox.example (www. is just StreamBox’s own subdomain).",
  },
  {
    id: "b03",
    difficulty: "medium",
    isPhish: true,
    scenario: "A “shared document” email asked you to sign in to Cloudnest to view a file.",
    url: {
      scheme: "https",
      parts: [
        { t: "cloudnest-docs", id: "p1", hs: "h-look" },
        { t: ".test", id: "p2" },
        { t: "/auth/signin?file=88a1", id: "p3" },
      ],
    },
    brand: { name: "Cloudnest", color: "#2563eb", initial: "C" },
    pageTitle: "Sign in to Cloudnest",
    hotspots: [
      { id: "h-look", type: "lookalike", label: "cloudnest-docs.test ≠ cloudnest.example", explain: "An extra word and a different ending: this is a different domain entirely." },
    ],
    explain: "Lookalike domain behind a fake sharing notice.",
  },
  {
    id: "b04",
    difficulty: "medium",
    isPhish: false,
    scenario: "You opened the Helix ID sign-in from your school’s bookmarked student portal.",
    url: {
      scheme: "https",
      parts: [
        { t: "login.", id: "p1" },
        { t: "helixid.example", id: "p2" },
        { t: "/northvale/sso", id: "p3" },
      ],
    },
    brand: { name: "Helix ID", color: "#7c3aed", initial: "H" },
    pageTitle: "Northvale High — Sign in with Helix ID",
    hotspots: [],
    explain: "Legit. You came from a bookmark, and the hostname ends in helixid.example. “login.” is Helix’s own subdomain.",
  },
  {
    id: "b05",
    difficulty: "medium",
    isPhish: true,
    scenario: "A Pixelgram DM from a friend said “log in to vote for my cousin.”",
    url: {
      scheme: "http",
      parts: [
        { t: "203.0.113.47", id: "p1", hs: "h-ip" },
        { t: "/pixelgram/login.php", id: "p2", hs: "h-path" },
      ],
    },
    brand: { name: "Pixelgram", color: "#db2777", initial: "P" },
    pageTitle: "Log in to Pixelgram",
    hotspots: [
      { id: "h-ip", type: "url-structure", label: "Raw IP address, no HTTPS", explain: "A number instead of a domain name (and plain http) is a strong red flag for a login page." },
      { id: "h-path", type: "url-structure", label: "Brand name in the path", explain: "“pixelgram” in the path means nothing — the path can contain anything." },
    ],
    explain: "A raw IP address with the brand stuffed into the path.",
  },
  {
    id: "b06",
    difficulty: "hard",
    isPhish: true,
    scenario: "An email about a “new device sign-in” sent you here to confirm it was you.",
    url: {
      scheme: "https",
      parts: [{ t: "xn--lumenbnk-7fg.example", id: "p1", hs: "h-puny" }, { t: "/confirm", id: "p2" }],
    },
    brand: { name: "Lumen Bank", color: "#0f766e", initial: "L" },
    pageTitle: "Confirm it’s you",
    hotspots: [
      { id: "h-puny", type: "lookalike", label: "Punycode (xn--) lookalike", explain: "This is how the browser shows a domain with a non-English character — a homograph of lumenbank.example." },
    ],
    explain: "Homograph attack revealed by punycode.",
  },
  {
    id: "b07",
    difficulty: "hard",
    isPhish: true,
    scenario: "You searched “payloop login” and clicked the top **sponsored** result.",
    url: {
      scheme: "https",
      parts: [
        { t: "payloop", id: "p1", hs: "h-hyphen" },
        { t: "-secure-login", id: "p2", hs: "h-hyphen" },
        { t: ".example", id: "p3" },
        { t: "/signin", id: "p4" },
      ],
    },
    brand: { name: "PayLoop", color: "#0369a1", initial: "P" },
    pageTitle: "Log in to your PayLoop account",
    hotspots: [
      { id: "h-hyphen", type: "lookalike", label: "Hyphenated lookalike domain", explain: "**payloop-secure-login.example** is a different domain from payloop.example. Scammers buy search ads to appear first." },
    ],
    explain: "Malicious search ad leading to a lookalike domain. Use bookmarks or the app for money sites.",
  },
  {
    id: "b08",
    difficulty: "hard",
    isPhish: false,
    scenario: "Your password manager autofilled your saved login on this page, which you opened from the Shopora app.",
    url: {
      scheme: "https",
      parts: [
        { t: "accounts.", id: "p1" },
        { t: "shopora.example", id: "p2" },
        { t: "/signin?return=%2Forders", id: "p3" },
      ],
    },
    brand: { name: "Shopora", color: "#ea580c", initial: "S" },
    pageTitle: "Sign in to Shopora",
    hotspots: [],
    explain: "Legit. The hostname ends in shopora.example, you came from the official app, and your password manager recognized the domain.",
  },
];

export const browserById = new Map(browserPages.map((b) => [b.id, b]));
