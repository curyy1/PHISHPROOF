import { ImageResponse } from "next/og";

export const alt = "Phishproof — Don’t take the bait. A free phishing-awareness course.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social share card for links to the site. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg, #07080b 0%, #141a3d 60%, #2a1450 100%)", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <path d="M16 2.25 27.25 6.4v8.45c0 7.05-4.7 12.6-11.25 14.9C9.45 27.45 4.75 21.9 4.75 14.85V6.4L16 2.25Z" fill="#5b6bff" />
            <circle cx="17.4" cy="8.6" r="1.55" fill="none" stroke="#fff" strokeWidth="1.6" />
            <path d="M17.4 10.2v7.3a3.55 3.55 0 0 1-7.1 0v-1.9l-1.7 1.7" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m19.6 20.6 1.5 1.5 3-3.4" fill="none" stroke="#9ff2c4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ fontSize: 40, fontWeight: 700 }}>Phishproof</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>Don’t take the bait.</div>
          <div style={{ fontSize: 34, marginTop: 24, color: "#c7cdf5" }}>A free, interactive phishing-awareness course with realistic simulators.</div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#9aa1b0" }}>
          <span>7 modules</span><span>·</span><span>32-email inbox simulator</span><span>·</span><span>Verifiable certificate</span>
        </div>
      </div>
    ),
    size,
  );
}
