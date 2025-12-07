import axios, { AxiosInstance } from "axios";

export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL = process.env.API_URL || "http://api:3000";
    const apiKey = process.env.API_INTERNAL_KEY || "";

    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        "X-Internal-API-Key": apiKey,
      },
      timeout: 10000,
    });
  }

  async syncSpec(spec: any) {
    try {
      const response = await this.client.post("/api/specs/sync", spec);
      return response.data;
    } catch (error: any) {
      console.error("❌ API sync failed:", error.message);
      throw error;
    }
  }

  async createTenant(tenant: any) {
    try {
      const response = await this.client.post("/api/tenants", tenant);
      console.log(`✅ Tenant created: ${tenant.tenant_id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        console.log(`⚠️  Tenant already exists: ${tenant.tenant_id}`);
        return await this.updateTenant(tenant.tenant_id, tenant);
      }
      console.error(`❌ Failed to create tenant ${tenant.tenant_id}:`, error.message);
      throw error;
    }
  }

  async updateTenant(tenantId: string, tenant: any) {
    try {
      const response = await this.client.put(`/api/tenants/${tenantId}`, tenant);
      console.log(`✅ Tenant updated: ${tenantId}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to update tenant ${tenantId}:`, error.message);
      throw error;
    }
  }

  async getTenant(tenantId: string) {
    try {
      const response = await this.client.get(`/api/tenants/${tenantId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createWorkflow(workflow: any) {
    try {
      const response = await this.client.post("/api/workflows", workflow);
      console.log(`✅ Workflow registered: ${workflow.id}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to register workflow ${workflow.id}:`, error.message);
      throw error;
    }
  }

  async createDeployment(deployment: any) {
    try {
      const response = await this.client.post("/api/deployments", deployment);
      console.log(`✅ Deployment registered: ${deployment.id}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to register deployment ${deployment.id}:`, error.message);
      throw error;
    }
  }

  async logEvent(event: any) {
    try {
      await this.client.post("/api/events/spec-applied", event);
    } catch (error: any) {
      console.error("❌ Failed to log event:", error.message);
    }
  }
}
