"use client";
import { Send, Sparkles } from "lucide-react";
import { useGuest } from "@/components/guest/guest-context";
import { Sheet } from "@/components/ui/sheet";

/**
 * SEÇÃO · Assistente virtual do hóspede. Por enquanto é a porta de entrada
 * (apresentação + campo desativado); a resposta automática por IA entra depois.
 */
export function AssistantSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useGuest();
  return (
    <Sheet open={open} onClose={onClose} title={t("guest.assistant.title")}>
      <div className="space-y-5 py-2">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl glass-chip bg-brand-700/10 text-brand-700 dark:bg-white/10 dark:text-white">
            <Sparkles className="size-5" />
          </span>
          <p className="text-sm leading-snug text-ink-soft">{t("guest.assistant.intro")}</p>
        </div>

        <div className="rounded-3xl border border-dashed border-brand-700/20 bg-brand-700/5 p-4 text-center dark:border-white/15 dark:bg-white/5">
          <p className="text-sm font-medium text-ink-soft">{t("guest.assistant.soon")}</p>
        </div>

        <div className="flex items-center gap-2 opacity-60">
          <input
            disabled
            placeholder={t("guest.assistant.placeholder")}
            className="glass-chip h-11 w-full rounded-full bg-white/55 px-4 text-sm text-ink outline-none dark:bg-white/10"
          />
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-700/85 text-white">
            <Send className="size-4" />
          </span>
        </div>
      </div>
    </Sheet>
  );
}
