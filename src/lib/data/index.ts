import "server-only";
import { isSupabaseConfigured } from "@/lib/config";
import { mockRepository } from "@/lib/data/mock/repo";
import type { Repository } from "@/lib/data/repository";
import { createServiceClient, createSessionClient } from "@/lib/data/supabase/clients";
import { SupabaseRepository } from "@/lib/data/supabase/repo";

/** Fluxo do hóspede (anônimo), webhooks e ESP32: usa service_role no servidor. */
export function getGuestRepo(): Repository {
  return isSupabaseConfigured ? new SupabaseRepository(createServiceClient()) : mockRepository;
}

/** Painel da equipe: usa a sessão do usuário — o RLS isola por hotel. */
export async function getAdminRepo(): Promise<Repository> {
  return isSupabaseConfigured ? new SupabaseRepository(await createSessionClient()) : mockRepository;
}

export { DomainError } from "@/lib/data/repository";
export type { Repository } from "@/lib/data/repository";
