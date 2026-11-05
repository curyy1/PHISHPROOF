import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { themeInitScript } from "@/components/ThemeProvider";
import { getMyProfile } from "@/lib/auth";
import { SITE_URL, isSupabaseConfigured } from "@/lib/env";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Phishproof — Learn to spot phishing", template: "%s · Phishproof" },
  description:
    "A free, interactive phishing-awareness course. Practice on realistic (fake) emails, texts and login pages, earn XP, and get a verifiable certificate.",
  applicationName: "Phishproof",
  appleWebApp: { capable: true, title: "Phishproof", statusBarStyle: "default" },
  openGraph: {
    title: "Phishproof — Learn to spot phishing",
    description: "Free interactive phishing-awareness course with simulators, quizzes and certificates.",
    type: "website",
  },
  icons: {
    icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#07080b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const profile = await getMyProfile();
  const navUser = profile ? { displayName: profile.display_name, role: profile.role } : null;

  return (
    <html lang="en" data-theme="light" className={interTight.variable} suppressHydrationWarning>
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers signedIn={!!profile} authEnabled={isSupabaseConfigured}>
          <Nav user={navUser} authEnabled={isSupabaseConfigured} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
