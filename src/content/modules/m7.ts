import type { Module } from "../types";

export const m7: Module = {
  id: "what-to-do",
  number: 7,
  title: "What to do",
  tagline: "Resist. Report. Delete.",
  description:
    "Build the habits that protect you: verify through a trusted channel, report phishing the right way, and recover fast if you already clicked.",
  icon: "🛡️",
  lessons: [
    {
      id: "resist-report-delete",
      title: "Resist → Report → Delete",
      summary: "Three steps for every suspicious message.",
      minutes: 4,
      blocks: [
        { type: "p", text: "You don’t need to be 100% sure something is phishing to handle it safely. Use the same three steps every time." },
        {
          type: "steps",
          items: [
            { title: "1. Resist", text: "Don’t click, reply, call the number in the message, scan the code, or open the attachment. Feel the urge to act fast? That’s the trap." },
            { title: "2. Report", text: "Use the **Report phishing** button in your email app, tell your school’s IT team, or forward it as your organization asks. Scam texts (US): forward to **7726**. You can also report scams to the FTC at **ReportFraud.ftc.gov** and forward phishing emails to the Anti-Phishing Working Group at **reportphishing@apwg.org**." },
            { title: "3. Delete", text: "After reporting, delete it so you can’t click it later by accident." },
          ],
        },
        {
          type: "callout",
          tone: "fact",
          title: "Why reporting matters",
          text: "One report can protect hundreds of people. When IT or an email provider learns about a phishing campaign, they can block it for everyone.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Reporting a false alarm is fine",
          text: "Security teams would much rather check a real email than miss a phish. You’ll never get in trouble for reporting something suspicious.",
        },
      ],
      takeaways: [
        "Resist: don’t engage with the message.",
        "Report: use the report button or tell IT; texts go to 7726.",
        "Delete: remove it after reporting.",
      ],
    },
    {
      id: "verify-another-way",
      title: "Verify through a separate channel",
      summary: "Use contact info you already trust — never the info in the message.",
      minutes: 4,
      blocks: [
        {
          type: "p",
          text: "Sometimes a message *might* be real and you need to know. The answer is **out-of-band verification**: check using a channel the attacker doesn’t control.",
        },
        {
          type: "compare",
          left: { title: "Don’t verify using…", items: ["The link in the message", "The phone number in the message", "Replying to the message", "A number the caller gives you"] },
          right: { title: "Do verify using…", items: ["The official app", "A bookmark or address you type", "A number on your card, statement, or saved contacts", "Asking the person face to face"] },
        },
        {
          type: "message",
          kind: "sms",
          from: "Mom",
          body: ["Hi honey, I lost my phone, this is my new number. Can you send me $200 through PayLoop for an emergency? I’ll explain later"],
          note: "Verify by calling Mom’s *saved* number or asking another family member — not by texting this new number back.",
          verdict: "phish",
        },
        {
          type: "check",
          question: "An email from your school says your locker assignment changed and asks you to log in to see it. How do you verify?",
          options: [
            { text: "Log in to the school portal using your bookmark, or ask the front office", correct: true, why: "Separate, trusted channel." },
            { text: "Click the link but check the page looks right", why: "Fake pages can look identical." },
            { text: "Reply and ask if it’s real", why: "If it’s a phish, the reply goes to the attacker." },
          ],
        },
      ],
      takeaways: [
        "Verify with a channel you already trust.",
        "Never use contact details from the suspicious message.",
        "In-person or a saved number beats any link.",
      ],
    },
    {
      id: "already-clicked",
      title: "Uh-oh: I already clicked",
      summary: "Act fast, don’t panic, and tell someone.",
      minutes: 5,
      blocks: [
        {
          type: "p",
          text: "It happens to everyone — including security professionals. What matters is how fast you respond. **Being embarrassed is normal; staying quiet is the real danger.**",
        },
        {
          type: "steps",
          items: [
            { title: "1. Stop", text: "Close the page. Don’t enter anything else. If you downloaded a file, don’t open it. If you think malware is running, disconnect from Wi-Fi." },
            { title: "2. Change your password", text: "If you typed a password, change it immediately — from a trusted device, by going to the real site directly. Change it anywhere else you reused it too." },
            { title: "3. Turn on MFA", text: "If it wasn’t on already, turn it on now. Sign out of other sessions if the site offers it." },
            { title: "4. Tell someone", text: "Tell IT (for school or work accounts) or a parent/guardian (for personal accounts). They can help limit the damage." },
            { title: "5. Watch your accounts", text: "Check for unfamiliar logins, sent messages, purchases, or changed settings (like email forwarding rules) over the next few weeks." },
            { title: "6. If money or card info was involved", text: "Contact your bank or card issuer right away using the number on your card. They can block charges and issue a new card." },
          ],
        },
        {
          type: "callout",
          tone: "warning",
          title: "Watch out for “recovery” scams",
          text: "After an incident, scammers sometimes pose as helpers who can “get your money back” for a fee. Only work with your bank, school IT, or official agencies you contact yourself.",
        },
      ],
      takeaways: [
        "Stop, change passwords, turn on MFA.",
        "Tell IT or a parent — fast reporting limits damage.",
        "Watch your accounts and beware of “recovery” scams.",
      ],
    },
    {
      id: "build-the-habit",
      title: "Build the habit",
      summary: "A 5-question checklist you can run in 10 seconds.",
      minutes: 3,
      blocks: [
        { type: "p", text: "You now know dozens of red flags. In real life, you need something faster. Run this checklist on anything unexpected:" },
        {
          type: "list",
          ordered: true,
          items: [
            "**Was I expecting this?**",
            "**Who is it really from?** (the domain, not the name)",
            "**What does it want me to do?** (click, log in, pay, share, approve)",
            "**How does it make me feel?** (rushed, scared, excited = slow down)",
            "**Can I check it another way?** (app, bookmark, saved number, in person)",
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Teach someone else",
          text: "The fastest way to lock in a skill is to teach it. Show a friend or family member one trick from this course this week — older relatives are frequent targets for phone scams.",
        },
      ],
      takeaways: ["Expecting it? Who sent it? What does it want? How do I feel? Can I verify?", "Make the checklist automatic.", "Share what you’ve learned."],
    },
  ],
  drill: {
    title: "What would you do?",
    description: "Step through a realistic incident and choose the best response at each moment.",
    ref: { kind: "scenario", scenarioId: "clicked-a-link" },
  },
  quiz: [
    {
      id: "m7q1",
      prompt: "What are the three steps for handling a suspicious message?",
      options: [
        { text: "Resist, Report, Delete", correct: true, why: "Don’t engage, tell the right people, then remove it." },
        { text: "Reply, Forward, Archive", why: "Replying and forwarding can spread the attack." },
        { text: "Click, Check, Close", why: "Clicking is the step to avoid." },
      ],
    },
    {
      id: "m7q2",
      prompt: "You entered your password on a page you now think was fake. What should you do first?",
      options: [
        { text: "Change that password right away from a trusted device, and anywhere you reused it", correct: true, why: "Speed matters — attackers often use stolen passwords within minutes." },
        { text: "Wait and see if anything happens", why: "Waiting gives the attacker time." },
        { text: "Delete your browser history", why: "That doesn’t protect your account." },
      ],
    },
    {
      id: "m7q3",
      prompt: "Why should you tell IT or a parent if you clicked a phishing link?",
      options: [
        { text: "So they can help contain the damage and protect others", correct: true, why: "Fast reporting limits harm — no one should be punished for reporting honestly." },
        { text: "You shouldn’t — it’s embarrassing", why: "Staying quiet is the real risk. Everyone gets fooled sometimes." },
        { text: "So they can take away your device", why: "The goal is to protect you and others, not punish you." },
      ],
    },
    {
      id: "m7q4",
      prompt: "Which is a good “separate channel” to verify a message from your bank?",
      options: [
        { text: "The phone number printed on the back of your card", correct: true, why: "You already trust that number; the attacker doesn’t control it." },
        { text: "The phone number in the message", why: "That could go straight to the scammer." },
        { text: "Replying to the message", why: "The reply goes to whoever sent it." },
      ],
    },
    {
      id: "m7q5",
      prompt: "After a phishing incident, what account setting is worth checking for sneaky changes?",
      options: [
        { text: "Email forwarding rules and recovery email/phone", correct: true, why: "Attackers often add forwarding rules or change recovery info to keep access." },
        { text: "Your profile picture", why: "Unlikely to matter. Check forwarding and recovery settings." },
        { text: "Your font size", why: "Not a security setting." },
      ],
    },
    {
      id: "m7q6",
      prompt: "Someone contacts you offering to recover money you lost to a scam — for an upfront fee. What is this?",
      options: [
        { text: "Likely another scam (a recovery scam)", correct: true, why: "Scammers target recent victims. Work only with your bank or official agencies you contact yourself." },
        { text: "A great opportunity", why: "Upfront fees for recovery are a classic follow-up scam." },
      ],
    },
  ],
};
