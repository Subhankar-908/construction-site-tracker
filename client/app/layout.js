import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata = { title: "Construction Site Tracker" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
