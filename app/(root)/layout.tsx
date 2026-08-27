import Header from "@/components/ui/shared/header";
import Footer from "@/components/ui/footer";

// Força TODAS as rotas dentro desse layout a serem renderizadas
// dinamicamente (em runtime), nunca no build. Necessário porque o
// <Header /> consulta o banco via Prisma (categorias), que depende
// de DATABASE_URL — variável que só existe quando o app está rodando
// de verdade, não durante o "next build".
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
        <main className="flex-1 wrapper">
            {children}
        </main>
        <Footer />
    </div>
  );
}
