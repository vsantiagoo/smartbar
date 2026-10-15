"use client";
import { ArrowLeft, BedDouble, Lock, LockOpen, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { formatDateTime, timeAgo } from "@/lib/utils";
import type { RoomDetail } from "@/lib/types";
import { useI18n } from "@/lib/i18n/client";

/** SEÇÃO · Cabeçalho do quarto: hóspede, estadia e estado do hardware. */
export function RoomHeader({ detail }: { detail: RoomDetail }) {
  const { t } = useI18n();
  const { room, stay } = detail;
  return (
    <div>
      <Link href="/admin/quartos" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink">
        <ArrowLeft className="size-4" /> Quartos
      </Link>
      <GlassCard pad="lg" className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <span className="grid size-16 place-items-center rounded-3xl bg-brand-700 text-white shadow-press">
            <BedDouble className="size-8" />
          </span>
          <div>
            <h1 className="text-3xl font-bold leading-none">{t("admin.room.number", { number: room.number })}</h1>
            <p className="mt-2 text-ink-soft">
              {stay ? (
                <>
                  <span className="font-semibold text-ink">{stay.guestName}</span> · {t("admin.room.checkIn", { date: formatDateTime(stay.checkInAt) })}
                </>
              ) : (
                t("admin.room.noStay")
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={room.deviceOnline ? "ok" : "danger"} dot pulse={room.deviceOnline}>
            {room.deviceOnline ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
            {room.deviceOnline ? t("admin.room.lockOnline") : `${t("admin.room.noSignal")}${room.deviceLastSeenAt ? ` ${timeAgo(room.deviceLastSeenAt)}` : ""}`}
          </Badge>
          <Badge tone={room.lockState === "unlocked" ? "warn" : "neutral"}>
            {room.lockState === "unlocked" ? <LockOpen className="size-3.5" /> : <Lock className="size-3.5" />}
            {room.lockState === "unlocked" ? t("admin.room.openNow") : t("admin.room.locked")}
          </Badge>
          {room.deviceId && <Badge tone="neutral">{room.deviceId}</Badge>}
        </div>
      </GlassCard>
    </div>
  );
}
