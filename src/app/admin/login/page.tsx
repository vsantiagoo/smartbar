import { LoginForm } from "@/components/admin/sections/login-form";
import { Logo } from "@/components/ui/logo";
import { DEMO_ADMIN, isDemoMode } from "@/lib/config";

export const metadata = { title: "Entrar" };

/** TELA · Login da equipe do hotel → /admin/login */
export default function AdminLoginPage() {
  return (
    <main className="brand-diagonals grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <Logo className="mb-8 justify-center" />
        <div className="glass-strong rounded-[36px] p-7 sm:p-9">
          <h1 className="text-2xl font-bold">Painel do hotel</h1>
          <p className="mt-1.5 text-ink-soft">Acompanhe vendas, estoque e reposição do minibar em tempo real.</p>
          <LoginForm demoEmail={isDemoMode ? DEMO_ADMIN.email : undefined} demoPassword={isDemoMode ? DEMO_ADMIN.password : undefined} />
        </div>
        {isDemoMode && (
          <p className="mt-5 text-center text-xs text-ink-soft">
            Modo demonstração — sem banco conectado. Configure o Supabase em <code className="font-mono">.env.local</code>.
          </p>
        )}
      </div>
    </main>
  );
}
