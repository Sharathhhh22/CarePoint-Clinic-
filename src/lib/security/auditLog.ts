import { SupabaseClient } from '@supabase/supabase-js'

export interface AuditLogEntry {
  actorId: string
  action: string
  targetResource: string
  targetId?: string
  details?: Record<string, unknown>
  ipAddress?: string
}

/**
 * Log administrative or sensitive security events for compliance and traceability
 */
export async function logAdminAction(
  supabase: SupabaseClient,
  entry: AuditLogEntry
): Promise<void> {
  const payload = {
    actor_id: entry.actorId,
    action: entry.action,
    target_resource: entry.targetResource,
    target_id: entry.targetId || null,
    details: entry.details || {},
    ip_address: entry.ipAddress || null,
    created_at: new Date().toISOString(),
  }

  try {
    const { error } = await supabase.from('audit_logs').insert([payload])
    if (error) {
      // In development or if table is pending migration, log warning without breaking request
      console.warn('[Audit Log Warning]:', error.message, payload)
    }
  } catch (err) {
    console.warn('[Audit Log Exception]:', err)
  }
}
