export const metadata = {
  title: "Automanqanebi",
  description: "მანქანების აპი",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka">
      <body>{children}</body>
    </html>
  );
}