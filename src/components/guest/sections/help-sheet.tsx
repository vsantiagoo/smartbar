"use client";
import { ArrowLeft, CheckCircle2, LockKeyholeOpen, MessageCircle, PackagePlus, TriangleAlert, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { useGuest } from "@/components/guest/guest-context";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import type { GuestKey } from "@/lib/i18n/guest";
import type { SupportKind } from "@/lib/types";
import { cn } from "@/lib/utils";

const OPTIONS: { kind: SupportKind; icon: LucideIcon; title: GuestKey; text: GuestKey; done: GuestKey }[] = [
  { kind: "restock", icon: PackagePlus, title: "help.restock", text: "help.restock.text", done: "help.done.restock" },
  { kind: "damaged", icon: TriangleAlert, title: "help.damaged", text: "help.damaged.text", done: "help.done.damaged" },
  { kind: "door_problem", icon: LockKeyholeOpen, title: "help.door", text: "help.door.text", done: "help.done.door" },
];

interface HelpSheetProps {
  open: boolean;
  onClose: () => void;
  /** Abre já no formulário desta opção (ex.: "paguei e a trava não destravou"). */
  initialKind?: SupportKind;
  /** Pedido a que o aviso se refere. */
  transactionToken?: string;
}

/**
 * SEÇÃO · Central de ajuda. Reposição, item danificado e "paguei e não abriu"
 * viram um pedido para a governança/recepção; o WhatsApp abre a conversa direta.
 */
export function HelpSheet({ open, onClose, initialKind, transactionToken }: HelpSheetProps) {
  const { t, room } = useGuest();
  const [kind, setKind] = useState<SupportKind | null>(initialKind ?? null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<"done" | "error" | null>(null);
  const current = OPTIONS.find((o) => o.kind === kind);

  function close() {
    onClose();
    setTimeout(() => {
      setKind(initialKind ?? null);
      setNote("");
      setResult(null);
    }, 200);
  }

  async function send() {
    if (!kind) return;
    setBusy(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelId: room.hotelId, roomId: room.roomId, kind, note: note.trim() || undefined, transactionToken }),
      });
      setResult(res.ok ? "done" : "error");
    } catch {
      setResult("error");
    }
    setBusy(false);
  }

  const wa = room.whatsapp ? `https://wa.me/${room.whatsapp}?text=${encodeURIComponent(t("wa.text", { room: room.roomNumber }))}` : null;

  return (
    <Sheet open={open} onClose={close} title={t("help.title")}>
      {result ? (
        <div className="space-y-5 py-4 text-center" role="status">
          <span
            className={cn(
              "mx-auto grid size-16 place-items-center rounded-full",
              result === "done" ? "bg-ok-500/12 text-ok-600" : "bg-crimson-500/10 text-crimson-500",
            )}
          >
            {result === "done" ? <CheckCircle2 className="size-8" /> : <TriangleAlert className="size-8" />}
          </span>
          <p className="text-ink">{result === "done" && current ? t(current.done) : t("help.error")}</p>
          <div className="flex flex-col gap-2">
            {result === "error" && wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-tint inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ok-500/85 px-5 font-semibold text-white"
              >
                <MessageCircle className="size-5" /> {t("help.whatsapp")}
              </a>
            )}
            <Button variant="glass" onClick={close}>
              {t("help.close")}
            </Button>
          </div>
        </div>
      ) : current ? (
        <div className="space-y-4 py-2">
          {!initialKind && (
            <button onClick={() => setKind(null)} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink">
              <ArrowLeft className="size-4" /> {t("help.back")}
            </button>
          )}
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl glass-chip bg-brand-700/10 text-brand-700">
              <current.icon className="size-5" />
            </span>
            <div>
              <p className="font-semibold text-ink">{t(current.title)}</p>
              <p className="text-sm text-ink-soft">{t(current.text)}</p>
            </div>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm text-ink-soft">{t("help.note")}</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={300}
              rows={3}
              className="glass-chip w-full resize-none rounded-2xl bg-white/55 px-4 py-3 text-base text-ink outline-none focus:border-brand-700"
            />
          </label>
          <Button size="lg" className="w-full" loading={busy} onClick={send}>
            {busy ? t("help.sending") : t("help.send")}
          </Button>
        </div>
      ) : (
        <ul className="space-y-2.5 py-2">
          {OPTIONS.map((o) => (
            <li key={o.kind}>
              <button
                onClick={() => setKind(o.kind)}
                className="glass group flex w-full items-center gap-3 rounded-3xl p-3.5 text-left transition hover:bg-white/80 active:scale-[0.99]"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl glass-chip bg-brand-700/10 text-brand-700">
                  <o.icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-ink dark:group-hover:text-[#2D3D34]">{t(o.title)}</span>
                  <span className="block text-sm leading-snug text-ink-soft dark:group-hover:text-[#5B6861]">{t(o.text)}</span>
                </span>
              </button>
            </li>
          ))}
          {wa && (
            <li>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="glass group flex w-full items-center gap-3 rounded-3xl p-3.5 text-left transition hover:bg-white/80 active:scale-[0.99]"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl glass-chip bg-ok-500/12 text-ok-600">
                  <MessageCircle className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-ink dark:group-hover:text-[#2D3D34]">{t("help.whatsapp")}</span>
                  <span className="block text-sm leading-snug text-ink-soft dark:group-hover:text-[#5B6861]">{t("help.whatsapp.text")}</span>
                </span>
              </a>
            </li>
          )}
        </ul>
      )}
    </Sheet>
  );
}
