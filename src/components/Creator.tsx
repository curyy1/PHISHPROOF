import { existsSync } from "node:fs";
import path from "node:path";

export const CREATOR = {
  name: "Srithan Bodla",
  photo: "/creator.jpg", // drop a square-ish photo at public/creator.jpg
  tagline: "I’m 17, and I have a dream: make phishing attacks obsolete.",
  story: [
    "The idea for Phishproof started with a real breach. A nonprofit that handles sensitive information had that data leaked — and it didn’t take a genius hacker breaking through firewalls. It took phishing: one convincing message that got someone to click.",
    "That stuck with me. An organization built to help people lost their trust to a problem that can be prevented. If one email can do that much damage, then teaching people to recognize that email is one of the most powerful defenses there is.",
    "So I built Phishproof: free, hands-on, and simple enough for anyone to learn to stop a phishing attack before it starts.",
  ],
};

const hasPhoto = () => existsSync(path.join(process.cwd(), "public", CREATOR.photo));

function Avatar({ size }: { size: number }) {
  return hasPhoto() ? (
    // eslint-disable-next-line @next/next/no-img-element -- static local photo
    <img
      src={CREATOR.photo}
      alt={`Photo of ${CREATOR.name}`}
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover object-top ring-4 ring-elevated"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-[#7c4dff] font-display font-bold text-white"
      style={{ width: size, height: size, fontSize: size / 3 }}
    >
      SB
    </span>
  );
}

/** "About the creator" section shown at the bottom of the landing page. */
export function AboutCreator() {
  return (
    <section className="pb-24" aria-labelledby="creator-title">
      <div className="container-page">
        <div className="card mx-auto flex max-w-3xl flex-col items-center gap-6 p-8 text-center sm:flex-row sm:items-start sm:p-10 sm:text-left">
          <Avatar size={128} />
          <div>
            <p className="eyebrow">About the creator</p>
            <h2 id="creator-title" className="mt-2 text-title font-bold">
              Hi, I’m {CREATOR.name} 👋
            </h2>
            <p className="mt-2 text-lead font-semibold text-fg">{CREATOR.tagline}</p>
            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-subtle">The story behind Phishproof</h3>
            <div className="mt-2 space-y-3 text-muted">
              {CREATOR.story.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CreatorCredit() {
  return (
    <span className="inline-flex items-center gap-2">
      <Avatar size={24} />
      <span>
        Created by <span className="font-semibold text-fg">{CREATOR.name}</span>
      </span>
    </span>
  );
}
