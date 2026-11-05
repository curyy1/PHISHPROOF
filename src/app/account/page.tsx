import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { leaveClassAction } from "@/app/actions/account";
import { signOutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { getMyProfile } from "@/lib/auth";
import { getCurrentUser, getServerSupabase } from "@/lib/supabase/server";
import { DeleteAccountForm, JoinClassForm, ProfileForm, TeacherCodeForm } from "./AccountForms";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");
  const profile = (await getMyProfile())!;
  const supabase = (await getServerSupabase())!;
  const { data: memberships } = await supabase
    .from("class_members")
    .select("class_id, joined_at, classes(name)")
    .eq("user_id", user.id);
  const teacherCodeEnabled = (process.env.TEACHER_INVITE_CODE ?? "").length >= 8;

  return (
    <div className="container-prose py-12">
      <h1 className="text-display font-bold">Account</h1>
      <p className="mt-2 text-muted">Signed in as {user.email}</p>

      <section className="card mt-8 p-6 sm:p-8" aria-labelledby="profile-h">
        <h2 id="profile-h" className="text-title font-bold">Profile</h2>
        <div className="mt-5">
          <ProfileForm displayName={profile.display_name} fullName={profile.full_name ?? ""} optIn={profile.leaderboard_opt_in} />
        </div>
      </section>

      <section className="card mt-6 p-6 sm:p-8" aria-labelledby="classes-h">
        <h2 id="classes-h" className="text-title font-bold">Classes</h2>
        <p className="mt-1 text-sm text-muted">Joining a class lets that teacher see your course progress (not your password or email).</p>
        {memberships && memberships.length > 0 && (
          <ul className="mt-4 divide-y divide-line rounded-2xl border border-line">
            {memberships.map((m) => {
              const cls = m.classes as unknown as { name: string } | null;
              return (
                <li key={m.class_id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="font-medium">{cls?.name ?? "Class"}</span>
                  <form action={leaveClassAction}>
                    <input type="hidden" name="classId" value={m.class_id} />
                    <Button type="submit" variant="ghost" size="sm">Leave</Button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
        <div className="mt-5">
          <JoinClassForm />
        </div>
        {profile.role === "student" && teacherCodeEnabled && (
          <details className="mt-6 rounded-2xl bg-sunken p-4">
            <summary className="cursor-pointer text-sm font-semibold">I’m a teacher or club leader</summary>
            <div className="mt-4">
              <TeacherCodeForm />
            </div>
          </details>
        )}
      </section>

      <section className="card mt-6 p-6 sm:p-8" aria-labelledby="session-h">
        <h2 id="session-h" className="text-title font-bold">Session</h2>
        <form action={signOutAction} className="mt-4">
          <Button type="submit" variant="secondary">Sign out</Button>
        </form>
      </section>

      <section className="mt-6 rounded-[var(--radius-card)] border border-danger/40 p-6 sm:p-8" aria-labelledby="danger-h">
        <h2 id="danger-h" className="text-title font-bold text-danger">Delete account</h2>
        <p className="mt-1 text-sm text-muted">This permanently deletes your account, progress, badges and certificate. It can’t be undone.</p>
        <div className="mt-4">
          <DeleteAccountForm />
        </div>
      </section>
    </div>
  );
}
