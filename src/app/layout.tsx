import type { Metadata, Viewport } from "next";
import { Nanum_Myeongjo } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import { ProfileManager } from "@/components/profile-manager";
import "./globals.css";

const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nanum-myeongjo",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FDFBF7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Our 1st Anniversary",
  description: "A digital memory book for us.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "우리의 1주년",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nanumMyeongjo.variable}>
      <body className="antialiased bg-[#FDFBF7] text-[#2C2C2C]">
        <AuthProvider>
          <ProfileManager>
            {children}
          </ProfileManager>
        </AuthProvider>
      </body>
    </html>
  );
}
