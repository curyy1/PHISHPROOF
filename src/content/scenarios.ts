import type { Scenario } from "./types";

export const scenarios: Scenario[] = [
  {
    id: "clicked-a-link",
    title: "The late-night login",
    intro: "It’s 10:40 pm. You’re finishing homework when an email from “Northvale IT” says your account will be locked tonight unless you sign in. You’re tired, and you click.",
    steps: [
      {
        id: "st1",
        situation: "The page looks exactly like your school sign-in. Before typing, you glance at the address bar: `northvale-schools.example.account-lock.test`. What do you do?",
        choices: [
          { text: "Close the tab without typing anything", best: true, feedback: "Perfect. The domain is account-lock.test — not your school. Nothing was entered, so no harm done." },
          { text: "Type your username only, to see what happens", feedback: "Even a username helps attackers. There’s no reason to type anything on a page with the wrong domain." },
          { text: "Sign in — it looks identical to the real page", feedback: "Looks are easy to copy. The domain is what matters, and this one belongs to account-lock.test." },
        ],
      },
      {
        id: "st2",
        situation: "Plot twist: earlier today your friend Ava fell for the same email and typed her password. She texts you: “ugh I think I messed up, don’t tell anyone lol.” What should Ava do first?",
        choices: [
          { text: "Change her school password right away from a trusted device by going to the real portal", best: true, feedback: "Yes — speed matters. Then turn on MFA if it isn’t on, and tell IT." },
          { text: "Wait until tomorrow and see if anything happens", feedback: "Attackers often use stolen passwords within minutes." },
          { text: "Delete the email so no one finds out", feedback: "Deleting doesn’t undo anything. The password is already stolen." },
        ],
      },
      {
        id: "st3",
        situation: "Ava changed her password. Now her phone keeps buzzing: “Approve sign-in to Northvale?” She didn’t try to log in. What now?",
        choices: [
          { text: "Deny every prompt and report it to IT", best: true, feedback: "Right. Unexpected prompts mean someone is trying to get in. IT can check for other changes." },
          { text: "Approve one to make the buzzing stop", feedback: "That’s MFA fatigue — approving lets the attacker in." },
          { text: "Turn off her phone for the night", feedback: "Better than approving, but IT needs to know someone is actively attacking her account." },
        ],
      },
      {
        id: "st4",
        situation: "IT fixes things. Ava’s worried about her other accounts. She used the same password for her Pixelgram and Questify accounts. What’s the best advice?",
        choices: [
          { text: "Change those passwords too, make each one unique, and turn on MFA", best: true, feedback: "Exactly. Reused passwords get tried everywhere (credential stuffing). A password manager makes unique ones easy." },
          { text: "Only the school account matters", feedback: "Attackers try stolen passwords on many sites. Every account with that password is at risk." },
          { text: "Add a “1” to the end of each password", feedback: "Attackers try small variations first. Use new, unique passphrases." },
        ],
      },
      {
        id: "st5",
        situation: "Ava asks if she should keep it a secret because she’s embarrassed. What do you tell her?",
        choices: [
          { text: "Reporting fast is the right move — it protects her and everyone else, and it happens to everyone", best: true, feedback: "Yes. Shame keeps people quiet, and silence helps attackers. IT can warn other students too." },
          { text: "Yeah, keep it quiet", feedback: "Hiding it gives attackers more time and leaves other students exposed." },
        ],
      },
    ],
  },
];

export const scenarioById = new Map(scenarios.map((s) => [s.id, s]));
