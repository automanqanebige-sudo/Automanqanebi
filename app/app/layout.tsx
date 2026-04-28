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
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#111",
        }}
      >
        {children}
      </body>
    </html>
  );
}