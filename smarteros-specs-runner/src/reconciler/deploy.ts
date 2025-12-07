import { DeploySpec } from "../loaders/spec-loader";
import { ApiClient } from "../clients/api-client";
import { DokployClient } from "../clients/dokploy-client";

const apiClient = new ApiClient();

export async function reconcileDeploy(specs: DeploySpec[]) {
  console.log(`\n🚀 Reconciling ${specs.length} deployments...`);

  for (const spec of specs) {
    try {
      await reconcileDeployment(spec);
    } catch (error: any) {
      console.error(`❌ Failed to reconcile deployment ${spec.id}:`, error.message);
    }
  }
}

async function reconcileDeployment(spec: DeploySpec) {
  console.log(`\n📦 Reconciling deployment: ${spec.id}`);

  // 1. Crear cliente Dokploy con credenciales del spec
  const apiToken = process.env[spec.dokploy.api_token_env];
  if (!apiToken) {
    console.error(`  ❌ Missing API token: ${spec.dokploy.api_token_env}`);
    return;
  }

  const dokployClient = new DokployClient(spec.dokploy.base_url, apiToken);

  // 2. Verificar si el stack existe en Dokploy
  const existingStack = await dokployClient.getStack(spec.stack.name);

  const stackConfig = {
    name: spec.stack.name,
    repository: spec.repository,
    compose_file: spec.stack.compose_file,
    env_file: spec.stack.env_file,
    network: spec.stack.network || "smarteros",
    services: spec.services,
    volumes: spec.volumes,
  };

  if (!existingStack) {
    console.log(`  ➕ Creating new stack in Dokploy: ${spec.stack.name}`);
    await dokployClient.deployStack(stackConfig);

    await apiClient.logEvent({
      type: "deployment_created",
      deployment_id: spec.id,
      environment: spec.environment,
      timestamp: new Date().toISOString(),
    });
  } else {
    // Actualizar si auto_deploy está habilitado
    if (spec.repository.auto_deploy) {
      console.log(`  🔄 Updating stack in Dokploy: ${spec.stack.name}`);
      await dokployClient.updateStack(spec.stack.name, stackConfig);

      await apiClient.logEvent({
        type: "deployment_updated",
        deployment_id: spec.id,
        environment: spec.environment,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.log(`  ✓ Auto-deploy disabled, skipping update`);
    }
  }

  // 3. Registrar en API
  await apiClient.createDeployment({
    id: spec.id,
    name: spec.name,
    environment: spec.environment,
    provider: spec.provider,
    stack_name: spec.stack.name,
    repository: spec.repository,
    last_reconcile: new Date().toISOString(),
  });

  console.log(`  ✅ Deployment reconciled: ${spec.id}`);
}
