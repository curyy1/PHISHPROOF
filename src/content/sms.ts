import type { Sms } from "./types";

/** Phone simulator: texts, DMs and voicemail transcripts. 12 items, 5 legit. Phone numbers use the fictional 555-01xx range. */
export const smsItems: Sms[] = [
  {
    id: "s01",
    difficulty: "easy",
    isPhish: true,
    channel: "sms",
    contact: { name: "+1 (555) 014-2290", detail: "Unknown number", hs: "h-unknown" },
    messages: [
      {
        time: "9:41 AM",
        body: [
          "Parcelo: ",
          { t: "Your parcel is held due to an incomplete address.", id: "m1" },
          " ",
          { t: "Update within 12h", id: "m2", hs: "h-urgent" },
          ": ",
          { t: "parcelo-redelivery.test/p/8812", id: "l1", hs: "h-link", href: "https://parcelo-redelivery.test/p/8812" },
        ],
      },
    ],
    hotspots: [
      { id: "h-unknown", type: "sender", label: "Random personal number", explain: "Delivery companies text from consistent short codes, not random 10-digit numbers." },
      { id: "h-urgent", type: "urgency", label: "12-hour deadline", explain: "Pressure to act before you check." },
      { id: "h-link", type: "lookalike", label: "Not Parcelo’s domain", explain: "Parcelo’s real domain is parcelo.example. **parcelo-redelivery.test** is someone else’s." },
    ],
    explain: "The #1 smishing script. Check deliveries in the carrier app, forward to 7726, and delete.",
  },
  {
    id: "s02",
    difficulty: "easy",
    isPhish: false,
    channel: "sms",
    contact: { name: "Lumen Bank", detail: "Short code 55012" },
    messages: [
      {
        time: "2:15 PM",
        body: [
          { t: "Lumen Bank: Your verification code is 482913.", id: "m1" },
          " ",
          { t: "Don’t share this code with anyone. We will never call or text to ask for it.", id: "m2" },
        ],
      },
    ],
    hotspots: [],
    explain: "Legit — **if you just requested it** by logging in. It contains no link and warns you not to share the code. If you didn’t request a code, someone may have your password: change it.",
  },
  {
    id: "s03",
    difficulty: "easy",
    isPhish: true,
    channel: "sms",
    contact: { name: "+1 (555) 019-4471", detail: "Unknown number", hs: "h-unknown" },
    messages: [
      {
        time: "8:02 PM",
        body: [
          { t: "TOLL SERVICES FINAL NOTICE: You have an unpaid toll balance of $6.85.", id: "m1", hs: "h-fear" },
          " ",
          { t: "Pay now to avoid a $50 late fee and license suspension", id: "m2", hs: "h-urgent" },
          ": ",
          { t: "tollpay-online.test/pay", id: "l1", hs: "h-link", href: "https://tollpay-online.test/pay" },
        ],
      },
    ],
    hotspots: [
      { id: "h-unknown", type: "sender", label: "Unknown number, vague agency", explain: "“Toll Services” isn’t a specific agency, and it’s from a random number." },
      { id: "h-fear", type: "too-good", label: "Small, oddly specific bill", explain: "Small amounts feel harmless so you pay without thinking — the goal is your card number." },
      { id: "h-urgent", type: "urgency", label: "Threat of fees and suspension", explain: "Escalating threats are a pressure tactic." },
      { id: "h-link", type: "link", label: "Unofficial payment site", explain: "Pay tolls only through the official toll authority website you type yourself or its app." },
    ],
    explain: "Unpaid-toll smishing. If you’re unsure, look up your toll account through the official site you find yourself.",
  },
  {
    id: "s04",
    difficulty: "medium",
    isPhish: true,
    channel: "dm",
    contact: { name: "@jaylen.hoops", detail: "Pixelgram · Friend", hs: "h-friend" },
    messages: [
      { time: "7:10 PM", body: [{ t: "yo can u vote for my cousin real quick?? 🙏", id: "m1", hs: "h-favor" }] },
      {
        time: "7:10 PM",
        body: [
          "she’s in a scholarship contest, ",
          { t: "log in here so it counts", id: "m2", hs: "h-login" },
          ": ",
          { t: "pixelgram.example.vote-now.test", id: "l1", hs: "h-link", href: "https://pixelgram.example.vote-now.test/" },
        ],
      },
    ],
    hotspots: [
      { id: "h-friend", type: "sender", label: "Friend’s account — possibly hacked", explain: "Hacked accounts message their friends. Trust the request, not the profile picture." },
      { id: "h-favor", type: "context", label: "Out-of-character favor", explain: "A sudden urgent favor via DM is a common hacked-account pattern." },
      { id: "h-login", type: "request", label: "Log in to vote", explain: "Voting doesn’t require logging into another site. This steals your account next." },
      { id: "h-link", type: "url-structure", label: "Real domain is vote-now.test", explain: "Pixelgram’s name is just a subdomain." },
    ],
    explain: "Hacked-friend DM. Text or call your friend another way to check, and report the message in the app.",
  },
  {
    id: "s05",
    difficulty: "medium",
    isPhish: true,
    channel: "sms",
    contact: { name: "+1 (555) 017-0032", detail: "Unknown number" },
    messages: [
      { time: "4:20 PM", body: [{ t: "Hi Sam, are we still on for dinner Thursday? 😊", id: "m1", hs: "h-wrong" }] },
      { me: true, time: "4:31 PM", body: ["Sorry, wrong number!"] },
      {
        time: "4:32 PM",
        body: [
          "Oh so sorry! ",
          { t: "You seem really nice though. I’m Mia, I work in crypto trading — do you invest?", id: "m2", hs: "h-pivot" },
        ],
      },
    ],
    hotspots: [
      { id: "h-wrong", type: "context", label: "“Wrong number” opener", explain: "A friendly wrong-number text is a common way to start a long-con scam." },
      { id: "h-pivot", type: "too-good", label: "Pivot to investing", explain: "Turning a random chat toward crypto or investing is the giveaway. These scams can go on for weeks before asking for money." },
    ],
    explain: "A “wrong number” investment/romance scam opener. Don’t keep chatting — block and delete.",
  },
  {
    id: "s06",
    difficulty: "medium",
    isPhish: false,
    channel: "sms",
    contact: { name: "Northvale High", detail: "Short code 55077 · Saved contact" },
    messages: [
      {
        time: "6:05 AM",
        body: [
          { t: "Northvale High: Due to icy roads, school starts 2 hours late today (Nov 5).", id: "m1" },
          " ",
          { t: "Buses run 2 hours later than usual. Details on the school website.", id: "m2" },
        ],
      },
    ],
    hotspots: [],
    explain: "Legit. A saved short code you’ve received alerts from before, timely info, no link, no request.",
  },
  {
    id: "s07",
    difficulty: "medium",
    isPhish: true,
    channel: "voicemail",
    contact: { name: "Lumen Bank", detail: "Caller ID: (555) 010-0100 · Voicemail", hs: "h-spoof" },
    messages: [
      {
        time: "Voicemail · 0:38",
        body: [
          { t: "“Hi, this is Daniel from Lumen Bank fraud prevention.", id: "m1" },
          " ",
          { t: "We’ve frozen your card due to suspicious charges.", id: "m2", hs: "h-fear" },
          " ",
          { t: "Please call me back at 555-013-8890 and have the code we text you ready", id: "m3", hs: "h-code" },
          " so we can verify your identity.”",
        ],
      },
    ],
    hotspots: [
      { id: "h-spoof", type: "sender", label: "Caller ID can be spoofed", explain: "Even if the caller ID shows the bank’s real name or number, it can be faked." },
      { id: "h-fear", type: "urgency", label: "Card frozen", explain: "Fear plus urgency." },
      { id: "h-code", type: "request", label: "Different callback number + your code", explain: "They want you to call *their* number and read them your one-time code. Call the number on your card instead." },
    ],
    explain: "Vishing via voicemail. Banks never ask for one-time codes. Call the number printed on your card.",
  },
  {
    id: "s08",
    difficulty: "hard",
    isPhish: true,
    channel: "sms",
    contact: { name: "+1 (555) 018-6624", detail: "Unknown number", hs: "h-newnum" },
    messages: [
      { time: "1:48 PM", body: [{ t: "Hi honey it’s Mom, I dropped my phone in the sink 😩 this is my new number", id: "m1", hs: "h-newnum" }] },
      {
        time: "1:49 PM",
        body: [
          { t: "Can you send $200 on PayLoop to this number? I need to pay for the repair now", id: "m2", hs: "h-money" },
          " ",
          { t: "don’t tell Dad it’s a surprise thing", id: "m3", hs: "h-secret" },
        ],
      },
    ],
    hotspots: [
      { id: "h-newnum", type: "sender", label: "“New number” claim", explain: "The “I lost my phone, new number” story is the setup for family-impersonation scams." },
      { id: "h-money", type: "request", label: "Urgent money request", explain: "Money + urgency from an unverified number." },
      { id: "h-secret", type: "urgency", label: "Secrecy", explain: "“Don’t tell Dad” stops you from checking with someone who’d spot the scam." },
    ],
    explain: "Family impersonation. Call Mom’s saved number or ask another family member before sending anything.",
  },
  {
    id: "s09",
    difficulty: "hard",
    isPhish: false,
    channel: "sms",
    contact: { name: "Coach Rivera", detail: "Saved contact" },
    messages: [
      { time: "5:12 PM", body: [{ t: "Great game today! Film session moved to Wed lunch in room 210. Bring your notebook.", id: "m1" }] },
    ],
    hotspots: [],
    explain: "Legit. A saved contact, normal context, no links, no requests for money or info.",
  },
  {
    id: "s10",
    difficulty: "hard",
    isPhish: true,
    channel: "sms",
    contact: { name: "City Parking", detail: "+1 (555) 016-3300", hs: "h-sender" },
    messages: [
      {
        time: "10:05 AM",
        body: [
          { t: "Your parking session at Meter 1142 failed to process.", id: "m1" },
          " Scan the code to pay and avoid a citation:",
        ],
        image: { kind: "qr", id: "q1", alt: "QR code image", decoded: "https://citypark-pay.test/m/1142", hs: "h-qr" },
      },
    ],
    hotspots: [
      { id: "h-sender", type: "sender", label: "Unknown number", explain: "Parking apps notify you inside the app, not from random numbers." },
      { id: "h-qr", type: "link", label: "QR code to an unknown payment site", explain: "Decoded, the QR goes to **citypark-pay.test**. A QR code is just a link you can’t read until you scan it." },
    ],
    explain: "Quishing by text. Pay parking only through the official app or the city site you type yourself.",
  },
  {
    id: "s11",
    difficulty: "hard",
    isPhish: false,
    channel: "dm",
    contact: { name: "Questify Support", detail: "In-app support chat · Ticket #48812" },
    messages: [
      { me: true, time: "3:02 PM", body: ["Hi, my season pass didn’t activate after I bought it."] },
      {
        time: "3:06 PM",
        body: [
          { t: "Thanks for reaching out! I can see the purchase on your account and I’ve re-sent the activation.", id: "m1" },
          " ",
          { t: "Please restart the game. We’ll never ask for your password or payment info in chat.", id: "m2" },
        ],
      },
    ],
    hotspots: [],
    explain: "Legit. **You** started the conversation inside the official app’s support chat, and they didn’t ask for anything sensitive.",
  },
  {
    id: "s12",
    difficulty: "hard",
    isPhish: true,
    channel: "dm",
    contact: { name: "Questify_Support_Team", detail: "Pixelgram DM · Not verified", hs: "h-fake" },
    messages: [
      {
        time: "11:40 PM",
        body: [
          { t: "Hi! We saw your post about your season pass not working.", id: "m1", hs: "h-ctx" },
          " ",
          { t: "To fix it, send us your Questify login and the code we text you.", id: "m2", hs: "h-request" },
        ],
      },
    ],
    hotspots: [
      { id: "h-fake", type: "sender", label: "Fake support account", explain: "Real support doesn’t DM you on a different social platform. Scammers watch for complaints and pose as support." },
      { id: "h-ctx", type: "context", label: "They found your public post", explain: "Public complaints are a lead list for fake-support scammers." },
      { id: "h-request", type: "request", label: "Login + one-time code", explain: "No real support agent needs your password or code." },
    ],
    explain: "Fake support account. Only use support channels inside the official app or website.",
  },
];

export const smsById = new Map(smsItems.map((s) => [s.id, s]));
