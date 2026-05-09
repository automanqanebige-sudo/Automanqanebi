export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Keep locale routes lightweight and let root app layout own html/body.
  return <>{children}</>;
}