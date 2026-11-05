"use client";

import { Button } from "@/components/ui/Button";

type Row = { name: string; overall: number; modulesDone: number; quizzesPassed: number; drillAccuracy: number | null; xp: number; streak: number; lastActive: string | null; passed: boolean; certificate: string | null };

/** CSV export built in the browser from the roster already on the page. */
export function RosterExport({ className, rows }: { className: string; rows: Row[] }) {
  function download() {
    const esc = (v: unknown) => {
      let s = String(v ?? "");
      if (/^[=+\-@]/.test(s)) s = `'${s}`; // prevent spreadsheet formula injection
      return `"${s.replace(/"/g, '""')}"`;
    };
    const header = ["Student", "Progress %", "Modules complete", "Quizzes passed", "Drill accuracy %", "XP", "Streak", "Last active", "Passed exam", "Certificate ID"];
    const lines = rows.map((r) => [r.name, r.overall, r.modulesDone, r.quizzesPassed, r.drillAccuracy ?? "", r.xp, r.streak, r.lastActive ?? "", r.passed ? "yes" : "no", r.certificate ?? ""].map(esc).join(","));
    const blob = new Blob([[header.map(esc).join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${className.replace(/[^\w-]+/g, "_")}_progress.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  return (
    <Button variant="secondary" onClick={download} disabled={rows.length === 0}>
      Export CSV
    </Button>
  );
}
