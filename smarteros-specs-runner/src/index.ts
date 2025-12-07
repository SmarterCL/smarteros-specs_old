import { loadSpecs } from "./loaders/spec-loader";
import { reconcileTenants } from "./reconciler/tenants";
import { reconcileWorkflows } from "./reconciler/workflows";
import { reconcileDeploy } from "./reconciler/deploy";
import * as chokidar from "chokidar";
import * as path from "path";

const SPECS_DIR = process.env.SPECS_DIR || "/specs";
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || "30000", 10);

async function reconcile() {
  console.log(`[${new Date().toISOString()}] 🔄 Starting reconciliation...`);
  
  try {
    const specs = await loadSpecs(SPECS_DIR);
    
    console.log(`📋 Loaded specs:`, {
      tenants: specs.tenants.length,
      services: specs.services.length,
      workflows: specs.workflows.length,
      deploys: specs.deploy.length,
    });

    await reconcileTenants(specs.tenants);
    await reconcileWorkflows(specs.workflows);
    await reconcileDeploy(specs.deploy);

    console.log(`[${new Date().toISOString()}] ✅ Reconciliation complete\n`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Reconciliation failed:`, error);
  }
}

async function main() {
  console.log("🚀 Smarteros Specs Runner starting...");
  console.log(`📁 Specs directory: ${SPECS_DIR}`);
  console.log(`⏱️  Poll interval: ${POLL_INTERVAL}ms`);

  // Watch mode si está habilitado
  if (process.env.WATCH_MODE === "true") {
    console.log("👀 Watch mode enabled");
    
    const watcher = chokidar.watch(path.join(SPECS_DIR, "specs/**/*.yml"), {
      persistent: true,
      ignoreInitial: true,
    });

    watcher.on("change", (filePath) => {
      console.log(`📝 Spec changed: ${filePath}`);
      reconcile();
    });

    watcher.on("add", (filePath) => {
      console.log(`➕ Spec added: ${filePath}`);
      reconcile();
    });
  }

  // Reconciliación inicial
  await reconcile();

  // Poll periódico
  setInterval(reconcile, POLL_INTERVAL);
}

// Manejo de señales para shutdown graceful
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down...");
  process.exit(0);
});

main().catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});
