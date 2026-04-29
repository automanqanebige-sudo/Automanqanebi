import "./globals.css"; // ეს უნდა იყოს პირველი!
import Navbar from "../components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
