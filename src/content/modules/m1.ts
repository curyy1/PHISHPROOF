import type { Module } from "../types";

export const m1: Module = {
  id: "what-is-phishing",
  number: 1,
  title: "What is phishing?",
  tagline: "Why smart people still take the bait.",
  description:
    "Learn what phishing is, why it works on everyone, and the five emotional buttons scammers push to get you to act before you think.",
  icon: "🎣",
  guestAccessible: true,
  lessons: [
    {
      id: "phishing-101",
      title: "Phishing in one minute",
      summary: "A scam that pretends to be someone you trust so you'll click, pay, or share.",
      minutes: 4,
      blocks: [
        {
          type: "p",
          text: "**Phishing** is a trick where an attacker pretends to be someone you trust — your bank, your school, a delivery company, even a friend — to get you to do something that helps *them*.",
        },
        { type: "p", text: "That “something” is usually one of these:" },
        {
          type: "list",
          items: [
            "**Click a link** that leads to a fake login page or downloads malware.",
            "**Type your password** or a one-time code into a page the attacker controls.",
            "**Send money** or gift cards, or change where a payment goes.",
            "**Share personal info** like your birthday, address, or student ID.",
            "**Open an attachment** that installs something harmful.",
          ],
        },
        {
          type: "callout",
          tone: "fact",
          title: "Where the name comes from",
          text: "It’s “fishing” — throwing out bait and waiting for a bite — spelled with *ph*, a nod to early “phone phreaks” who hacked phone systems. The term has been around since the mid-1990s.",
        },
        { type: "h", text: "It’s not just email" },
        {
          type: "p",
          text: "Email is the classic version, but the same trick shows up as text messages (**smishing**), phone calls (**vishing**), QR codes (**quishing**), social media DMs, and fake websites. The channel changes; the playbook doesn’t.",
        },
        {
          type: "check",
          question: "Which of these is the main goal of almost every phishing message?",
          options: [
            { text: "To get you to take an action that helps the attacker", correct: true, why: "Right. Clicking, paying, logging in, or sharing info — the message exists to make you *act*." },
            { text: "To show you advertisements", why: "That’s spam. Annoying, but phishing is about tricking you into an action like logging in or paying." },
            { text: "To test your spelling", why: "Nope — and modern phishing often has perfect spelling, as you’ll learn in Module 2." },
          ],
        },
      ],
      takeaways: [
        "Phishing = pretending to be someone trusted to get you to act.",
        "The goal is a click, a password, a payment, or your personal info.",
        "It happens by email, text, phone, QR code, and DMs.",
      ],
    },
    {
      id: "why-phishing-works",
      title: "Why it works on smart people",
      summary: "Phishing targets your emotions, not your intelligence.",
      minutes: 5,
      blocks: [
        {
          type: "p",
          text: "Here’s the uncomfortable truth: phishing doesn’t work because people are dumb. It works because people are **busy, helpful, and human**. Attackers design messages to trigger a fast emotional reaction so you act *before* the careful part of your brain catches up.",
        },
        {
          type: "stat",
          value: "≈62%",
          label: "of data breaches involved the **human element** — a person making a mistake, getting tricked, or misusing access.",
          source: "Verizon 2026 Data Breach Investigations Report",
        },
        {
          type: "stat",
          value: "≈16%",
          label: "of breaches started with **phishing** — making it one of the most common ways attackers get in.",
          source: "Verizon 2026 Data Breach Investigations Report",
        },
        {
          type: "p",
          text: "Companies spend millions on firewalls and antivirus, but an attacker who convinces one person to type a password can walk right past all of it. That’s why *you* are part of the security system.",
        },
        { type: "h", text: "Fast brain vs. slow brain" },
        {
          type: "compare",
          left: {
            title: "Fast, automatic thinking",
            items: ["Reacts in seconds", "Driven by emotion and habit", "Great for catching a ball", "What phishing targets"],
          },
          right: {
            title: "Slow, careful thinking",
            items: ["Takes a moment", "Checks facts and asks questions", "Great for spotting scams", "What this course trains"],
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: "The 10-second pause",
          text: "Whenever a message makes you feel a strong emotion — panic, excitement, guilt — that feeling is your cue to **slow down**. Ten seconds of thinking beats ten days of cleanup.",
        },
      ],
      takeaways: [
        "Most breaches involve a human, and phishing is a top way in.",
        "Phishing targets emotions and habits, not intelligence.",
        "A strong emotional reaction is a signal to pause.",
      ],
    },
    {
      id: "five-triggers",
      title: "The five buttons scammers push",
      summary: "Urgency, fear, authority, curiosity, and greed.",
      minutes: 6,
      blocks: [
        { type: "p", text: "Nearly every phishing message leans on at least one of these five emotional triggers. Learn to name them and they lose their power." },
        {
          type: "steps",
          items: [
            { title: "⏰ Urgency", text: "“Act within 24 hours.” “Your account closes today.” Deadlines stop you from double-checking." },
            { title: "😨 Fear", text: "“Suspicious login detected.” “You’ll be suspended.” Fear makes you want to fix the problem *right now*." },
            { title: "🎓 Authority", text: "Pretending to be a principal, boss, police officer, or IT department. We’re trained to follow instructions from people in charge." },
            { title: "🔍 Curiosity", text: "“See who viewed your profile.” “Is this you in this video?” An itch you want to scratch with one click." },
            { title: "💰 Greed", text: "“You won a gift card.” “Claim your refund.” Free stuff makes us lower our guard." },
          ],
        },
        {
          type: "message",
          kind: "email",
          from: "Principal Davis <principal.davis@northvale-staff.test>",
          subject: "Need a quick favor — are you available?",
          body: [
            "Hi, I’m stuck in a meeting and can’t talk. I need you to pick up four $50 gift cards for a staff appreciation surprise. Send me the codes by 3pm and I’ll pay you back. Please keep this between us!",
          ],
          note: "Authority (the principal) + urgency (by 3pm) + secrecy (“keep this between us”). Gift cards are a classic scam payment because they can’t be traced or refunded.",
          verdict: "phish",
        },
        {
          type: "callout",
          tone: "warning",
          title: "Bonus trigger: secrecy",
          text: "“Don’t tell anyone” or “this is confidential” is a huge red flag. Scammers isolate you so no one can warn you.",
        },
        {
          type: "check",
          question: "“Your package couldn’t be delivered. Pay the $1.99 fee within 12 hours or it will be returned.” Which triggers are in play?",
          options: [
            { text: "Urgency and fear of loss", correct: true, why: "Yes — a short deadline plus losing your package. The small fee makes it feel harmless, but the real goal is your card details." },
            { text: "Greed only", why: "There’s no prize here. It’s pressure (12 hours) and fear of losing your package." },
            { text: "None — it’s just a normal notice", why: "Real carriers don’t text you surprise fees with a countdown. This is a very common smishing script." },
          ],
        },
      ],
      takeaways: [
        "The big five: urgency, fear, authority, curiosity, greed.",
        "Secrecy (“keep this between us”) is a bonus red flag.",
        "Name the emotion, then slow down.",
      ],
    },
    {
      id: "who-gets-targeted",
      title: "Who gets targeted (spoiler: you)",
      summary: "Bulk phishing, targeted phishing, and why students are a favorite target.",
      minutes: 4,
      blocks: [
        {
          type: "p",
          text: "Some phishing is like a giant net: the same message blasted to millions of people, hoping a few bite. Other phishing is like a spear: a carefully researched message aimed at one person or one group.",
        },
        {
          type: "compare",
          left: { title: "Bulk phishing", items: ["Same message to everyone", "Generic: “Dear customer”", "Fake deliveries, prizes, account alerts", "Low effort, huge volume"] },
          right: { title: "Spear phishing", items: ["Aimed at a specific person or team", "Uses your name, school, or job", "Mentions real events or people", "Harder to spot (Module 5)"] },
        },
        { type: "h", text: "Why students and teens are targets" },
        {
          type: "list",
          items: [
            "**School accounts** unlock email, files, and sometimes other students’ data.",
            "**Gaming and social accounts** can be resold or used to scam your friends.",
            "**Scholarship, job, and internship scams** target people who are new to those processes.",
            "**Your info is public**: sports rosters, club pages, and social media tell attackers a lot about you.",
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Think like an attacker",
          text: "Look at your public profiles. What could a stranger learn about your school, friends, or interests? That’s exactly what a spear phisher uses to make a message believable.",
        },
      ],
      takeaways: [
        "Bulk phishing casts a wide net; spear phishing is personal.",
        "Students are targeted for school, gaming, social, and money accounts.",
        "Public info about you makes scams more convincing.",
      ],
    },
  ],
  drill: {
    title: "First catch: easy inbox",
    description: "Five emails. Some are phishing, some are totally normal. Flag the suspicious parts, then decide.",
    ref: { kind: "inbox", itemIds: ["e01", "e02", "e03", "e04", "e05"] },
  },
  quiz: [
    {
      id: "m1q1",
      prompt: "What makes a message *phishing* rather than ordinary spam?",
      options: [
        { text: "It pretends to be someone trusted to trick you into an action", correct: true, why: "Exactly. Impersonation + a request (click, log in, pay, share) is the core of phishing." },
        { text: "It’s sent to lots of people at once", why: "Spam is also sent in bulk. And spear phishing is sent to just one person." },
        { text: "It contains spelling mistakes", why: "Many modern phishing messages have perfect spelling, thanks to AI tools." },
        { text: "It arrives late at night", why: "Timing alone doesn’t make something phishing." },
      ],
    },
    {
      id: "m1q2",
      prompt: "According to the Verizon 2026 Data Breach Investigations Report, roughly what share of breaches involved the human element?",
      options: [
        { text: "About 6%", why: "Much higher than that — people are involved in most breaches." },
        { text: "About 62%", correct: true, why: "Right — around six in ten breaches involved a person making a mistake or being tricked." },
        { text: "About 99%", why: "High, but not quite that high. It’s around 62%." },
        { text: "Almost none — it’s mostly hackers breaking code", why: "Attackers often find it easier to trick a person than to break software." },
      ],
    },
    {
      id: "m1q3",
      prompt: "“Hey! Is this you in this video?? 😳” with a link, from a friend’s account. Which trigger is this mainly using?",
      options: [
        { text: "Greed", why: "Nothing is being offered. It’s about wanting to know what’s in the video." },
        { text: "Curiosity", correct: true, why: "Yes. It’s designed to make you click before thinking. Friends’ accounts are often hacked to spread these." },
        { text: "Authority", why: "A friend isn’t an authority figure. This is curiosity (with a little fear)." },
        { text: "None — friends’ messages are always safe", why: "Hacked accounts are a common way phishing spreads, because you trust the sender." },
      ],
    },
    {
      id: "m1q4",
      prompt: "A message makes you feel panicked and says you must act within one hour. What’s the best first move?",
      options: [
        { text: "Act fast so you don’t miss the deadline", why: "That’s exactly what the attacker wants. Deadlines are designed to stop you from checking." },
        { text: "Pause and verify the request through a channel you already trust", correct: true, why: "Yes. Strong emotion + urgency = slow down and check independently (official app, known phone number, or asking in person)." },
        { text: "Reply and ask if it’s real", why: "If it’s a scam, the scammer will just say “yes, it’s real.” Verify through a separate channel instead." },
        { text: "Forward it to all your friends to warn them", why: "Warning people is kind, but forwarding a live scam can spread it. Report it instead (Module 7)." },
      ],
    },
    {
      id: "m1q5",
      prompt: "Why would someone ask you to pay in gift cards?",
      options: [
        { text: "Gift cards are the safest way to pay", why: "They’re actually one of the least safe — once you share the code, the money is gone." },
        { text: "Gift card codes are hard to trace and nearly impossible to get refunded", correct: true, why: "Right. No real business, school, or government agency asks to be paid in gift cards." },
        { text: "It’s required by law for small payments", why: "There’s no such rule. A gift-card request is a classic scam sign." },
        { text: "Gift cards earn the sender rewards points", why: "The point isn’t rewards — it’s that the money can’t be traced or clawed back." },
      ],
    },
    {
      id: "m1q6",
      prompt: "Which is the best description of *spear phishing*?",
      options: [
        { text: "Phishing aimed at a specific person using details about them", correct: true, why: "Yes — personalized details (your name, school, coach) make it much more convincing." },
        { text: "Phishing sent only by text message", why: "That’s smishing. Spear phishing can arrive by any channel." },
        { text: "Phishing that only targets fishermen", why: "Ha — no. It’s about precision targeting, like a spear versus a net." },
        { text: "Any phishing with an attachment", why: "Attachments can appear in any kind of phishing. Spear phishing is about personalization." },
      ],
    },
  ],
};
