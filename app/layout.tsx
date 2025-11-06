import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Arctan",
  description: "Frictionless Gmail triage",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="border-b bg-white">
          <div className="container-max flex items-center justify-between h-14">
            <a className="font-semibold" href="/">Arctan</a>
            <div className="space-x-4 text-sm">
              <a className="text-gray-700 hover:underline" href="/privacy">Privacy</a>
              <a className="text-gray-700 hover:underline" href="/terms">Terms</a>
              <a className="text-blue-600 hover:underline" href="/api/auth/signin">Sign in</a>
            </div>
          </div>
        </nav>
        <main className="container-max py-8">{children}</main>
      </body>
    </html>
  );
}

