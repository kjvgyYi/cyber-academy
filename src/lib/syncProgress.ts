import { supabase } from './supabase';
import type { ProgressState } from './progress';
import { sanitize } from './progress';

export const LOCAL_UPDATED_KEY = 'cyber-academy:progress:updated-at';

export async function fetchCloudProgress(
  userId: string,
): Promise<{ data: ProgressState; updatedAt: string } | null> {
  const { data, error } = await supabase
    .from('progress')
    .select('data, updated_at')
    .eq('user_id', userId)
    .single();
  if (error || !data) return null;
  return { data: sanitize(data.data as unknown), updatedAt: data.updated_at as string };
}

export async function uploadProgress(userId: string, state: ProgressState): Promise<void> {
  const now = new Date().toISOString();
  await supabase
    .from('progress')
    .upsert({ user_id: userId, data: state, updated_at: now }, { onConflict: 'user_id' });
  localStorage.setItem(LOCAL_UPDATED_KEY, now);
}

/** Returns cloud data if it's newer than local, otherwise returns local. */
export function mergeProgress(
  local: ProgressState,
  cloud: { data: ProgressState; updatedAt: string },
): ProgressState {
  const localTs = localStorage.getItem(LOCAL_UPDATED_KEY);
  if (!localTs) return cloud.data;
  return new Date(cloud.updatedAt) > new Date(localTs) ? cloud.data : local;
}
