import * as fs from "fs/promises";
import * as path from "path";
import * as YAML from "yaml";
import { glob } from "glob";

export interface TenantSpec {
  tenant_id: string;
  rut: string;
  display_name: string;
  domain: string;
  services: Record<string, string>;
  plan: {
    code: string;
    limits: Record<string, any>;
  };
  clerk?: {
    features: string[];
  };
  metadata: {
    status: string;
    owner_email: string;
  };
}

export interface WorkflowSpec {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: string;
    on_events?: string[];
  };
  n8n: {
    base_url: string;
    workflow_id: string;
    webhook_path: string;
  };
  inputs: Array<{
    name: string;
    type: string;
    required: boolean;
  }>;
  actions: Array<any>;
}

export interface DeploySpec {
  id: string;
  name: string;
  environment: string;
  provider: string;
  dokploy: {
    base_url: string;
    api_token_env: string;
    project_name: string;
  };
  repository: {
    url: string;
    branch: string;
    auto_deploy: boolean;
  };
  stack: {
    name: string;
    compose_file: string;
    env_file: string;
  };
}

export interface ServiceSpec {
  id: string;
  name: string;
  description: string;
  version: string;
  docker: {
    image: string;
    tag: string;
  };
  deployment: {
    port: number;
    health_check: string;
  };
}

export interface Specs {
  tenants: TenantSpec[];
  services: ServiceSpec[];
  workflows: WorkflowSpec[];
  deploy: DeploySpec[];
}

async function loadYamlFiles(pattern: string): Promise<any[]> {
  const files = await glob(pattern);
  const specs = [];

  for (const file of files) {
    try {
      const content = await fs.readFile(file, "utf-8");
      const spec = YAML.parse(content);
      specs.push(spec);
    } catch (error) {
      console.error(`❌ Error loading ${file}:`, error);
    }
  }

  return specs;
}

export async function loadSpecs(baseDir: string): Promise<Specs> {
  const tenants = await loadYamlFiles(path.join(baseDir, "specs/tenants/*.yml"));
  const services = await loadYamlFiles(path.join(baseDir, "specs/services/*.yml"));
  const workflows = await loadYamlFiles(path.join(baseDir, "specs/workflows/*.yml"));
  const deploy = await loadYamlFiles(path.join(baseDir, "specs/deploy/*.yml"));

  return {
    tenants: tenants as TenantSpec[],
    services: services as ServiceSpec[],
    workflows: workflows as WorkflowSpec[],
    deploy: deploy as DeploySpec[],
  };
}
