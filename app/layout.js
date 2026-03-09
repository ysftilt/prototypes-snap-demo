/*
 * layout.js — Root Layout
 *
 * This wraps every page in the app. It sets up:
 *   - The <html> and <body> tags
 *   - Global CSS (which includes Tailwind and our design tokens)
 *   - Page metadata (title, description)
 *
 * You rarely need to edit this file.
 */

import "./globals.css";
import { DevTools } from "./dev-tools";

export const metadata = {
  title: "Snap Core Flow",
  description: "A 3-step interaction flow prototype",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NODE_ENV === "development" && <DevTools />}
      </body>
    </html>
  );
}
