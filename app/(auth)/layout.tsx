export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-muted/30 px-4 py-8">
      {/* Background decorations */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 w-full">{children}</div>
    </main>
  );
}