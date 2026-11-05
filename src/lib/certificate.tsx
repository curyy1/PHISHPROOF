import "server-only";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { SITE_URL } from "@/lib/env";

export const CERT_ID_RE = /^PP-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O, 1/I ambiguity

/** Random, unguessable verification id like PP-7KQM-X2RD-HN4P (~60 bits). */
export function newCertificateId() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const chars = [...bytes].map((b) => ALPHABET[b % ALPHABET.length]); // 256 % 32 === 0 → unbiased
  return `PP-${chars.slice(0, 4).join("")}-${chars.slice(4, 8).join("")}-${chars.slice(8).join("")}`;
}

export type CertData = { id: string; fullName: string; issuedAt: string; score: number; total: number; sample?: boolean };

const W = 1600;
const H = 1131;

// Inter Tight (SIL Open Font License), bundled so certificates render offline and consistently.
let fontCache: Promise<{ name: string; data: ArrayBuffer; weight: 400 | 700 | 800; style: "normal" }[]> | null = null;
function loadFonts() {
  fontCache ??= Promise.all(
    ([400, 700, 800] as const).map(async (weight) => {
      const buf = await readFile(path.join(process.cwd(), "src/assets/fonts", `inter-tight-latin-${weight}-normal.woff`));
      return { name: "Inter Tight", data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer, weight, style: "normal" as const };
    }),
  );
  return fontCache;
}

export async function certificateImage(c: CertData) {
  const fonts = await loadFonts();
  const date = new Date(c.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const verifyUrl = `${SITE_URL.replace(/^https?:\/\//, "")}/verify/${c.id}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f6f7f9", padding: 40, fontFamily: "Inter Tight" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#ffffff",
            border: "2px solid #dfe2e8",
            borderRadius: 36,
            padding: "70px 90px 60px",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 14, background: "linear-gradient(90deg, #3b5bff, #7c4dff, #d92d20)", borderTopLeftRadius: 36, borderTopRightRadius: 36, display: "flex" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="64" height="64" viewBox="0 0 32 32">
              <path d="M16 2.25 27.25 6.4v8.45c0 7.05-4.7 12.6-11.25 14.9C9.45 27.45 4.75 21.9 4.75 14.85V6.4L16 2.25Z" fill="#4b4fff" />
              <circle cx="17.4" cy="8.6" r="1.55" fill="none" stroke="#fff" strokeWidth="1.6" />
              <path d="M17.4 10.2v7.3a3.55 3.55 0 0 1-7.1 0v-1.9l-1.7 1.7" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m19.6 20.6 1.5 1.5 3-3.4" fill="none" stroke="#9ff2c4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ fontSize: 44, fontWeight: 700, color: "#0b0d12", letterSpacing: -1 }}>Phishproof</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 26, letterSpacing: 6, color: "#2346e8", fontWeight: 700 }}>CERTIFICATE OF COMPLETION</div>
            <div style={{ fontSize: 30, color: "#4b5262", marginTop: 34 }}>This certifies that</div>
            <div style={{ fontSize: 92, fontWeight: 800, color: "#0b0d12", marginTop: 14, letterSpacing: -2, textAlign: "center", maxWidth: 1300 }}>{c.fullName}</div>
            <div style={{ fontSize: 30, color: "#4b5262", marginTop: 26, textAlign: "center", maxWidth: 1100, lineHeight: 1.4 }}>
              {`completed the Phishproof phishing-awareness course and passed the final exam with a score of ${c.score}/${c.total} (${Math.round((c.score / c.total) * 100)}%).`}
            </div>
          </div>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 20, color: "#6b7282" }}>Issued</div>
              <div style={{ fontSize: 30, color: "#0b0d12", fontWeight: 700 }}>{date}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div style={{ fontSize: 20, color: "#6b7282" }}>Verification ID</div>
              <div style={{ fontSize: 30, color: "#0b0d12", fontWeight: 700, letterSpacing: 2 }}>{c.id}</div>
              <div style={{ fontSize: 20, color: "#2346e8", marginTop: 4 }}>{verifyUrl}</div>
            </div>
          </div>
          {c.sample && (
            <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", justifyContent: "center", fontSize: 200, fontWeight: 800, color: "rgba(217,45,32,0.12)", transform: "rotate(-14deg)" }}>
              SAMPLE
            </div>
          )}
        </div>
      </div>
    ),
    { width: W, height: H, fonts, headers: { "Cache-Control": "public, max-age=3600" } },
  );
}

/** Wrap the PNG in a single landscape A4 page. */
export async function certificatePdf(c: CertData): Promise<Uint8Array> {
  const png = new Uint8Array(await (await certificateImage(c)).arrayBuffer());
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Phishproof certificate ${c.id}`);
  pdf.setAuthor("Phishproof");
  pdf.setSubject(`Certificate of completion for ${c.fullName}`);
  const img = await pdf.embedPng(png);
  const page = pdf.addPage([841.89, 595.28]);
  page.drawImage(img, { x: 0, y: 0, width: 841.89, height: 595.28 });
  return pdf.save();
}
