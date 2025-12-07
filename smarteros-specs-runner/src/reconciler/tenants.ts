import { TenantSpec } from "../loaders/spec-loader";
import { ApiClient } from "../clients/api-client";
import { N8nClient } from "../clients/n8n-client";

const apiClient = new ApiClient();
const n8nClient = new N8nClient();

export async function reconcileTenants(specs: TenantSpec[]) {
  console.log(`\n📊 Reconciling ${specs.length} tenants...`);

  for (const spec of specs) {
    try {
      await reconcileTenant(spec);
    } catch (error: any) {
      console.error(`❌ Failed to reconcile tenant ${spec.tenant_id}:`, error.message);
    }
  }
}

async function reconcileTenant(spec: TenantSpec) {
  console.log(`\n🏢 Reconciling tenant: ${spec.tenant_id}`);

  // 1. Verificar si existe en API
  const existing = await apiClient.getTenant(spec.tenant_id);

  if (!existing) {
    console.log(`  ➕ Creating new tenant: ${spec.tenant_id}`);
    
    // Crear tenant en API
    await apiClient.createTenant({
      tenant_id: spec.tenant_id,
      rut: spec.rut,
      display_name: spec.display_name,
      domain: spec.domain,
      plan: spec.plan,
      services: spec.services,
      metadata: spec.metadata,
    });

    // Trigger onboarding workflow si está activo
    if (spec.metadata.status === "active") {
      console.log(`  🚀 Triggering onboarding workflow...`);
      try {
        await n8nClient.triggerWebhook("/webhook/onboarding-tenant", {
          tenant_id: spec.tenant_id,
          rut: spec.rut,
          display_name: spec.display_name,
          domain: spec.domain,
          owner_email: spec.metadata.owner_email,
          plan_code: spec.plan.code,
        });
      } catch (error: any) {
        console.error(`  ⚠️  Onboarding workflow failed:`, error.message);
      }
    }

    // Log evento
    await apiClient.logEvent({
      type: "tenant_created",
      tenant_id: spec.tenant_id,
      timestamp: new Date().toISOString(),
      spec: spec,
    });
  } else {
    // Actualizar si cambió
    const hasChanges = JSON.stringify(existing) !== JSON.stringify(spec);
    
    if (hasChanges) {
      console.log(`  🔄 Updating tenant: ${spec.tenant_id}`);
      await apiClient.updateTenant(spec.tenant_id, spec);
      
      await apiClient.logEvent({
        type: "tenant_updated",
        tenant_id: spec.tenant_id,
        timestamp: new Date().toISOString(),
        changes: { from: existing, to: spec },
      });
    } else {
      console.log(`  ✓ No changes for tenant: ${spec.tenant_id}`);
    }
  }

  console.log(`  ✅ Tenant reconciled: ${spec.tenant_id}`);
}
