import type { ExamQuestion } from "./types";

export const EXAM_PASS_PERCENT = 80;

/** Final exam: 20 new questions across all modules. Pass = 80% (16/20). */
export const examQuestions: ExamQuestion[] = [
  {
    id: "fx01",
    moduleId: "what-is-phishing",
    prompt: "Which combination of emotional triggers appears in: “I’m your principal. I need gift cards in 1 hour. Keep this quiet.”",
    options: [
      { text: "Authority, urgency and secrecy", correct: true, why: "Principal (authority), 1 hour (urgency), keep quiet (secrecy)." },
      { text: "Curiosity and greed", why: "Nothing is offered or teased here." },
      { text: "None — principals often ask this", why: "No principal asks students for gift card codes." },
    ],
  },
  {
    id: "fx02",
    moduleId: "what-is-phishing",
    prompt: "What is the best reason to pause when a message makes you feel panicked?",
    options: [
      { text: "Strong emotion is the tool attackers use to make you act before thinking", correct: true, why: "Feeling rushed is a signal to slow down." },
      { text: "Panicked people type more slowly", why: "The point is that emotions override careful checking." },
      { text: "Messages expire if you wait", why: "Real issues will still be there when you check through the official app." },
    ],
  },
  {
    id: "fx03",
    moduleId: "email-red-flags",
    prompt: "Which email detail is the MOST reliable sign of who sent a message?",
    exhibit: { type: "message", kind: "email", from: "Lumen Bank Support <support@lumenbank-help.test>", subject: "Security notice", body: ["Please review your account."] },
    options: [
      { text: "The domain after the @ (lumenbank-help.test)", correct: true, why: "The display name can be anything. This domain isn’t Lumen Bank’s." },
      { text: "The display name “Lumen Bank Support”", why: "Display names are free text." },
      { text: "The professional tone", why: "Tone is easy to fake, especially with AI." },
    ],
  },
  {
    id: "fx04",
    moduleId: "email-red-flags",
    prompt: "An email is flawlessly written and uses your first name. Which statement is true?",
    options: [
      { text: "That tells you nothing about whether it’s safe", correct: true, why: "AI makes polished, personalized phishing easy." },
      { text: "It’s safe — scams have typos", why: "That advice is outdated." },
      { text: "It’s safe — scammers don’t know names", why: "Names are easy to find on social media or in leaked data." },
    ],
  },
  {
    id: "fx05",
    moduleId: "email-red-flags",
    prompt: "Which attachment should worry you most in an unexpected email?",
    options: [
      { text: "account_statement.html", correct: true, why: "HTML attachments often open fake login pages." },
      { text: "A team photo your coach said they’d send", why: "Expected, from a known sender." },
      { text: "No attachment at all", why: "No attachment can still be phishing (via links or requests), but it’s not an attachment risk." },
    ],
  },
  {
    id: "fx06",
    moduleId: "reading-links",
    prompt: "Who controls this page?",
    exhibit: { type: "url", parts: [{ text: "https://questify.example.reward-center.test/claim" }] },
    options: [
      { text: "reward-center.test", correct: true, why: "Read the hostname right-to-left from the first single slash." },
      { text: "Questify", why: "questify.example is only a subdomain here." },
      { text: "Nobody — it’s invalid", why: "It’s a perfectly valid URL, which is why the trick works." },
    ],
  },
  {
    id: "fx07",
    moduleId: "reading-links",
    prompt: "A login page shows a padlock. What can you conclude?",
    options: [
      { text: "The connection is encrypted — but you still need to check the domain", correct: true, why: "Scam sites use HTTPS too." },
      { text: "The site is verified as the real company", why: "Certificates are free and automatic for any domain." },
      { text: "Your password is safe no matter what", why: "On a fake site it goes straight to the attacker." },
    ],
  },
  {
    id: "fx08",
    moduleId: "reading-links",
    prompt: "Which URL is safe if you expect StreamBox (streambox.example)?",
    options: [
      { text: "https://account.streambox.example/plan", correct: true, why: "The hostname ends in streambox.example." },
      { text: "https://streambox.example.plan-update.test/", why: "The domain is plan-update.test." },
      { text: "https://streambox-plans.example/", why: "Hyphenated lookalike — a different domain." },
      { text: "https://strearnbox.example/plan", why: "“rn” imitating “m”." },
    ],
  },
  {
    id: "fx09",
    moduleId: "beyond-email",
    prompt: "A caller says they’re from your bank and asks for the code just texted to you “to verify your identity.” What is happening?",
    options: [
      { text: "They’re trying to use the code to log into your account", correct: true, why: "Banks never ask for one-time codes. Hang up and call the number on your card." },
      { text: "Standard bank procedure", why: "No legitimate bank asks you to read out a one-time code." },
      { text: "A system test", why: "There’s no reason to share a code for a test." },
    ],
  },
  {
    id: "fx10",
    moduleId: "beyond-email",
    prompt: "What makes QR-code phishing (quishing) effective?",
    options: [
      { text: "You can’t see the link until you scan it, and it moves you to your phone where filters may not check it", correct: true, why: "That’s why you should read the preview and avoid logging in through QR codes." },
      { text: "QR codes contain viruses in the image", why: "The risk is the link, not the picture." },
      { text: "QR codes only work on old phones", why: "They work everywhere — that’s why scammers use them." },
    ],
  },
  {
    id: "fx11",
    moduleId: "beyond-email",
    prompt: "Your “cousin” calls crying and asks for money, and it sounds just like them. Best move?",
    options: [
      { text: "Hang up and call them back on their saved number, or ask for the family safe word", correct: true, why: "AI voice clones make voices unreliable proof." },
      { text: "Send the money — you recognize their voice", why: "Voices can be cloned from short clips." },
      { text: "Ask them to send a selfie", why: "Images can be faked too. Call back on a number you trust." },
    ],
  },
  {
    id: "fx12",
    moduleId: "advanced-attacks",
    prompt: "A vendor’s real email account asks you to update their bank details before today’s payment. What stops this attack?",
    options: [
      { text: "Calling the vendor on a number already on file to confirm", correct: true, why: "Out-of-band verification stops business email compromise." },
      { text: "Checking the email has no typos", why: "BEC messages are often flawless." },
      { text: "Replying to confirm", why: "If the account is compromised, the attacker replies." },
    ],
  },
  {
    id: "fx13",
    moduleId: "advanced-attacks",
    prompt: "You receive many MFA push requests you didn’t start. What does it most likely mean, and what should you do?",
    options: [
      { text: "Someone has your password — deny, change your password, and report it", correct: true, why: "That’s push bombing / MFA fatigue." },
      { text: "It’s a glitch — approve one to clear them", why: "Approving lets the attacker in." },
      { text: "Your MFA is broken — turn it off", why: "MFA is working. Your password is the problem." },
    ],
  },
  {
    id: "fx14",
    moduleId: "advanced-attacks",
    prompt: "Why is spear phishing more dangerous than bulk phishing?",
    options: [
      { text: "It uses researched personal details, making it more believable", correct: true, why: "Personalization lowers your guard." },
      { text: "It always contains malware", why: "Not necessarily; many just steal passwords or money." },
      { text: "It can only be sent by governments", why: "Anyone can research a target online." },
    ],
  },
  {
    id: "fx15",
    moduleId: "passwords-and-accounts",
    prompt: "Which password is strongest?",
    options: [
      { text: "maple-crayon-orbit-thunder-sofa", correct: true, why: "Long, random words = huge number of combinations." },
      { text: "P@ssw0rd2025!", why: "Short and built from patterns attackers try first." },
      { text: "Jordan2009", why: "Name + year is easy to guess." },
      { text: "Qw3rty!!", why: "Keyboard pattern, very short." },
    ],
  },
  {
    id: "fx16",
    moduleId: "passwords-and-accounts",
    prompt: "What does NIST SP 800-63B say about forcing password changes every 90 days?",
    options: [
      { text: "Don’t require it — change passwords when there’s evidence of compromise", correct: true, why: "Scheduled changes lead to weak, predictable passwords." },
      { text: "It’s required for all accounts", why: "NIST recommends against periodic forced changes." },
      { text: "Change every 7 days", why: "That would make passwords weaker, not stronger." },
    ],
  },
  {
    id: "fx17",
    moduleId: "passwords-and-accounts",
    prompt: "Rank these sign-in protections from weakest to strongest against phishing.",
    options: [
      { text: "SMS code → authenticator app code → passkey", correct: true, why: "Passkeys are bound to the real domain and can’t be phished." },
      { text: "Passkey → SMS code → authenticator app", why: "Passkeys are the strongest, not the weakest." },
      { text: "They’re all equally strong", why: "SMS can be SIM-swapped; codes can be typed into fake pages; passkeys can’t be." },
    ],
  },
  {
    id: "fx18",
    moduleId: "what-to-do",
    prompt: "What’s the correct order for handling a suspicious message?",
    options: [
      { text: "Resist → Report → Delete", correct: true, why: "Don’t engage, tell the right people, then delete." },
      { text: "Delete → Report → Resist", why: "Report before deleting so others can be protected." },
      { text: "Reply → Forward → Delete", why: "Never reply to or forward a phish (except to report it)." },
    ],
  },
  {
    id: "fx19",
    moduleId: "what-to-do",
    prompt: "You typed your password into a fake page. What should you do FIRST?",
    options: [
      { text: "Change the password (and anywhere you reused it) by going to the real site directly", correct: true, why: "Then turn on MFA, tell IT or a parent, and watch your accounts." },
      { text: "Clear your browser history", why: "That doesn’t protect your account." },
      { text: "Nothing — they probably won’t use it", why: "Stolen passwords are used fast." },
    ],
  },
  {
    id: "fx20",
    moduleId: "what-to-do",
    prompt: "Which is a trusted “separate channel” to verify a text from “Mom” at a new number?",
    options: [
      { text: "Calling Mom’s number already saved in your contacts", correct: true, why: "You control that channel; the scammer doesn’t." },
      { text: "Texting the new number back to ask", why: "That goes to whoever sent the text." },
      { text: "Calling the number that texted you", why: "Same problem — it’s the scammer’s number." },
    ],
  },
];
