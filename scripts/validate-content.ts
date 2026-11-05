/**
 * Validates all course content. Run: npm run validate:content
 * Also imported by unit tests so CI fails on bad content.
 */
import { browserPages, emails, examQuestions, modules, scenarios, smsItems, urlItems } from "../src/content";
import type { Block, Segment } from "../src/content/types";

const RESERVED_SUFFIXES = [".example", ".test", ".invalid", ".localhost", "example.com", "example.net", "example.org"];
const DOC_IP = /^(192\.0\.2|198\.51\.100|203\.0\.113)\.\d{1,3}$/;
// Hostname-like tokens: something.something with a letter TLD, or an IPv4 address.
const HOST_RE = /\b((?:[a-z0-9Ѐ-ӿ-]+\.)+[a-zЀ-ӿ]{2,}|\d{1,3}(?:\.\d{1,3}){3})\b/gi;
const FILE_EXT = /\.(pdf|docx?|xlsx?|html?|zip|exe|scr|js|bat|msi|iso|php)$/i;

export function isReservedHost(host: string) {
  const h = host.toLowerCase();
  if (DOC_IP.test(h)) return true;
  return RESERVED_SUFFIXES.some((s) => h === s.replace(/^\./, "") || h.endsWith(s));
}

export function findUnsafeHosts(text: string): string[] {
  const bad: string[] = [];
  // Ignore the local part of email addresses (name@) and social @handles — they aren't hosts.
  const cleaned = text.replace(/[\w.+-]+@(?=[\w\u0400-\u04ff-])/g, "@").replace(/(^|[\s(])@[\w.]+/g, "$1");
  for (const m of cleaned.matchAll(HOST_RE)) {
    const host = m[1];
    if (FILE_EXT.test(host)) continue; // file names like invoice.pdf
    if (/^\d+\.\d+$/.test(host)) continue; // prices like 4.95
    if (!/[a-z]/i.test(host) && !/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) continue;
    if (!isReservedHost(host)) bad.push(host);
  }
  return bad;
}

const segText = (s: Segment) => (typeof s === "string" ? s : `${s.t} ${s.href ?? ""}`);

export function validateContent(): string[] {
  const errors: string[] = [];
  const err = (m: string) => errors.push(m);
  const seen = new Set<string>();
  const unique = (id: string, where: string) => {
    if (seen.has(id)) err(`Duplicate id "${id}" (${where})`);
    seen.add(id);
  };
  const checkHosts = (text: string, where: string) => {
    for (const h of findUnsafeHosts(text)) err(`${where}: non-reserved host "${h}" in simulated content`);
  };

  // Modules, lessons, quizzes
  modules.forEach((m, i) => {
    unique(`module:${m.id}`, "module");
    if (m.number !== i + 1) err(`Module ${m.id} has number ${m.number}, expected ${i + 1}`);
    if (m.lessons.length < 3 || m.lessons.length > 5) err(`Module ${m.id} must have 3–5 lessons (has ${m.lessons.length})`);
    if (m.quiz.length < 5) err(`Module ${m.id} quiz needs at least 5 questions`);
    for (const l of m.lessons) {
      unique(`lesson:${l.id}`, m.id);
      for (const b of l.blocks) checkBlock(b, `${m.id}/${l.id}`);
    }
    for (const q of m.quiz) {
      unique(`q:${q.id}`, m.id);
      const correct = q.options.filter((o) => o.correct).length;
      if (correct !== 1) err(`Question ${q.id} must have exactly one correct option (has ${correct})`);
      if (q.exhibit) checkBlock(q.exhibit, q.id);
    }
    // drill references
    const r = m.drill.ref;
    const ids = "itemIds" in r ? r.itemIds : [];
    const pool =
      r.kind === "inbox" ? emails : r.kind === "sms" ? smsItems : r.kind === "browser" ? browserPages : r.kind === "urls" ? urlItems : [];
    for (const id of ids) if (!pool.some((x) => x.id === id)) err(`Module ${m.id} drill references unknown ${r.kind} item ${id}`);
    if (r.kind === "scenario" && !scenarios.some((s) => s.id === r.scenarioId)) err(`Unknown scenario ${r.scenarioId}`);
  });

  function checkBlock(b: Block, where: string) {
    if (b.type === "check" && b.options.filter((o) => o.correct).length !== 1) err(`${where}: knowledge check needs exactly one correct option`);
    if (b.type === "message") checkHosts([b.from, b.subject ?? "", ...b.body].join(" "), where);
    if (b.type === "url") checkHosts(b.parts.map((p) => p.text).join(""), where);
  }

  // Exam
  if (examQuestions.length < 20) err("Final exam needs at least 20 questions");
  for (const q of examQuestions) {
    unique(`q:${q.id}`, "exam");
    if (q.options.filter((o) => o.correct).length !== 1) err(`Exam question ${q.id} needs exactly one correct option`);
    if (!modules.some((m) => m.id === q.moduleId)) err(`Exam question ${q.id} has unknown moduleId`);
    if (q.exhibit) checkBlock(q.exhibit, q.id);
  }

  // Emails
  if (emails.length < 30) err(`Need at least 30 emails (have ${emails.length})`);
  const legitShare = emails.filter((e) => !e.isPhish).length / emails.length;
  if (legitShare < 0.35 || legitShare > 0.45) err(`Legit email share should be ~40% (is ${(legitShare * 100).toFixed(0)}%)`);
  for (const d of ["easy", "medium", "hard"] as const) if (!emails.some((e) => e.difficulty === d)) err(`No ${d} emails`);
  for (const e of emails) {
    unique(`email:${e.id}`, "emails");
    const refs = [e.from.hs, e.replyTo?.hs, e.subject.hs, ...(e.attachments ?? []).map((a) => a.hs)];
    const clickIds = new Set<string>();
    for (const para of e.body)
      for (const s of para)
        if (typeof s !== "string") {
          if (clickIds.has(s.id)) err(`Email ${e.id}: duplicate segment id ${s.id}`);
          clickIds.add(s.id);
          refs.push(s.hs);
        }
    checkSimItem(e.id, e.isPhish, e.hotspots, refs);
    checkHosts([e.from.address, e.replyTo?.address ?? "", e.to, e.subject.text, ...e.body.flat().map(segText)].join(" "), `Email ${e.id}`);
  }

  // SMS
  for (const s of smsItems) {
    unique(`sms:${s.id}`, "sms");
    const refs: (string | undefined)[] = [s.contact.hs];
    for (const m of s.messages) {
      for (const seg of m.body) if (typeof seg !== "string") refs.push(seg.hs);
      if (m.image) refs.push(m.image.hs);
      checkHosts([...m.body.map(segText), m.image?.decoded ?? ""].join(" "), `SMS ${s.id}`);
    }
    checkSimItem(s.id, s.isPhish, s.hotspots, refs);
  }

  // Browser pages
  for (const b of browserPages) {
    unique(`browser:${b.id}`, "browser");
    checkSimItem(b.id, b.isPhish, b.hotspots, b.url.parts.map((p) => p.hs));
    const host = b.url.parts.map((p) => p.t).join("").split("/")[0];
    if (!isReservedHost(host)) err(`Browser ${b.id}: host ${host} is not reserved`);
  }

  // URLs
  for (const u of urlItems) {
    unique(`url:${u.id}`, "urls");
    checkHosts(u.url, `URL ${u.id}`);
    if (u.safe !== (u.type === "safe")) err(`URL ${u.id}: safe flag and type disagree`);
  }

  // Scenarios
  for (const sc of scenarios)
    for (const st of sc.steps) if (st.choices.filter((c) => c.best).length !== 1) err(`Scenario ${sc.id}/${st.id} needs exactly one best choice`);

  function checkSimItem(id: string, isPhish: boolean, hotspots: { id: string }[], refs: (string | undefined)[]) {
    const hsIds = new Set(hotspots.map((h) => h.id));
    if (isPhish && hotspots.length === 0) err(`${id}: phishing item has no hotspots`);
    if (!isPhish && hotspots.length > 0) err(`${id}: legit item should not have hotspots`);
    const used = new Set(refs.filter(Boolean) as string[]);
    for (const r of used) if (!hsIds.has(r)) err(`${id}: references unknown hotspot ${r}`);
    for (const h of hsIds) if (!used.has(h)) err(`${id}: hotspot ${h} is not attached to any clickable element`);
  }

  return errors;
}

// CLI
if (process.argv[1]?.includes("validate-content")) {
  const errors = validateContent();
  if (errors.length) {
    console.error(`✗ ${errors.length} content problem(s):\n` + errors.map((e) => "  - " + e).join("\n"));
    process.exit(1);
  }
  console.log(
    `✓ Content OK: ${modules.length} modules, ${modules.reduce((n, m) => n + m.lessons.length, 0)} lessons, ${emails.length} emails, ${smsItems.length} texts, ${browserPages.length} login pages, ${urlItems.length} URLs, ${examQuestions.length} exam questions`,
  );
}
