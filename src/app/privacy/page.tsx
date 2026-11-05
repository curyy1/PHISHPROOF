import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Phishproof protects your data",
  description: "What we collect, what we never collect, and the security controls behind Phishproof.",
};

const sections = [
  {
    title: "What we store",
    items: [
      "**Your email address** — to sign you in and reset your password. It’s never shown to other learners or teachers.",
      "**A display name** you choose. It appears on the leaderboard only if you opt in, and to teachers of classes you join.",
      "**Your course progress** — completed lessons, quiz scores, simulator answers, XP, streak days and badges.",
      "**Your full name, only if you claim a certificate** — it’s printed on the certificate and shown on its public verification page.",
    ],
  },
  {
    title: "What we never collect",
    items: [
      "**Passwords you type in the Password Lab.** The strength meter runs entirely in your browser. Nothing you type there is sent to our servers, saved, or logged.",
      "**Anything typed into simulated login pages.** Their fields are disabled and the forms have nowhere to send data.",
      "**Your account password in readable form.** Sign-in is handled by Supabase Auth, which stores only a salted hash.",
      "**Advertising or tracking data.** No ads, no third-party trackers, no selling data. Ever.",
    ],
  },
  {
    title: "How it’s protected",
    items: [
      "**Row Level Security**: the database itself enforces that you can read only your own rows. Teachers can read course progress only for students who joined their class with a code.",
      "**Server-side grading**: quiz and simulator answers are re-graded on the server, and only the server can write progress. That keeps XP, scores and certificates honest.",
      "**Strict security headers**: a per-request Content Security Policy, HSTS, no framing, and no MIME sniffing.",
      "**Validation and rate limiting** on every sign-in, sign-up and form, with parameterized database queries.",
      "**Encryption in transit** (HTTPS everywhere) and at rest by our database provider.",
    ],
  },
  {
    title: "Your choices",
    items: [
      "Turn the leaderboard on or off anytime in **Account settings**.",
      "Leave a class anytime — the teacher immediately loses access to your progress.",
      "**Delete your account** from Account settings. It permanently removes your profile, progress, badges and certificate.",
      "Guest mode keeps progress only in your browser’s local storage until you choose to create an account.",
    ],
  },
  {
    title: "About the simulations",
    items: [
      "Every brand in Phishproof (Lumen Bank, Parcelo, StreamBox, Shopora…) is fictional.",
      "Every link uses reserved example domains (like `.example` and `.test`) or documentation IP ranges that can’t belong to a real site.",
      "Links in simulations never navigate anywhere. Every simulated scam is clearly labeled **Training simulation**.",
    ],
  },
];

function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((p, i) =>
        p.startsWith("**") ? (
          <strong key={i} className="font-semibold text-fg">{p.slice(2, -2)}</strong>
        ) : p.startsWith("`") ? (
          <code key={i} className="rounded bg-sunken px-1 font-mono text-[0.9em]">{p.slice(1, -1)}</code>
        ) : (
          p
        ),
      )}
    </>
  );
}

export default function PrivacyPage() {
  return (
    <div className="container-prose py-14 sm:py-20">
      <p className="eyebrow">Privacy & security</p>
      <h1 className="mt-3 text-display font-bold">How Phishproof protects your data</h1>
      <p className="mt-4 text-lead text-muted">
        A security course should practice what it teaches. Here’s exactly what we collect, what we don’t, and how it’s protected — in plain language.
      </p>
      <div className="mt-12 space-y-10">
        {sections.map((s) => (
          <section key={s.title} aria-labelledby={s.title}>
            <h2 id={s.title} className="text-title font-bold">{s.title}</h2>
            <ul className="mt-4 space-y-3">
              {s.items.map((it, i) => (
                <li key={i} className="flex gap-3 text-muted">
                  <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span><Rich text={it} /></span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-12 rounded-2xl bg-sunken p-5 text-sm text-muted">
        Under 13? Please use Phishproof with a parent, guardian or teacher. Questions or a security concern? Contact the person who runs this Phishproof site.
        Found a vulnerability? Please report it responsibly to them rather than testing it on other people’s accounts. Learn more in the <Link href="/learn" className="text-brand underline">course</Link>.
      </p>
    </div>
  );
}
