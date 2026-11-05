import { existsSync } from "node:fs";
import path from "node:path";

export const CREATOR = {
  name: "Srithan Bodla",
  photo: "/creator.jpg", // drop a square-ish photo at public/creator.jpg
  bio: [
    "I’m a student who loves building things with code and teaching others to do the same.",
    "I’m a Lead Sensei at a coding school and president of my school’s TSA (Technology Student Association) chapter.",
    "I built Phishproof because most hacks start with a person, not a computer — and I wanted a free, fun way for my students and chapter members to learn to spot scams. It’s also a cybersecurity project I’m proud of.",
  ],
};

const hasPhoto = existsSync(path.join(process.cwd(), "public", CREATOR.photo));

function Avatar({ size }: { size: number }) {
  return hasPhoto ? (
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
            <div className="mt-3 space-y-2 text-muted">
              {CREATOR.bio.map((p) => (
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
