import type { Module } from "../types";

export const m2: Module = {
  id: "email-red-flags",
  number: 2,
  title: "Email red flags",
  tagline: "Read an email like a detective.",
  description:
    "Check the sender, the tone, the request, the links and the attachments — and learn why perfect grammar no longer means a message is safe.",
  icon: "📧",
  lessons: [
    {
      id: "check-the-sender",
      title: "Check who it’s really from",
      summary: "Display names are easy to fake. The address after the @ tells the real story.",
      minutes: 5,
      blocks: [
        {
          type: "p",
          text: "Every email has two parts in the “From” line: a **display name** (anyone can type anything here) and an **email address**. Your inbox app often shows *only* the display name — which is exactly what scammers count on.",
        },
        {
          type: "message",
          kind: "email",
          from: "Lumen Bank <lumenbank.support@freemail.example>",
          subject: "Important update about your card",
          body: ["The display name says Lumen Bank. The address is a free personal email account. Real banks send from their own domain."],
          verdict: "phish",
        },
        { type: "h", text: "How to check" },
        {
          type: "steps",
          items: [
            { title: "Reveal the address", text: "On a computer, hover over or click the sender name. On a phone, tap the name to expand the details." },
            { title: "Look after the @", text: "The part after the @ is the **domain**. Does it match the organization’s real website? `lumenbank.example` ✅ `lumen-bank-alerts.test` ❌" },
            { title: "Check Reply-To", text: "Some phishing uses a real-looking From address but a different **Reply-To**, so your answer goes to the attacker." },
            { title: "Ask: was I expecting this?", text: "An unexpected message from a known name is still worth a second look." },
          ],
        },
        {
          type: "callout",
          tone: "warning",
          title: "Even a correct address isn’t proof",
          text: "If a real account gets hacked, the phishing comes from a real address. That’s why you also check *what the message asks you to do* (next lesson).",
        },
        {
          type: "check",
          question: "An email’s display name is “Northvale High IT Help Desk” and the address is helpdesk@northvale-it-support.test. Your school’s real domain is northvale-schools.example. Verdict?",
          options: [
            { text: "Suspicious — the domain doesn’t match the school’s real domain", correct: true, why: "Right. Anyone can register a name that *sounds* official. Only the real domain counts." },
            { text: "Safe — it says Help Desk", why: "Display names are free text. Anyone can call themselves Help Desk." },
            { text: "Safe — it has the school’s name in the address", why: "Putting a trusted name inside a different domain is a classic trick." },
          ],
        },
      ],
      takeaways: [
        "Display names can be anything — always check the actual address.",
        "The domain after @ should match the organization’s real domain.",
        "Watch for a different Reply-To address.",
      ],
    },
    {
      id: "tone-and-requests",
      title: "The tone and the ask",
      summary: "Urgent threats and requests for passwords, codes, or money are the biggest tells.",
      minutes: 5,
      blocks: [
        {
          type: "p",
          text: "If you only remember one thing from this module, make it this: **judge an email by what it asks you to do.** Scammers can fake logos, names, and polish. They can’t avoid asking for the thing they want.",
        },
        { type: "h", text: "Requests that should set off alarms" },
        {
          type: "list",
          items: [
            "**“Confirm your password”** or “verify your login” — legit services never ask for your password by email.",
            "**“Send me the code we just texted you”** — one-time codes are for *you* only. Sharing one hands over your account.",
            "**Money, gift cards, or crypto** — especially with urgency or secrecy.",
            "**Changing payment or bank details** — a top business scam (Module 5).",
            "**Personal info** — Social Security number, birthday, student ID, home address.",
          ],
        },
        { type: "h", text: "Tone that should set off alarms" },
        {
          type: "compare",
          left: { title: "Phishy tone", items: ["“Final warning”", "“Within 24 hours or your account is deleted”", "“Legal action will be taken”", "“Do not share this with anyone”"] },
          right: { title: "Normal tone", items: ["Calm and informative", "Reasonable timelines", "Tells you to go to the app or website yourself", "Welcomes questions"] },
        },
        {
          type: "callout",
          tone: "tip",
          title: "Use the “go direct” rule",
          text: "If an email says there’s a problem with your account, don’t use its link. Open the app or type the website address yourself. If the problem is real, you’ll see it there.",
        },
      ],
      takeaways: [
        "Judge emails by the request, not the polish.",
        "No legit service asks for your password or one-time code by email.",
        "Threats + deadlines = slow down and go direct.",
      ],
    },
    {
      id: "lookalike-domains",
      title: "Lookalike and misspelled domains",
      summary: "shopora.example vs. shoppora.example — one letter is all it takes.",
      minutes: 5,
      blocks: [
        {
          type: "p",
          text: "Attackers register domains that look almost identical to real ones. Your brain autocorrects what it sees, so a tiny difference slips right past. Imagine a fake store called **Shopora** whose real domain is `shopora.example`. Here are lookalikes an attacker might use:",
        },
        {
          type: "list",
          items: [
            "`shoppora.example` — **doubled letter**",
            "`shopra.example` — **missing letter**",
            "`sh0pora.example` — **zero instead of the letter o**",
            "`shopora-support.example` — **extra words** added with a hyphen",
            "`shopora.example.account-help.test` — **real name used as a subdomain** (Module 3)",
            "`rnyshopora.example` — **“rn” looks like “m”** at a glance",
          ],
        },
        {
          type: "callout",
          tone: "fact",
          title: "It’s cheap to fake",
          text: "Registering a lookalike domain can cost less than a sandwich. Attackers often register dozens at once.",
        },
        {
          type: "p",
          text: "Some lookalikes even use letters from other alphabets that look identical to English letters, like the Cyrillic “а” instead of the Latin “a”. You’ll learn how to catch those in Module 3.",
        },
        {
          type: "check",
          question: "Your streaming service is StreamBox at streambox.example. Which sender domain is legit?",
          options: [
            { text: "billing@streambox.example", correct: true, why: "Exact match to the real domain." },
            { text: "billing@strearnbox.example", why: "Look closely: “rn” pretending to be “m”." },
            { text: "billing@streambox-billing.example", why: "An extra word with a hyphen makes it a completely different domain." },
          ],
        },
      ],
      takeaways: [
        "Read domains slowly, letter by letter.",
        "Watch for doubled, missing, or swapped characters (0/o, rn/m, 1/l).",
        "Extra words or hyphens make it a different domain entirely.",
      ],
    },
    {
      id: "links-and-attachments",
      title: "Links and attachments",
      summary: "The link text can say anything. Unexpected files are a classic trap.",
      minutes: 6,
      blocks: [
        {
          type: "p",
          text: "A link has two parts: the **text you see** and the **address it actually goes to**. They don’t have to match. “Click here to log in to Lumen Bank” can lead anywhere.",
        },
        {
          type: "steps",
          items: [
            { title: "Computer", text: "Hover your mouse over the link (don’t click). The real address appears in the bottom corner of your browser or mail app." },
            { title: "Phone", text: "Press and hold the link to preview the address. Don’t tap “Open.”" },
            { title: "Shortened links", text: "Links like `sho.rt.example/x7Qz` hide the destination. Be extra cautious when an unexpected message uses one." },
          ],
        },
        { type: "h", text: "Attachments" },
        {
          type: "p",
          text: "Attachments can contain malware or lead to fake login pages. Be suspicious of any attachment you weren’t expecting — *especially* these:",
        },
        {
          type: "list",
          items: [
            "Files that run programs: `.exe`, `.scr`, `.js`, `.bat`, `.msi`, `.iso`",
            "Office files asking you to **“Enable content”** or **“Enable macros”**",
            "`.html` or `.htm` attachments (often a fake login page in disguise)",
            "Password-protected `.zip` files (the password hides the contents from security scanners)",
            "Double extensions like `invoice.pdf.exe`",
          ],
        },
        {
          type: "callout",
          tone: "warning",
          title: "“Shared document” lures",
          text: "A message saying someone shared a file with you, with a big “Open Document” button, is one of the most common phishing tricks. Open your file-sharing app directly and see if the file is really there.",
        },
      ],
      takeaways: [
        "Hover (computer) or long-press (phone) to see where a link really goes.",
        "Shortened links hide the destination.",
        "Unexpected attachments — especially .html, .zip, .exe, or macro files — are high risk.",
      ],
    },
    {
      id: "ai-perfect-grammar",
      title: "Perfect grammar isn’t a safe sign anymore",
      summary: "AI tools write flawless, personalized phishing in seconds.",
      minutes: 4,
      blocks: [
        {
          type: "p",
          text: "For years, people were taught that phishing is full of typos and broken English. That used to be good advice. **It isn’t anymore.**",
        },
        {
          type: "p",
          text: "Generative AI tools let anyone write polished, friendly, perfectly spelled messages in any language — and personalize them using details scraped from social media. A scam can now read exactly like a real message from your school or bank.",
        },
        {
          type: "compare",
          left: { title: "Outdated checks", items: ["Bad spelling?", "Weird grammar?", "Ugly formatting?", "Looks professional = safe"] },
          right: { title: "Checks that still work", items: ["Who *really* sent it? (domain)", "What is it asking me to do?", "Where does the link *really* go?", "Can I verify it another way?"] },
        },
        {
          type: "callout",
          tone: "myth",
          title: "Myth: “Scam emails are easy to spot because they look sloppy.”",
          text: "Some still do. But the dangerous ones look perfect. A professional look tells you nothing about who sent the message.",
        },
        {
          type: "check",
          question: "An email is beautifully written, uses your first name, and has your school’s logo. It asks you to re-enter your password to keep access. What’s the right call?",
          options: [
            { text: "It’s fine — it’s well-written and personalized", why: "Polish and personalization are easy to fake now, especially with AI." },
            { text: "It’s suspicious because it asks for your password", correct: true, why: "Yes. The request is the tell. Go to your school portal directly instead of using the email." },
            { text: "It’s fine because it has the logo", why: "Logos can be copied in seconds." },
          ],
        },
      ],
      takeaways: [
        "AI-written phishing can be flawless and personal.",
        "Never use “good grammar” or “has a logo” as proof of safety.",
        "Focus on sender domain, request, link destination, and verification.",
      ],
    },
  ],
  drill: {
    title: "Inbox patrol",
    description: "Medium-difficulty emails with realistic details. Find every red flag you can.",
    ref: { kind: "inbox", itemIds: ["e06", "e07", "e08", "e09", "e10", "e11", "e12", "e13"] },
  },
  quiz: [
    {
      id: "m2q1",
      prompt: "An email shows the name “Lumen Bank Support.” What should you check next?",
      options: [
        { text: "The actual email address and its domain", correct: true, why: "Display names are free text. The domain after the @ shows who really sent it." },
        { text: "Whether the logo looks right", why: "Logos are trivial to copy." },
        { text: "Whether it has any typos", why: "AI makes typo-free scams easy. Check the domain instead." },
        { text: "Nothing — the name proves it’s the bank", why: "Anyone can set any display name." },
      ],
    },
    {
      id: "m2q2",
      prompt: "Which request is the strongest sign an email is phishing?",
      options: [
        { text: "“Reply with the 6-digit code we just texted you”", correct: true, why: "One-time codes are only for you. Anyone asking for one is trying to get into your account." },
        { text: "“Your monthly statement is ready in the app”", why: "This tells you to go to the app yourself — that’s a normal, safe pattern." },
        { text: "“Thanks for your order! Here’s your receipt.”", why: "Receipts are normal (though check if you actually ordered something)." },
        { text: "“Reminder: practice moved to 4pm”", why: "An everyday message with no risky request." },
      ],
    },
    {
      id: "m2q3",
      prompt: "The real domain is shopora.example. Which sender is a lookalike?",
      options: [
        { text: "orders@shopora.example", why: "That’s the exact real domain." },
        { text: "orders@sh0pora.example", correct: true, why: "That’s a zero, not the letter o." },
        { text: "Both are the same", why: "Look closely at the third character." },
        { text: "Neither — all .example domains are safe", why: "In this course every domain is fictional; what matters is matching the brand’s real domain exactly." },
      ],
    },
    {
      id: "m2q4",
      prompt: "You’re on a laptop. How do you safely see where a link goes?",
      options: [
        { text: "Click it and look at the address bar", why: "By then you’ve already visited the page — and possibly downloaded something." },
        { text: "Hover over it without clicking and read the address that appears", correct: true, why: "Yes. On a phone, press and hold instead." },
        { text: "Read the link text", why: "Link text can say anything. Only the real address matters." },
        { text: "Copy it into a search engine", why: "Not harmful, but it won’t reliably show you the real destination. Hovering does." },
      ],
    },
    {
      id: "m2q5",
      prompt: "Which attachment is the most suspicious in an unexpected email?",
      options: [
        { text: "Invoice_4821.pdf.exe", correct: true, why: "A double extension: it pretends to be a PDF but is actually a program." },
        { text: "A photo you asked a friend to send you", why: "You were expecting it from someone you know — lower risk." },
        { text: "A class syllabus your teacher announced in class", why: "Expected and from a known source." },
        { text: "None — attachments are always safe if your antivirus is on", why: "Antivirus helps but doesn’t catch everything, especially new or password-protected files." },
      ],
    },
    {
      id: "m2q6",
      prompt: "True or false: an email with perfect grammar and a professional design is probably safe.",
      options: [
        { text: "True", why: "Not anymore. AI writes flawless scams, and logos are easy to copy." },
        { text: "False", correct: true, why: "Right. Judge the sender domain, the request, and the real link destination instead." },
      ],
    },
    {
      id: "m2q7",
      prompt: "An email says your account is locked and offers a “Restore access” button. What’s the best move?",
      options: [
        { text: "Click the button — it’s the fastest fix", why: "That’s the trap. The button may lead to a fake login page." },
        { text: "Open the app or type the website address yourself and check there", correct: true, why: "The “go direct” rule. If there’s a real problem, you’ll see it in your real account." },
        { text: "Reply asking for more details", why: "You’d be talking to the scammer. Go direct instead." },
        { text: "Forward it to your friends so they can check too", why: "That spreads the phish. Report it instead." },
      ],
    },
  ],
};
