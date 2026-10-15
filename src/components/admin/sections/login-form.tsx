"use client";
import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/client";

/** SEÇÃO · Formulário de login (Server Action). */
export function LoginForm({ demoEmail, demoPassword }: { demoEmail?: string; demoPassword?: string }) {
  const { t } = useI18n();
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, { error: null });
  return (
    <form action={action} className="mt-7 space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">{t("admin.login.email")}</span>
        <Input name="email" type="email" autoComplete="username" required defaultValue={demoEmail} placeholder="voce@hotel.com.br" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">{t("admin.login.password")}</span>
        <Input name="password" type="password" autoComplete="current-password" required defaultValue={demoPassword} placeholder="••••••••" />
      </label>
      {state.error && (
        <p role="alert" className="rounded-2xl bg-crimson-500/10 px-4 py-2.5 text-sm font-medium text-crimson-600">
          {t(state.error)}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" loading={pending}>
        {t("admin.login.submit")}
      </Button>
    </form>
  );
}
