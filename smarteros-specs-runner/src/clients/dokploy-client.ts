import axios, { AxiosInstance } from "axios";

export class DokployClient {
  private client: AxiosInstance;

  constructor(baseURL?: string, apiToken?: string) {
    this.client = axios.create({
      baseURL: baseURL || process.env.DOKPLOY_URL || "https://dokploy.smarterbot.cl",
      headers: {
        "Authorization": `Bearer ${apiToken || process.env.DOKPLOY_API_TOKEN || ""}`,
        "Content-Type": "application/json",
      },
      timeout: 60000,
    });
  }

  async deployStack(stackConfig: any) {
    try {
      const response = await this.client.post("/api/v1/stacks/deploy", stackConfig);
      console.log(`✅ Dokploy stack deployed: ${stackConfig.name}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to deploy stack ${stackConfig.name}:`, error.message);
      throw error;
    }
  }

  async updateStack(stackId: string, stackConfig: any) {
    try {
      const response = await this.client.put(
        `/api/v1/stacks/${stackId}`,
        stackConfig
      );
      console.log(`✅ Dokploy stack updated: ${stackId}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to update stack ${stackId}:`, error.message);
      throw error;
    }
  }

  async getStack(stackId: string) {
    try {
      const response = await this.client.get(`/api/v1/stacks/${stackId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async restartStack(stackId: string) {
    try {
      await this.client.post(`/api/v1/stacks/${stackId}/restart`);
      console.log(`✅ Dokploy stack restarted: ${stackId}`);
    } catch (error: any) {
      console.error(`❌ Failed to restart stack ${stackId}:`, error.message);
    }
  }

  async getDeploymentLogs(stackId: string, limit: number = 100) {
    try {
      const response = await this.client.get(
        `/api/v1/stacks/${stackId}/logs`,
        { params: { limit } }
      );
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to get logs:`, error.message);
      return [];
    }
  }

  async triggerWebhook(webhookUrl: string) {
    try {
      await axios.post(webhookUrl);
      console.log(`✅ Dokploy webhook triggered`);
    } catch (error: any) {
      console.error(`❌ Failed to trigger webhook:`, error.message);
    }
  }
}
