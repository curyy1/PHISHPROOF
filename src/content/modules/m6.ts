import type { Module } from "../types";

export const m6: Module = {
  id: "passwords-and-accounts",
  number: 6,
  title: "Passwords & accounts",
  tagline: "Make a stolen password useless.",
  description:
    "What modern guidance (NIST SP 800-63B) actually says: long passphrases, no forced rotation, breached-password checks, password managers, MFA and passkeys.",
  icon: "🔐",
  lessons: [
    {
      id: "length-beats-complexity",
      title: "Length beats complexity",
      summary: "A long passphrase is stronger — and easier to remember — than P@ssw0rd!",
      minutes: 5,
      blocks: [
        {
          type: "p",
          text: "For years, websites forced rules like “one uppercase, one number, one symbol.” People responded with predictable passwords like `Summer2025!` — and attackers know those patterns. The U.S. standard for digital identity, **NIST SP 800-63B**, now says: **length matters most**.",
        },
        {
          type: "compare",
          left: { title: "Short and “complex”", items: ["`Tr0ub4dor&3`", "Hard to remember", "Follows patterns attackers guess first", "Cracked faster than you’d think"] },
          right: { title: "Long passphrase", items: ["`crayon-orbit-maple-thunder-sofa`", "Easy to picture and remember", "Random words = huge number of combinations", "Much harder to crack"] },
        },
        { type: "h", text: "What NIST recommends" },
        {
          type: "list",
          items: [
            "**At least 15 characters** when a password is your only way to log in. (Sites may allow 8 when you also use MFA, but longer is better.)",
            "Sites should allow **at least 64 characters**, spaces, and all characters including emoji.",
            "Sites **should not force** composition rules like “must include a symbol.”",
            "Sites **should check** new passwords against lists of common and breached passwords.",
            "Sites should **allow pasting** so password managers work.",
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "How to make a great passphrase",
          text: "Pick **4–6 random, unrelated words** (let a generator or dice choose — humans are bad at random). Don’t use song lyrics, quotes, or your pet’s name. Try the generator in the Password Lab.",
        },
      ],
      takeaways: [
        "Length beats complexity. Aim for 15+ characters.",
        "Random multi-word passphrases are strong and memorable.",
        "Avoid famous phrases and personal info.",
      ],
    },
    {
      id: "no-reuse-no-rotation",
      title: "Never reuse; don’t rotate for no reason",
      summary: "One breach shouldn’t unlock everything. Change passwords when there’s a reason.",
      minutes: 4,
      blocks: [
        {
          type: "p",
          text: "When a website gets breached, attackers try the leaked email-and-password pairs on hundreds of other sites. This is called **credential stuffing**. If you reuse a password, one breach can unlock your email, games, and school account all at once.",
        },
        {
          type: "callout",
          tone: "myth",
          title: "Myth: “Change your password every 90 days.”",
          text: "NIST says organizations **should not require** regular password changes. Forced changes lead to weak patterns (`Password1` → `Password2`). Change a password when there’s evidence it was **compromised** — like a breach alert or a phishing click.",
        },
        { type: "h", text: "Check if you’ve been breached" },
        {
          type: "p",
          text: "Services like **Have I Been Pwned** (haveibeenpwned.com) let you check whether your email appeared in known breaches. Many password managers and browsers also warn you about breached or reused passwords automatically.",
        },
        {
          type: "check",
          question: "You learn a game site you used was breached. You used the same password for your email. What should you do first?",
          options: [
            { text: "Change your email password to a new, unique one (and turn on MFA)", correct: true, why: "Your email is the key to resetting everything else — protect it first." },
            { text: "Wait to see if anything bad happens", why: "Attackers test leaked passwords quickly. Act now." },
            { text: "Only change the game password", why: "The reused password is the problem — change it everywhere you used it, starting with email." },
          ],
        },
      ],
      takeaways: [
        "Every account needs its own password.",
        "Don’t rotate on a schedule — change passwords when compromised.",
        "Check for breaches and protect your email account first.",
      ],
    },
    {
      id: "password-managers",
      title: "Password managers",
      summary: "Remember one strong passphrase; let the manager remember the rest.",
      minutes: 4,
      blocks: [
        {
          type: "p",
          text: "Nobody can remember 100 unique passwords. A **password manager** is an app that creates, stores, and fills strong, unique passwords for every site. You only remember one strong passphrase to unlock it.",
        },
        {
          type: "list",
          items: [
            "**Generates** long random passwords so you never reuse.",
            "**Autofills only on the correct domain** — a built-in phishing detector.",
            "**Syncs** across your phone and computer.",
            "**Warns** about reused, weak, or breached passwords.",
          ],
        },
        {
          type: "p",
          text: "Your browser and phone have one built in, and there are reputable standalone apps too. Ask a parent or guardian before installing new apps, and protect the manager itself with a strong passphrase and MFA.",
        },
        {
          type: "callout",
          tone: "fact",
          title: "“Isn’t it risky to put all my passwords in one place?”",
          text: "Good password managers encrypt your vault so the company can’t read it. The risk of one well-protected vault is far lower than the risk of reused or weak passwords everywhere.",
        },
      ],
      takeaways: [
        "A password manager makes unique passwords effortless.",
        "It refuses to autofill on fake domains.",
        "Protect it with a strong passphrase and MFA.",
      ],
    },
    {
      id: "mfa-and-passkeys",
      title: "MFA and passkeys",
      summary: "Not all second factors are equal. Passkeys are the strongest.",
      minutes: 6,
      blocks: [
        {
          type: "p",
          text: "**Multi-factor authentication (MFA)** means logging in needs something you *know* (password) plus something you *have* (phone, security key) or *are* (fingerprint, face). Even if your password is stolen, MFA blocks most account takeovers. Turn it on for email, school, social, and gaming accounts.",
        },
        { type: "h", text: "From weaker to stronger" },
        {
          type: "steps",
          items: [
            { title: "SMS text codes — better than nothing", text: "Codes sent by text can be intercepted or stolen through **SIM swapping** (an attacker convinces your carrier to move your number to their phone), and you can be tricked into reading them out. NIST treats SMS as a restricted option." },
            { title: "Authenticator app codes — good", text: "An app on your phone generates codes offline. Harder to intercept than SMS — but you can still be tricked into typing a code on a fake page." },
            { title: "Push approvals with number matching — good", text: "Matching a number on screen stops accidental approvals and most push bombing." },
            { title: "Passkeys and security keys — best", text: "**Phishing-resistant.** A passkey is tied to the real website’s domain, so it simply won’t work on a fake site — no code to steal, nothing to type." },
          ],
        },
        { type: "h", text: "What’s a passkey?" },
        {
          type: "p",
          text: "A **passkey** replaces your password with a secret key stored on your device, unlocked with your fingerprint, face, or PIN. The site never receives a password, and the passkey only works on the site that created it. Many major services already support them — look for “Create a passkey” in your security settings.",
        },
        {
          type: "callout",
          tone: "warning",
          title: "Save your recovery codes",
          text: "When you turn on MFA, you usually get backup or recovery codes. Store them somewhere safe (like your password manager or a printed copy at home) so you don’t get locked out if you lose your phone.",
        },
      ],
      takeaways: [
        "Turn on MFA everywhere it’s offered.",
        "SMS < authenticator app < passkeys/security keys.",
        "Passkeys are phishing-resistant because they’re bound to the real domain.",
      ],
    },
  ],
  drill: {
    title: "Password lab challenge",
    description: "Build a passphrase that scores “very strong” and is 15+ characters. Everything stays on your device.",
    ref: { kind: "passwords" },
  },
  quiz: [
    {
      id: "m6q1",
      prompt: "According to NIST SP 800-63B, what matters most for password strength?",
      options: [
        { text: "Length", correct: true, why: "Yes — longer passphrases dramatically increase the number of possible guesses." },
        { text: "Including at least one symbol", why: "NIST says sites should not force composition rules like this." },
        { text: "Changing it every 90 days", why: "NIST recommends against forced periodic changes." },
        { text: "Using a word from the dictionary with numbers at the end", why: "That’s one of the first patterns attackers try." },
      ],
    },
    {
      id: "m6q2",
      prompt: "What minimum length does NIST recommend for a password that’s your only way to log in?",
      options: [
        { text: "6 characters", why: "Far too short." },
        { text: "8 characters", why: "8 is the minimum when used alongside MFA. For password-only logins NIST recommends 15." },
        { text: "15 characters", correct: true, why: "Right — and sites should allow at least 64." },
        { text: "100 characters", why: "You can go long, but 15 is the recommended minimum." },
      ],
    },
    {
      id: "m6q3",
      prompt: "When should you change a password?",
      options: [
        { text: "Every month, no matter what", why: "Scheduled changes lead to weak patterns. NIST advises against them." },
        { text: "When there’s evidence it was compromised (breach, phishing click, suspicious login)", correct: true, why: "Yes — change it promptly when there’s a reason." },
        { text: "Never", why: "If it’s been exposed, change it right away." },
      ],
    },
    {
      id: "m6q4",
      prompt: "Which second factor is the most resistant to phishing?",
      options: [
        { text: "SMS text codes", why: "These can be stolen through SIM swapping or by tricking you." },
        { text: "Authenticator app codes", why: "Better than SMS, but you can still type them into a fake page." },
        { text: "Passkeys or hardware security keys", correct: true, why: "They’re bound to the real domain, so a fake site gets nothing usable." },
        { text: "Security questions", why: "Answers are often guessable or public. NIST discourages them." },
      ],
    },
    {
      id: "m6q5",
      prompt: "What is credential stuffing?",
      options: [
        { text: "Trying leaked username/password pairs on many other sites", correct: true, why: "That’s why reusing passwords is so dangerous." },
        { text: "Creating a very long password", why: "That’s just a good passphrase." },
        { text: "Storing passwords in a manager", why: "That’s a good habit, not an attack." },
      ],
    },
    {
      id: "m6q6",
      prompt: "Why is a password manager also a phishing defense?",
      options: [
        { text: "It only autofills on the exact domain where you saved the password", correct: true, why: "On a lookalike domain it stays silent — a warning sign." },
        { text: "It blocks all emails with links", why: "Password managers don’t filter email." },
        { text: "It makes your passwords shorter", why: "It does the opposite — it makes long, random passwords practical." },
      ],
    },
  ],
};
