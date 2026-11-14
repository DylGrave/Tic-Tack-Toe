import type { Metadata } from "next";
import "./globals.css";
import "./game.css";

export const metadata: Metadata = {
  title: "Tic Tac Toe — A little friendly competition",
  icons: { icon: "/icon.svg" },
  description: "A little friendly competition. Play a beautifully simple game of tic-tac-toe with a friend, right here.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
