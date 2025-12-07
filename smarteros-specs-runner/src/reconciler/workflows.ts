import { WorkflowSpec } from "../loaders/spec-loader";
import { ApiClient } from "../clients/api-client";
import { N8nClient } from "../clients/n8n-client";

const apiClient = new ApiClient();
const n8nClient = new N8nClient();

export async function reconcileWorkflows(specs: WorkflowSpec[]) {
  console.log(`\n⚙️  Reconciling ${specs.length} workflows...`);

  for (const spec of specs) {
    try {
      await reconcileWorkflow(spec);
    } catch (error: any) {
      console.error(`❌ Failed to reconcile workflow ${spec.id}:`, error.message);
    }
  }
}

async function reconcileWorkflow(spec: WorkflowSpec) {
  console.log(`\n🔧 Reconciling workflow: ${spec.id}`);

  // 1. Registrar en API
  try {
    await apiClient.createWorkflow({
      id: spec.id,
      name: spec.name,
      description: spec.description,
      trigger: spec.trigger,
      n8n: spec.n8n,
      inputs: spec.inputs,
      actions_count: spec.actions.length,
    });
  } catch (error: any) {
    console.log(`  ⚠️  Workflow already registered: ${spec.id}`);
  }

  // 2. Verificar estado en n8n
  const n8nStatus = await n8nClient.getWorkflowStatus(spec.n8n.workflow_id);

  if (n8nStatus && !n8nStatus.active) {
    console.log(`  🔄 Activating workflow in n8n: ${spec.n8n.workflow_id}`);
    await n8nClient.activateWorkflow(spec.n8n.workflow_id);
  }

  // 3. Log evento
  await apiClient.logEvent({
    type: "workflow_reconciled",
    workflow_id: spec.id,
    timestamp: new Date().toISOString(),
    n8n_status: n8nStatus?.active ? "active" : "inactive",
  });

  console.log(`  ✅ Workflow reconciled: ${spec.id}`);
}
