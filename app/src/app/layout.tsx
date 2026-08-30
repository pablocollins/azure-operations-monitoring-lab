import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: {
    default: "Azure Ops Control Center",
    template: "%s | Azure Ops Control Center",
  },
  description:
    "Interactive Azure operations, monitoring, troubleshooting and incident response simulator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="min-w-0 flex-1">
            <div className="fade-in">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}