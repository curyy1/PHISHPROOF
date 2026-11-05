import type { UrlItem } from "./types";

const LB = "Lumen Bank (lumenbank.example)";
const SB = "StreamBox (streambox.example)";
const SH = "Shopora (shopora.example)";
const PL = "PayLoop (payloop.example)";
const PX = "Pixelgram (pixelgram.example)";
const CN = "Cloudnest (cloudnest.example)";
const NV = "Northvale High (northvale-schools.example)";
const PC = "Parcelo (parcelo.example)";
const QF = "Questify (questify.example)";
const HX = "Helix ID (helixid.example)";

/** URL inspector items: 40 URLs, 18 safe. */
export const urlItems: UrlItem[] = [
  { id: "u01", difficulty: "easy", expect: LB, url: "https://www.lumenbank.example/login", safe: true, type: "safe", explain: "The hostname ends in **lumenbank.example**. “www” is the bank’s own subdomain." },
  { id: "u02", difficulty: "easy", expect: LB, url: "https://lumenbank.example.secure-login.test/", safe: false, type: "url-structure", explain: "Read right-to-left: the domain is **secure-login.test**. Lumen Bank’s name is a disguise." },
  { id: "u03", difficulty: "easy", expect: SH, url: "https://shoppora.example/deals", safe: false, type: "lookalike", explain: "Doubled “p”: **shoppora** isn’t shopora." },
  { id: "u04", difficulty: "easy", expect: SB, url: "https://help.streambox.example/billing", safe: true, type: "safe", explain: "“help” is StreamBox’s own subdomain of **streambox.example**." },
  { id: "u05", difficulty: "easy", expect: PL, url: "http://198.51.100.23/payloop/login", safe: false, type: "url-structure", explain: "A raw IP address (and no HTTPS) for a login page. The brand in the path means nothing." },
  { id: "u06", difficulty: "easy", expect: PX, url: "https://pixelgram.example/accounts/settings", safe: true, type: "safe", explain: "Exact domain: **pixelgram.example**." },
  { id: "u07", difficulty: "easy", expect: CN, url: "https://cloudnest-docs.test/view?file=88a1", safe: false, type: "lookalike", explain: "**cloudnest-docs.test** is a different domain with an extra word." },
  { id: "u08", difficulty: "easy", expect: NV, url: "https://portal.northvale-schools.example/grades", safe: true, type: "safe", explain: "Hostname ends in **northvale-schools.example**." },
  { id: "u09", difficulty: "easy", expect: PC, url: "https://sho.rt.example/x7Qz", safe: false, type: "link", explain: "A **shortened link** hides the destination. Parcelo would link to parcelo.example." },
  { id: "u10", difficulty: "easy", expect: SB, url: "https://strearnbox.example/login", safe: false, type: "lookalike", explain: "“rn” imitating “m”: **strearnbox**." },
  { id: "u11", difficulty: "easy", expect: QF, url: "https://play.questify.example/season-9", safe: true, type: "safe", explain: "“play” is a subdomain of **questify.example**." },
  { id: "u12", difficulty: "easy", expect: SH, url: "https://www.shopora.example/orders/SH-20417", safe: true, type: "safe", explain: "Exact domain with an order path." },
  { id: "u13", difficulty: "easy", expect: LB, url: "https://lumen-bank-alerts.test/verify", safe: false, type: "lookalike", explain: "Hyphenated lookalike on a different ending: **lumen-bank-alerts.test**." },
  { id: "u14", difficulty: "easy", expect: HX, url: "https://login.helixid.example/northvale/sso", safe: true, type: "safe", explain: "Hostname ends in **helixid.example**." },

  { id: "u15", difficulty: "medium", expect: PL, url: "https://payloop.example.account-review.test/signin", safe: false, type: "url-structure", explain: "Domain is **account-review.test**." },
  { id: "u16", difficulty: "medium", expect: PL, url: "https://www.payloop.example/activity?tab=recent", safe: true, type: "safe", explain: "Exact domain; the query (?tab=recent) is harmless." },
  { id: "u17", difficulty: "medium", expect: SH, url: "https://sh0pora.example/login", safe: false, type: "lookalike", explain: "Zero instead of “o”: **sh0pora**." },
  { id: "u18", difficulty: "medium", expect: LB, url: "https://lumenbank.example@203.0.113.7/login", safe: false, type: "url-structure", explain: "Everything before **@** is ignored. This goes to 203.0.113.7." },
  { id: "u19", difficulty: "medium", expect: CN, url: "https://drive.cloudnest.example/s/9KqL2", safe: true, type: "safe", explain: "“drive” is a subdomain of **cloudnest.example**." },
  { id: "u20", difficulty: "medium", expect: NV, url: "https://northvale-schools.example.grade-review.test/login", safe: false, type: "url-structure", explain: "The school domain is just a subdomain of **grade-review.test**." },
  { id: "u21", difficulty: "medium", expect: PX, url: "https://pixelgram-support.example/appeal", safe: false, type: "lookalike", explain: "**pixelgram-support.example** is a different domain from pixelgram.example." },
  { id: "u22", difficulty: "medium", expect: SB, url: "https://streambox.example/account/membership#billing", safe: true, type: "safe", explain: "Exact domain; the #billing part just jumps to a section of the page." },
  { id: "u23", difficulty: "medium", expect: QF, url: "https://questify.example.free-coins.test/claim", safe: false, type: "url-structure", explain: "Domain is **free-coins.test** — and “free coins” is greed bait." },
  { id: "u24", difficulty: "medium", expect: PC, url: "https://www.parcelo.example/track/PX88123", safe: true, type: "safe", explain: "Exact domain with a tracking path." },
  { id: "u25", difficulty: "medium", expect: HX, url: "http://login.helixid.example/northvale/sso", safe: false, type: "url-structure", explain: "Right domain, but **http** (no encryption) on a login page. Never type a password over plain http." },
  { id: "u26", difficulty: "medium", expect: LB, url: "https://lurnenbank.example/login", safe: false, type: "lookalike", explain: "“rn” imitating “m”: **lurnenbank**." },
  { id: "u27", difficulty: "medium", expect: SH, url: "https://help.shopora.example/returns?order=SH-20417", safe: true, type: "safe", explain: "Subdomain of **shopora.example**." },

  { id: "u28", difficulty: "hard", expect: LB, url: "https://xn--lumenbnk-7fg.example/login", safe: false, type: "lookalike", explain: "**xn--** = punycode for a domain with non-English characters, imitating lumenbank.example." },
  { id: "u29", difficulty: "hard", expect: PL, url: "https://payloop.example/redirect?to=https://payloop-verify.test/login", safe: false, type: "link", explain: "An **open redirect**: it starts on payloop.example but sends you to **payloop-verify.test**. Look at where you’ll end up." },
  { id: "u30", difficulty: "hard", expect: CN, url: "https://cloudnest.example/s/a8F2?utm_source=email&utm_campaign=share", safe: true, type: "safe", explain: "Tracking parameters (utm_…) look messy but are harmless. Domain: **cloudnest.example**." },
  { id: "u31", difficulty: "hard", expect: SB, url: "https://streambox.example-account.test/login", safe: false, type: "url-structure", explain: "Tricky! The hostname ends in **example-account.test**, not streambox.example." },
  { id: "u32", difficulty: "hard", expect: NV, url: "https://library.northvale-schools.example/catalog?q=biology", safe: true, type: "safe", explain: "Subdomain of the real school domain." },
  { id: "u33", difficulty: "hard", expect: PX, url: "https://www.pixelgram.example.login-help.test/accounts", safe: false, type: "url-structure", explain: "Domain is **login-help.test**." },
  { id: "u34", difficulty: "hard", expect: HX, url: "https://helixid.example/reset?token=7f3a9c", safe: true, type: "safe", explain: "Exact domain. A token in a reset link you requested is normal." },
  { id: "u35", difficulty: "hard", expect: SH, url: "https://shopora.example.co.test/orders", safe: false, type: "url-structure", explain: "Read right-to-left: the domain is **co.test**. “shopora.example” is just a made-up subdomain in front of it." },
  { id: "u36", difficulty: "hard", expect: QF, url: "https://questify.example/support/ticket/48812", safe: true, type: "safe", explain: "Exact domain, ordinary support path." },
  { id: "u37", difficulty: "hard", expect: LB, url: "https://www.lumenbank.example.example.net/login", safe: false, type: "url-structure", explain: "Read right-to-left: **example.net** owns this. lumenbank.example is a subdomain." },
  { id: "u38", difficulty: "hard", expect: PC, url: "https://parcelo.example/track?id=PX88123&lang=en", safe: true, type: "safe", explain: "Exact domain with harmless parameters." },
  { id: "u39", difficulty: "hard", expect: PL, url: "https://paylooop.example/login", safe: false, type: "lookalike", explain: "Three o’s: **paylooop**." },
  { id: "u40", difficulty: "hard", expect: SB, url: "https://streambox.example/login", safe: true, type: "safe", explain: "Exact domain: **streambox.example**." },
];

export const urlById = new Map(urlItems.map((u) => [u.id, u]));
