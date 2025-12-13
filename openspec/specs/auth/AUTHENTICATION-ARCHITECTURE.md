# SmarterOS Authentication Architecture - Official Specification

Current Architecture Status: APPROVED ✅

The architecture follows the correct platform pattern with clear separation of responsibilities:

- **Flow (app.smarterbot.cl)** → Identity Hub and Portal (not attempting to authenticate services directly)
- **MCP** → Decision Engine (governing access, roles, tenants)
- **n8n** → Orchestration Engine (executing provisioning workflows)
- **Services** → Sovereign systems (Odoo, n8n, Chatwoot maintain autonomy)

## Refined MCP Provision Contract

```yaml
provision:
  service: "odoo|n8n|chatwoot"     # Service type
  tenant_id: string               # Tenant identifier
  user_email: string              # User's email
  role: "admin|user|viewer"       # Desired role
  plan: "trial|starter|pro"       # User's plan
  environment: "demo|prod"        # Environment separation
  idempotency_key: string         # Safe retry mechanism
  metadata: object                # Additional context
```

## Recommended n8n Workflow Structure

`validate_mcp` → `normalize_input` → `lookup_user` → `create_or_update_user` → `assign_role` → `return_access_url`

## Service-specific endpoints

- `/provision/odoo`
- `/provision/n8n`
- `/provision/chatwoot`

Each with the same MCP contract but different implementations.

## UX Flow

1. User clicks "Prepare Access to [Service]"
2. Flow makes webhook to MCP with user context
3. MCP validates permissions against policies
4. n8n provisions user in target service
5. Flow shows "Access Ready" → User clicks "Launch"
6. User accesses service with provisioned credentials

This architecture is inherently scalable, maintains service independence, and avoids the universal login anti-pattern while providing a unified experience through governance rather than forced authentication.

The system is positioned strongly with the right balance of automation and system sovereignty - ready for implementation of the complete provisioning flow.
