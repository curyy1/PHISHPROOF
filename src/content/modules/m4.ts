import type { Module } from "../types";

export const m4: Module = {
  id: "beyond-email",
  number: 4,
  title: "Texts, calls, QR codes & DMs",
  tagline: "Phishing followed you to your phone.",
  description:
    "Smishing, vishing, AI voice clones, QR-code phishing and social media scams — and why phone-based attacks often work better than email.",
  icon: "📱",
  lessons: [
    {
      id: "smishing",
      title: "Smishing: phishing by text",
      summary: "Delivery fees, toll bills, bank alerts, and “wrong number” openers.",
      minutes: 5,
      blocks: [
        {
          type: "p",
          text: "**Smishing** is phishing by SMS or chat message. Texts feel personal and urgent, phones hide full link addresses, and we’re used to tapping quickly. That makes texts a favorite for scammers.",
        },
        { type: "h", text: "The greatest hits" },
        {
          type: "list",
          items: [
            "**Delivery problem:** “Your package is on hold. Pay a $1.99 redelivery fee.”",
            "**Unpaid toll or parking:** “Final notice: pay your toll balance today to avoid a fine.”",
            "**Bank fraud alert:** “Did you try to spend $480? Reply NO to cancel” — then a “bank agent” calls you.",
            "**Account codes:** “We sent you a code by mistake, can you send it back?” (It’s a code to take over *your* account.)",
            "**Wrong number:** “Hi Sam, are we still on for dinner?” A friendly chat that slowly turns into an investment or crypto scam.",
            "**Job offers:** “Earn $500/day working from home, just reply!”",
          ],
        },
        {
          type: "message",
          kind: "sms",
          from: "+1 (555) 014-2290",
          body: ["Parcelo: Your parcel is held at our depot due to an incomplete address. Update within 12h: https://parcelo-redelivery.test/p/8812"],
          note: "Unknown number, urgency, and a domain that isn’t Parcelo’s real one (parcelo.example).",
          verdict: "phish",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Report it (US)",
          text: "Forward scam texts to **7726** (spells SPAM) — it’s free and helps carriers block the sender. Then delete the message. Don’t reply, even with STOP, to a number you don’t recognize.",
        },
      ],
      takeaways: [
        "Texts are short, personal, and urgent — perfect for scams.",
        "Delivery, toll, bank-alert, code, and “wrong number” texts are common lures.",
        "Never share a code someone texts you; forward scam texts to 7726.",
      ],
    },
    {
      id: "vishing-and-voice-clones",
      title: "Vishing and AI voice clones",
      summary: "A live voice adds pressure — and voices can now be faked.",
      minutes: 6,
      blocks: [
        {
          type: "p",
          text: "**Vishing** is voice phishing: a phone call or voicemail from someone pretending to be your bank, the IRS, tech support, a school official, or a relative in trouble.",
        },
        {
          type: "callout",
          tone: "fact",
          title: "Why calls work so well",
          text: "Security researchers consistently find that phone-based attacks succeed **more often** than email alone. A real-time conversation builds trust fast, adds social pressure, and doesn’t give you time to check anything.",
        },
        { type: "h", text: "Tricks you’ll hear" },
        {
          type: "list",
          items: [
            "**Caller ID spoofing:** the screen can show any name or number — even your bank’s real number.",
            "**“Fraud department” calls:** “We’ve blocked a suspicious charge. To confirm you’re the owner, read me the code we just sent.”",
            "**Tech support:** “Your computer has a virus. Install this app so I can fix it.”",
            "**Callback phishing:** an email says you were charged $399 and to “call this number to cancel.” The number goes to the scammer.",
            "**Family emergency:** “Grandma, it’s me. I’m in trouble, please don’t tell Mom, I need money for bail.”",
          ],
        },
        { type: "h", text: "AI voice clones" },
        {
          type: "p",
          text: "AI tools can copy someone’s voice from just a short audio clip — like a video posted online. Scammers use cloned voices of family members, coaches, or bosses to make emergency calls sound real.",
        },
        {
          type: "steps",
          items: [
            { title: "Hang up and call back", text: "Use a number you already have saved, or the one on the back of your card — never the number the caller gives you." },
            { title: "Create a family safe word", text: "Pick a secret word only your family knows. If “your cousin” calls in a panic, ask for it." },
            { title: "Ask something only they’d know", text: "Not something on social media — something personal." },
            { title: "Never give codes or remote access", text: "No real support agent needs your one-time code or control of your device." },
          ],
        },
      ],
      takeaways: [
        "Phone-based attacks often succeed more than email — pressure works.",
        "Caller ID can be faked. Hang up and call back on a number you trust.",
        "AI can clone voices. Use a family safe word.",
      ],
    },
    {
      id: "quishing",
      title: "QR-code phishing (quishing)",
      summary: "A QR code is just a link you can’t read.",
      minutes: 4,
      blocks: [
        {
          type: "p",
          text: "A QR code is a link in picture form. You can’t see where it goes until you scan it — which is exactly why scammers love them. This is called **quishing**.",
        },
        { type: "h", text: "Where you’ll see them" },
        {
          type: "list",
          items: [
            "**Stickers on parking meters, posters, or menus** placed over the real code, leading to fake payment pages.",
            "**Emails** saying “Scan to set up multi-factor authentication” or “Scan to view your document.” This moves you from a protected school laptop to your phone, where security filters may not check the link.",
            "**Packages or letters** with a code to “confirm delivery” or “claim a refund.”",
          ],
        },
        {
          type: "steps",
          items: [
            { title: "Read the preview", text: "Your camera shows the address before opening it. Apply everything from Module 3." },
            { title: "Check for stickers", text: "On physical signs, look for a code stuck on top of another one." },
            { title: "Don’t log in from a QR code", text: "If a code takes you to a login page, close it and go to the app or website directly." },
            { title: "Pay through the official app", text: "For parking and tolls, use the official app or a website you type yourself." },
          ],
        },
        {
          type: "check",
          question: "An email from “IT Security” says your account will be locked unless you scan a QR code to re-verify. What do you do?",
          options: [
            { text: "Scan it with your phone — phones are safer", why: "Moving to your phone may bypass your school’s email link protections. That’s the point of the trick." },
            { text: "Don’t scan. Report it to IT and check your account by going direct", correct: true, why: "Yes. Urgency + login + QR code is a classic quishing combo." },
            { text: "Scan it but don’t type anything", why: "Even opening a malicious page can be risky. There’s no reason to scan it." },
          ],
        },
      ],
      takeaways: [
        "A QR code is just a hidden link — check the preview.",
        "Watch for stickers over real codes on signs and meters.",
        "Never log in or pay through a QR code from an unexpected message.",
      ],
    },
    {
      id: "social-media-dms",
      title: "Social media & gaming DMs",
      summary: "Hacked friends, fake giveaways, and “support” accounts.",
      minutes: 5,
      blocks: [
        {
          type: "p",
          text: "DMs on social media, chat, and gaming platforms are phishing’s newest home. You trust the people you follow, and platforms make it easy to tap a link mid-conversation.",
        },
        {
          type: "list",
          items: [
            "**Hacked friend accounts:** “Can you vote for me in this contest?” → a fake login page that steals *your* account next.",
            "**Giveaways and free currency:** “Free 10,000 coins / skins — just log in here.”",
            "**Fake support or verification:** “Your account violated copyright and will be deleted in 24h. Appeal here.” Real platforms handle this inside the app, not via random DMs.",
            "**“Send the code” trick:** “I’m locked out, I’m sending a code to your phone, can you send it to me?” That code resets *your* account.",
            "**Too-good deals:** cheap concert tickets, sneakers, or game items paid for with gift cards or crypto.",
          ],
        },
        {
          type: "message",
          kind: "dm",
          from: "@jaylen.hoops (friend)",
          body: ["yo can u vote for my cousin real quick?? she’s in a scholarship contest 🙏 log in here so it counts: pixelgram.example.vote-now.test"],
          note: "A friend’s account (likely hacked), a favor, and a login link on someone else’s domain (vote-now.test).",
          verdict: "phish",
        },
        {
          type: "callout",
          tone: "warning",
          title: "If someone threatens you",
          text: "If anyone online threatens to share private photos or information unless you pay or send more, **it is not your fault**. Don’t pay and don’t send anything. Save the messages, block them, and tell a trusted adult. In the US you can report it to the NCMEC CyberTipline, and the free *Take It Down* service can help remove images.",
        },
      ],
      takeaways: [
        "A message from a friend’s account isn’t proof it’s your friend.",
        "Real platforms don’t DM you login links to appeal or verify.",
        "Never send someone a code that was sent to your phone.",
      ],
    },
  ],
  drill: {
    title: "Phone check",
    description: "Texts, DMs and voicemails on a simulated phone. Tap anything suspicious, then decide.",
    ref: { kind: "sms", itemIds: ["s01", "s02", "s03", "s04", "s05", "s06", "s07", "s08"] },
  },
  quiz: [
    {
      id: "m4q1",
      prompt: "Your phone shows a call from your bank’s real phone number. The caller asks you to read back a code they just texted you. What’s going on?",
      options: [
        { text: "It’s safe — the caller ID shows the real number", why: "Caller ID can be spoofed to show any number." },
        { text: "It’s likely a scam — real banks never ask for your one-time code", correct: true, why: "Right. Hang up and call the number on the back of your card." },
        { text: "It’s safe if they know your name", why: "Names and other details are easy to find or buy." },
      ],
    },
    {
      id: "m4q2",
      prompt: "Why are phone-based attacks often more successful than email phishing?",
      options: [
        { text: "Phone calls can’t be faked", why: "They can — caller ID spoofing and AI voice clones are common." },
        { text: "Live conversation builds trust and pressure quickly, leaving no time to check", correct: true, why: "Exactly. That’s why “hang up and call back” is so powerful." },
        { text: "Phones have no security features", why: "Phones have plenty — the attack targets the person, not the device." },
      ],
    },
    {
      id: "m4q3",
      prompt: "A relative calls in a panic asking for money, and their voice sounds exactly right. What’s the best way to check it’s really them?",
      options: [
        { text: "Ask for your family’s safe word, or hang up and call them back on their saved number", correct: true, why: "AI can clone voices from short clips. A safe word or a callback beats your ears." },
        { text: "Their voice sounds right, so it must be them", why: "Voice cloning makes this unreliable now." },
        { text: "Ask them what school they went to", why: "That’s often public on social media. Use a safe word or call back." },
      ],
    },
    {
      id: "m4q4",
      prompt: "You find a QR code sticker on a parking meter. What should you check?",
      options: [
        { text: "Whether it’s stuck on top of another code, and what address the preview shows", correct: true, why: "Fake stickers over real codes are a common quishing trick." },
        { text: "Nothing — QR codes on official meters are always safe", why: "Anyone can put a sticker on a meter." },
        { text: "Whether the QR code is in color", why: "Color tells you nothing about where it goes." },
      ],
    },
    {
      id: "m4q5",
      prompt: "A friend DMs: “I got locked out, I’m sending a code to your phone — can you send it to me?” What do you do?",
      options: [
        { text: "Send it — they’re your friend", why: "That code is almost certainly for *your* account. Sending it gives them control." },
        { text: "Don’t send it, and check with your friend another way (call or in person)", correct: true, why: "Yes. Their account may be hacked, and the attacker is now after yours." },
        { text: "Send only half the code", why: "Don’t send any of it." },
      ],
    },
    {
      id: "m4q6",
      prompt: "What’s the best way to report a scam text in the US?",
      options: [
        { text: "Reply STOP", why: "Replying confirms your number is active. Forward it instead." },
        { text: "Forward it to 7726 (SPAM), then delete it", correct: true, why: "That helps carriers block the sender." },
        { text: "Click the link to see if it’s real", why: "Never click to test. Report and delete." },
      ],
    },
  ],
};
