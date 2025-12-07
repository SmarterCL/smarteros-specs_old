import axios, { AxiosInstance } from "axios";

export class N8nClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL = process.env.N8N_API_URL || "https://n8n.smarterbot.cl";
    const apiKey = process.env.N8N_API_KEY || "";

    this.client = axios.create({
      baseURL,
      headers: {
        "X-N8N-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });
  }

  async triggerWorkflow(workflowId: string, payload: any) {
    try {
      const response = await this.client.post(
        `/webhook/${workflowId}`,
        payload
      );
      console.log(`✅ n8n workflow triggered: ${workflowId}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to trigger workflow ${workflowId}:`, error.message);
      throw error;
    }
  }

  async triggerWebhook(webhookPath: string, payload: any) {
    try {
      const response = await this.client.post(webhookPath, payload);
      console.log(`✅ n8n webhook called: ${webhookPath}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to call webhook ${webhookPath}:`, error.message);
      throw error;
    }
  }

  async getWorkflowStatus(workflowId: string) {
    try {
      const response = await this.client.get(`/api/v1/workflows/${workflowId}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to get workflow status:`, error.message);
      return null;
    }
  }

  async activateWorkflow(workflowId: string) {
    try {
      await this.client.patch(`/api/v1/workflows/${workflowId}`, {
        active: true,
      });
      console.log(`✅ Workflow activated: ${workflowId}`);
    } catch (error: any) {
      console.error(`❌ Failed to activate workflow:`, error.message);
    }
  }
}
