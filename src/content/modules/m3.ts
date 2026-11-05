import type { Module } from "../types";

export const m3: Module = {
  id: "reading-links",
  number: 3,
  title: "Reading links & URLs",
  tagline: "Find out where a link really goes.",
  description:
    "Break a URL into its parts, find the real domain in seconds, and see through subdomain tricks, lookalike characters, and the padlock myth.",
  icon: "🔗",
  lessons: [
    {
      id: "peek-before-you-click",
      title: "Peek before you click",
      summary: "Hover on a computer, long-press on a phone.",
      minutes: 4,
      blocks: [
        {
          type: "p",
          text: "Before you can judge a link, you need to *see* it. Link text, buttons, and images can all hide the real destination. Peeking is safe — clicking is the risky part.",
        },
        {
          type: "steps",
          items: [
            { title: "On a computer", text: "Rest your mouse over the link. The full address appears at the bottom-left of the browser or mail window. Read it before you click." },
            { title: "On a phone", text: "Press and hold the link. A preview shows the address. Choose **Copy** or close the preview — don’t tap Open until you’ve checked it." },
            { title: "In a text message", text: "Many phones show the link right in the message. Read the whole thing, not just the start." },
            { title: "Behind a QR code", text: "Your camera shows the address before opening it. Read it like any other link (Module 4)." },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "When in doubt, go direct",
          text: "You never *need* to use a link in a message. Type the site’s address yourself or open its app. That one habit defeats most phishing links.",
        },
      ],
      takeaways: [
        "Hover (computer) or long-press (phone) to reveal the real address.",
        "Peeking is safe; clicking is the risk.",
        "You can always skip the link and go direct.",
      ],
    },
    {
      id: "url-anatomy",
      title: "Anatomy of a URL",
      summary: "Scheme, subdomain, domain, path — and the one part that matters most.",
      minutes: 6,
      blocks: [
        { type: "p", text: "A web address looks like a jumble, but it has a simple structure. Here’s a real-looking address for a fictional bank, Lumen Bank:" },
        {
          type: "url",
          parts: [
            { text: "https://", label: "scheme", tone: "neutral" },
            { text: "login.", label: "subdomain", tone: "neutral" },
            { text: "lumenbank.example", label: "domain (the owner)", tone: "good" },
            { text: "/accounts/summary", label: "path", tone: "neutral" },
            { text: "?tab=checking", label: "query", tone: "neutral" },
          ],
          caption: "The **domain** is the part that tells you who controls the page. Everything else can be chosen freely by whoever owns that domain.",
        },
        { type: "h", text: "The 3-second rule for finding the real domain" },
        {
          type: "steps",
          items: [
            { title: "1. Skip past the //", text: "Ignore `https://` at the start." },
            { title: "2. Find the first single slash /", text: "Everything before it is the hostname. Everything after it is just the path." },
            { title: "3. Read the hostname right-to-left", text: "The last two pieces (like `lumenbank.example`) are the domain. Anything to the left is a subdomain that the domain owner made up." },
          ],
        },
        {
          type: "callout",
          tone: "fact",
          title: "Country codes",
          text: "Some domains use two-part endings, like `.co.uk`. In that case the domain is the last *three* pieces (like `example.co.uk`). The right-to-left habit still works.",
        },
        { type: "h", text: "The @ trick" },
        {
          type: "p",
          text: "Browsers ignore anything before an `@` in the hostname part. So `https://lumenbank.example@203.0.113.7/login` actually goes to **203.0.113.7**, not Lumen Bank. A raw number address (IP address) instead of a name is suspicious on its own.",
        },
        {
          type: "check",
          question: "What is the real domain in https://help.streambox.example/account/billing?",
          options: [
            { text: "streambox.example", correct: true, why: "Find the first single slash; the hostname is help.streambox.example; the last two parts are the domain." },
            { text: "help.streambox", why: "“help” is a subdomain. Read right-to-left: the domain is streambox.example." },
            { text: "account/billing", why: "That’s the path — it comes after the first single slash and can be anything." },
          ],
        },
      ],
      takeaways: [
        "The domain (just before the first single slash, read right-to-left) shows who owns the page.",
        "Subdomains and paths can say anything the owner wants.",
        "Anything before an @ in the hostname is ignored; raw IP addresses are suspicious.",
      ],
    },
    {
      id: "subdomain-tricks",
      title: "Subdomain tricks",
      summary: "payloop.example.secure-login.test is NOT PayLoop.",
      minutes: 5,
      blocks: [
        {
          type: "p",
          text: "Here’s the most common URL trick: the attacker owns some domain and makes up a subdomain that *contains a trusted brand name*. Because we read left-to-right, we see the brand first and stop reading.",
        },
        {
          type: "url",
          parts: [
            { text: "https://", tone: "neutral" },
            { text: "payloop.example.", label: "made-up subdomain", tone: "warn" },
            { text: "secure-login.test", label: "real domain (attacker’s)", tone: "bad" },
            { text: "/signin", label: "path", tone: "neutral" },
          ],
          caption: "This page belongs to **secure-login.test**, not PayLoop. PayLoop’s real domain is `payloop.example`.",
        },
        { type: "h", text: "More disguises" },
        {
          type: "list",
          items: [
            "**Brand in the path:** `https://free-gifts.test/payloop/login` — the path can contain any word.",
            "**Scary or official words:** `secure`, `verify`, `account`, `support`, `login` mean nothing on their own.",
            "**Very long URLs:** attackers pad addresses so the real domain is pushed off the edge of a phone screen.",
            "**Hyphens:** `payloop-security.example` is a totally different domain from `payloop.example`.",
          ],
        },
        {
          type: "check",
          question: "Which link really belongs to PayLoop (payloop.example)?",
          options: [
            { text: "https://payloop.example.account-check.test/login", why: "Read right-to-left: the domain is account-check.test." },
            { text: "https://accounts.payloop.example/login", correct: true, why: "The hostname ends in payloop.example — “accounts” is just PayLoop’s own subdomain." },
            { text: "https://payloop-accounts.example/login", why: "The hyphen makes this a different domain: payloop-accounts.example." },
          ],
        },
      ],
      takeaways: [
        "A brand name at the start of a URL means nothing — check the end of the hostname.",
        "Brand names in the path or in hyphenated domains are disguises.",
        "Long URLs may hide the real domain off-screen.",
      ],
    },
    {
      id: "lookalike-characters",
      title: "Lookalike characters",
      summary: "When an “a” isn’t really an “a.”",
      minutes: 4,
      blocks: [
        {
          type: "p",
          text: "Some letters from other alphabets look identical to English letters. The Cyrillic “а” and the Latin “a” look the same on screen but are different characters to a computer — so `lumenbаnk.example` (with a Cyrillic а) is a completely different domain. This is called a **homograph attack**.",
        },
        {
          type: "p",
          text: "To keep things fair, browsers often display such domains in a special encoded form that starts with `xn--` (called **punycode**). If you see `xn--` in a domain you expected to be ordinary English, be very careful.",
        },
        {
          type: "url",
          parts: [
            { text: "https://", tone: "neutral" },
            { text: "xn--lumenbnk-7fg.example", label: "punycode: hidden lookalike letter", tone: "bad" },
            { text: "/login", tone: "neutral" },
          ],
          caption: "What looked like “lumenbank.example” in the email was really a domain with a non-English letter.",
        },
        { type: "h", text: "Classic swaps to watch for" },
        {
          type: "list",
          items: ["`rn` → looks like `m`", "`vv` → looks like `w`", "`0` (zero) → looks like `o`", "`1` or `I` → looks like `l`", "`cl` → looks like `d`"],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Bookmarks beat eyeballs",
          text: "For sites you use for money or school, save a bookmark or use the official app. Then you never have to inspect lookalike letters at all.",
        },
      ],
      takeaways: [
        "Letters from other alphabets can look identical to English letters.",
        "`xn--` in a domain means it contains non-English characters.",
        "Bookmarks and official apps protect you from lookalikes.",
      ],
    },
    {
      id: "https-is-not-safe",
      title: "The padlock myth",
      summary: "HTTPS means private, not trustworthy.",
      minutes: 4,
      blocks: [
        {
          type: "p",
          text: "The padlock (or `https://`) means the connection between you and the website is **encrypted** — nobody on your Wi-Fi can read what you send. It does **not** tell you who runs the site or whether they’re honest.",
        },
        {
          type: "callout",
          tone: "myth",
          title: "Myth: “It has a padlock, so it’s safe.”",
          text: "Security certificates are free and automatic. Most phishing sites today use HTTPS. A padlock on a fake login page just means your password is sent *privately to the scammer*.",
        },
        {
          type: "compare",
          left: { title: "What HTTPS tells you", items: ["The connection is encrypted", "The page wasn’t changed in transit", "The site controls the domain shown"] },
          right: { title: "What it doesn’t tell you", items: ["That the site is the real brand", "That the owner is honest", "That it’s safe to type your password"] },
        },
        {
          type: "p",
          text: "So: no padlock on a login page is a bad sign — but a padlock is *not* a good sign. Always check the domain.",
        },
        {
          type: "check",
          question: "https://lumenbank.example.account-review.test shows a padlock. Is it safe to log in to Lumen Bank there?",
          options: [
            { text: "Yes — it has a padlock", why: "The padlock only means encryption. The real domain is account-review.test." },
            { text: "No — the real domain is account-review.test", correct: true, why: "Exactly. Padlock or not, this page isn’t owned by Lumen Bank." },
          ],
        },
      ],
      takeaways: [
        "HTTPS = encrypted connection, not an honest website.",
        "Most phishing sites have padlocks.",
        "The domain is what tells you who you’re talking to.",
      ],
    },
  ],
  drill: {
    title: "URL inspector warm-up",
    description: "Safe or sketchy? Read each address and find the real domain.",
    ref: { kind: "urls", itemIds: ["u01", "u02", "u03", "u04", "u05", "u06", "u07", "u08", "u09", "u10"] },
  },
  quiz: [
    {
      id: "m3q1",
      prompt: "In https://store.shopora.example/deals/today, what is the domain?",
      options: [
        { text: "store.shopora", why: "“store” is a subdomain. The domain is the last two parts before the first single slash." },
        { text: "shopora.example", correct: true, why: "Right — read the hostname right-to-left: shopora.example." },
        { text: "deals/today", why: "That’s the path." },
        { text: "https", why: "That’s the scheme (how the browser connects)." },
      ],
    },
    {
      id: "m3q2",
      prompt: "Who controls https://streambox.example.billing-update.test/pay?",
      exhibit: {
        type: "url",
        parts: [{ text: "https://streambox.example.billing-update.test/pay" }],
      },
      options: [
        { text: "StreamBox", why: "StreamBox’s name is just a subdomain here." },
        { text: "Whoever owns billing-update.test", correct: true, why: "Yes. The hostname ends in billing-update.test, so that’s the owner." },
        { text: "Nobody — it’s a fake URL that won’t load", why: "It can load just fine. Attackers create subdomains like this all the time." },
      ],
    },
    {
      id: "m3q3",
      prompt: "What does the padlock / HTTPS in the address bar guarantee?",
      options: [
        { text: "The website is owned by a real, trustworthy company", why: "No — anyone can get a certificate for free, including scammers." },
        { text: "The connection is encrypted", correct: true, why: "That’s all it guarantees. Check the domain to know who you’re talking to." },
        { text: "The website has been checked for viruses", why: "HTTPS doesn’t scan the site for anything." },
        { text: "Your password will be stored safely", why: "On a phishing site, it goes straight to the attacker — encrypted on the way there." },
      ],
    },
    {
      id: "m3q4",
      prompt: "Where does https://lumenbank.example@198.51.100.23/login actually go?",
      options: [
        { text: "lumenbank.example", why: "Browsers ignore everything before the @ in the hostname." },
        { text: "198.51.100.23", correct: true, why: "Right — the part after @ is the real destination, and a raw IP address is a red flag." },
        { text: "Nowhere; @ isn’t allowed in URLs", why: "It’s allowed (it’s for usernames), which is exactly why attackers abuse it." },
      ],
    },
    {
      id: "m3q5",
      prompt: "You see a domain that starts with “xn--”. What does it tell you?",
      options: [
        { text: "It contains characters from a non-English alphabet that may imitate English letters", correct: true, why: "That’s punycode. It can reveal a homograph (lookalike) attack." },
        { text: "It’s an extra-secure version of the site", why: "No — it’s just an encoding for special characters." },
        { text: "It’s a government website", why: "Punycode has nothing to do with government sites." },
      ],
    },
    {
      id: "m3q6",
      prompt: "What’s the safest way to get to your bank’s website when an email says there’s a problem?",
      options: [
        { text: "Use the link in the email but check for a padlock", why: "A padlock doesn’t prove who owns the page." },
        { text: "Use your bookmark or the official app", correct: true, why: "Going direct means the email can’t send you somewhere fake." },
        { text: "Search for the bank and click the first ad", why: "Scammers sometimes buy search ads that lead to fake sites. Use a bookmark or the app." },
      ],
    },
  ],
};
