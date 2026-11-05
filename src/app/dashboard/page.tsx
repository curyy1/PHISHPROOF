import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { getMyProfile } from "@/lib/auth";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const profile = await getMyProfile();
  return (
    <div className="container-page py-12 sm:py-16">
      <Dashboard displayName={profile?.display_name ?? null} />
    </div>
  );
}
