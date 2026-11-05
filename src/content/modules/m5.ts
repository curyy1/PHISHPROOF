import type { Module } from "../types";

export const m5: Module = {
  id: "advanced-attacks",
  number: 5,
  title: "Advanced attacks",
  tagline: "When the scam knows your name.",
  description:
    "Spear phishing, business email compromise, pretexting, fake login pages, MFA fatigue and deepfakes — the attacks that fool professionals.",
  icon: "🎯",
  lessons: [
    {
      id: "spear-phishing",
      title: "Spear phishing",
      summary: "Researched, personal, and convincing.",
      minutes: 5,
      blocks: [
        {
          type: "p",
          text: "**Spear phishing** is phishing aimed at a specific person or small group. The attacker researches you first — social media, team rosters, club pages, LinkedIn — then writes a message that fits your life perfectly.",
        },
        {
          type: "message",
          kind: "email",
          from: "Coach Rivera <coach.rivera@northvale-athletics.test>",
          subject: "Updated travel roster for Saturday’s regional",
          body: [
            "Hey Maya — great hustle at Tuesday’s practice. Updated bus times and the roster for the regional are in the shared folder. Sign in with your school account to view it before Friday. — Coach R",
          ],
          note: "Uses your name, a real event, and your coach’s name (all from public posts). But the domain isn’t your school’s, and it asks you to sign in through a link.",
          verdict: "phish",
        },
        { type: "h", text: "Where attackers get your details" },
        {
          type: "list",
          items: [
            "Public social media posts, tags, and check-ins",
            "School and club websites, sports rosters, and news articles",
            "Data leaked in past breaches",
            "Earlier phishing that already got into a friend’s or teacher’s account",
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Personal ≠ legit",
          text: "Details that feel “too specific to be fake” are often the easiest to find. Verify through a channel you trust — ask your coach in person or check the team app.",
        },
      ],
      takeaways: [
        "Spear phishing uses research to look personal.",
        "Your public info is the raw material.",
        "Personal details are not proof — verify independently.",
      ],
    },
    {
      id: "business-email-compromise",
      title: "Business email compromise & pretexting",
      summary: "No links, no attachments — just a believable story.",
      minutes: 6,
      blocks: [
        {
          type: "p",
          text: "**Business email compromise (BEC)** is when an attacker poses as (or actually hacks the email of) a boss, coworker, vendor, or client to redirect money or data. These emails often contain *no links or attachments at all*, so filters don’t catch them. The FBI reports BEC losses in the **billions of dollars every year**.",
        },
        {
          type: "list",
          items: [
            "**Fake invoice:** “Our bank details have changed — please send this month’s payment to the new account.”",
            "**CEO / principal fraud:** “I need you to handle an urgent, confidential payment today.”",
            "**Payroll change:** “Please update my direct deposit to this new account before Friday.”",
            "**Gift card favor:** the classic “I’m in a meeting, buy gift cards” message.",
          ],
        },
        { type: "h", text: "Pretexting: the story is the weapon" },
        {
          type: "p",
          text: "**Pretexting** means inventing a believable scenario (a *pretext*) to get information or access. “Hi, I’m from the IT department, we’re upgrading accounts today — I just need to confirm your login.” Pretexting happens by email, phone, chat, and in person.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Rule: any change to money or access gets a second channel",
          text: "If a message asks to change bank details, send money, or share access, confirm it with a phone call to a number you already have — or in person. Never use contact info from the message itself.",
        },
        {
          type: "check",
          question: "A long-time vendor emails: “We switched banks. Please send today’s payment to the new account below.” The email address looks right. What should happen?",
          options: [
            { text: "Pay the new account — the address matches", why: "Vendor email accounts get hacked, and BEC emails can come from real addresses." },
            { text: "Call the vendor on a number you already had on file to confirm", correct: true, why: "Yes. A second, trusted channel stops BEC cold." },
            { text: "Reply to the email asking if it’s real", why: "If the account is hacked, the attacker will say yes." },
          ],
        },
      ],
      takeaways: [
        "BEC impersonates bosses, vendors, and coworkers to move money.",
        "Pretexting uses a believable story to get info or access.",
        "Confirm money and access changes through a second, trusted channel.",
      ],
    },
    {
      id: "fake-login-pages",
      title: "Fake login pages",
      summary: "Pixel-perfect copies that steal your password — and sometimes your MFA code.",
      minutes: 5,
      blocks: [
        {
          type: "p",
          text: "Most phishing links lead to a **fake login page** — a copy of a real sign-in screen. Attackers use ready-made “phishing kits” that copy logos, colors, and even your profile picture. The only reliable difference is the **domain in the address bar**.",
        },
        {
          type: "p",
          text: "Some advanced kits sit *between* you and the real site. They pass your password **and your MFA code** to the real service in real time, then steal the login session. That’s why phishing-resistant sign-in like **passkeys** (Module 6) matters: a passkey simply won’t work on the wrong domain.",
        },
        {
          type: "steps",
          items: [
            { title: "Check the domain before typing", text: "Not the page design — the address bar." },
            { title: "Be suspicious of surprise logins", text: "If a link or document suddenly asks you to sign in again, back out and go direct." },
            { title: "Let your password manager help", text: "A password manager won’t autofill on a fake domain. If it doesn’t offer your password, stop and look closely." },
          ],
        },
        {
          type: "callout",
          tone: "fact",
          title: "Your password manager is a phishing detector",
          text: "Password managers match saved passwords to the exact domain. On `lumenbank.example.secure-check.test`, it stays silent — a clear warning sign.",
        },
      ],
      takeaways: [
        "Fake login pages can look identical to the real thing.",
        "Only the domain in the address bar tells the truth.",
        "If your password manager doesn’t autofill, stop and check.",
      ],
    },
    {
      id: "mfa-fatigue",
      title: "MFA fatigue (push bombing)",
      summary: "Approve requests you didn’t start? Never.",
      minutes: 4,
      blocks: [
        {
          type: "p",
          text: "Multi-factor authentication (MFA) adds a second check when you log in, like a code or a push notification. It stops most attacks — but attackers who already have your password try one more trick: **MFA fatigue**, also called **push bombing**.",
        },
        {
          type: "steps",
          items: [
            { title: "1. They have your password", text: "Maybe from an old breach or a phishing page." },
            { title: "2. They spam login attempts", text: "Your phone buzzes with “Approve sign-in?” over and over — often late at night." },
            { title: "3. They add pressure", text: "Sometimes they message or call: “This is IT, just approve the prompt to stop the alerts.”" },
            { title: "4. One tap and they’re in", text: "Annoyed or confused, someone taps Approve." },
          ],
        },
        {
          type: "callout",
          tone: "warning",
          title: "If you get a login prompt you didn’t start",
          text: "**Deny it.** Then change your password right away (your password is likely stolen) and tell IT or a parent. Many apps now use **number matching** — typing a number shown on the login screen — which makes this attack much harder.",
        },
        {
          type: "check",
          question: "At 11:30 pm your phone shows five “Approve sign-in?” prompts for your school account. What do you do?",
          options: [
            { text: "Approve one so they stop", why: "That lets the attacker in." },
            { text: "Deny them, change your password, and report it", correct: true, why: "Exactly. Unexpected prompts mean someone has your password." },
            { text: "Ignore them until morning", why: "Denying is good, but your password is compromised — change it now." },
          ],
        },
      ],
      takeaways: [
        "Unexpected MFA prompts mean someone has your password.",
        "Deny, change your password, and report.",
        "Number matching and passkeys defeat push bombing.",
      ],
    },
    {
      id: "deepfakes",
      title: "Deepfakes",
      summary: "When seeing and hearing isn’t believing.",
      minutes: 5,
      blocks: [
        {
          type: "p",
          text: "**Deepfakes** are AI-generated videos, images, or audio that make someone appear to say or do something they never did. Scammers use them on video calls, in voice messages, and in fake celebrity ads.",
        },
        {
          type: "stat",
          value: "$25M",
          label: "In 2024, a finance employee in Hong Kong transferred about US$25 million after a video call in which the “CFO” and other “colleagues” were all deepfakes.",
          source: "Widely reported by international news outlets",
        },
        { type: "h", text: "Common deepfake scams" },
        {
          type: "list",
          items: [
            "Fake celebrity videos promoting crypto, giveaways, or “miracle” products",
            "A “boss” on a video call asking for an urgent transfer",
            "A cloned voice of a family member asking for help",
            "Fake images used for harassment or blackmail",
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Don’t try to out-spot the AI — verify the request",
          text: "Glitchy lips or odd blinking *can* be clues, but deepfakes are improving fast. The reliable defense is the same as always: if a video or voice asks for money, secrets, or access, **verify through a separate channel you trust**.",
        },
      ],
      takeaways: [
        "Video and voice can be faked convincingly.",
        "Visual glitches are unreliable clues as AI improves.",
        "Verify any request for money, secrets, or access through another channel.",
      ],
    },
  ],
  drill: {
    title: "Fake login page lab",
    description: "You’ll land on sign-in pages. Inspect the address bar and decide: sign in, or get out?",
    ref: { kind: "browser", itemIds: ["b01", "b02", "b03", "b04", "b05", "b06", "b07", "b08"] },
  },
  quiz: [
    {
      id: "m5q1",
      prompt: "What makes spear phishing harder to spot than bulk phishing?",
      options: [
        { text: "It uses personal details about you to seem legitimate", correct: true, why: "Right — research makes it believable." },
        { text: "It always comes from real accounts", why: "Sometimes, but usually it’s the personalization that makes it convincing." },
        { text: "It never contains links", why: "It often does. Some advanced scams (like BEC) skip links, though." },
      ],
    },
    {
      id: "m5q2",
      prompt: "Which is a typical business email compromise (BEC) request?",
      options: [
        { text: "“Please update the vendor’s bank account to this new one before today’s payment.”", correct: true, why: "Redirecting payments is the core of BEC." },
        { text: "“Your package is waiting — pay $1.99.”", why: "That’s a bulk smishing lure, not BEC." },
        { text: "“You won a free phone!”", why: "That’s a greed lure aimed at consumers." },
      ],
    },
    {
      id: "m5q3",
      prompt: "You get repeated MFA push prompts you didn’t request. What does that most likely mean?",
      options: [
        { text: "Your phone has a glitch", why: "Possible, but you should assume the worst: someone is trying to log in." },
        { text: "Someone has your password and is trying to get you to approve their login", correct: true, why: "Yes. Deny, change your password, and report it." },
        { text: "Your account is being upgraded", why: "Upgrades don’t require repeated approval prompts." },
      ],
    },
    {
      id: "m5q4",
      prompt: "Why do passkeys help against fake login pages?",
      options: [
        { text: "They’re tied to the real website’s domain, so they won’t work on a fake one", correct: true, why: "Exactly — that’s what makes them phishing-resistant." },
        { text: "They’re longer than passwords", why: "Length isn’t the reason. Passkeys are cryptographically bound to the real domain." },
        { text: "They make websites load faster", why: "Speed isn’t the point." },
      ],
    },
    {
      id: "m5q5",
      prompt: "A video call with your “manager” asks you to urgently wire money and keep it confidential. What’s the safest response?",
      options: [
        { text: "Do it — you can see their face", why: "Faces and voices can be deepfaked." },
        { text: "Verify by contacting your manager through a known, separate channel first", correct: true, why: "Urgency + secrecy + money = verify independently." },
        { text: "Ask them to turn their head to check for glitches", why: "Glitch-spotting is unreliable as deepfakes improve. Verify the request instead." },
      ],
    },
    {
      id: "m5q6",
      prompt: "What is pretexting?",
      options: [
        { text: "Inventing a believable story to trick someone into sharing info or access", correct: true, why: "Right — the story (pretext) is the weapon." },
        { text: "Sending a text before an email", why: "It’s about the made-up scenario, not the order of messages." },
        { text: "Encrypting a message before sending it", why: "That’s encryption, not pretexting." },
      ],
    },
    {
      id: "m5q7",
      prompt: "Your password manager doesn’t offer to fill your password on a login page you reached from an email link. What should you think?",
      options: [
        { text: "The manager is broken — type the password manually", why: "That’s exactly what attackers hope you’ll do." },
        { text: "You may be on a fake domain — stop and check the address", correct: true, why: "Password managers match exact domains; silence is a warning." },
      ],
    },
  ],
};
