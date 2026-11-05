import { NextResponse, type NextRequest } from "next/server";
import { CERT_ID_RE, certificateImage, certificatePdf, type CertData } from "@/lib/certificate";
import { getServerSupabase } from "@/lib/supabase/server";

/** GET /api/certificate/PP-XXXX-XXXX-XXXX?format=png|pdf  (and /api/certificate/sample) */
export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await ctx.params;
  const format = request.nextUrl.searchParams.get("format") === "pdf" ? "pdf" : "png";
  let cert: CertData | null = null;

  if (rawId === "sample") {
    cert = { id: "PP-SAMP-LE23-4567", fullName: "Your Name Here", issuedAt: new Date().toISOString(), score: 18, total: 20, sample: true };
  } else {
    const id = rawId.toUpperCase();
    if (!CERT_ID_RE.test(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const supabase = await getServerSupabase();
    const { data } = supabase ? await supabase.rpc("verify_certificate", { cert_id: id }) : { data: null };
    const row = (data as { id: string; full_name: string; issued_at: string; score: number; total: number }[] | null)?.[0];
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    cert = { id: row.id, fullName: row.full_name, issuedAt: row.issued_at, score: row.score, total: row.total };
  }

  if (format === "pdf") {
    const bytes = await certificatePdf(cert);
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="phishproof-certificate-${cert.id}.pdf"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
  const res = await certificateImage(cert);
  if (request.nextUrl.searchParams.get("download")) res.headers.set("Content-Disposition", `attachment; filename="phishproof-certificate-${cert.id}.png"`);
  return res;
}
