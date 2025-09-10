// scripts/export-sanity-data.js

import { createClient } from "@sanity/client";
import exportDataset from "@sanity/export";

async function runExport() {
  // Arguments are passed from the parent process
  const [projectId, dataset, token] = process.argv.slice(2);

  if (!projectId || !dataset || !token) {
    console.error("❌ Missing arguments: <projectId> <dataset> <token>");
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: "2025-01-01",
  });

  try {
    await exportDataset({
      client,
      dataset,
      // Pipe the output directly to stdout
      outputPath: "-",
    });
  } catch (err) {
    console.error("❌ Export failed:", err);
    process.exit(1);
  }
}

runExport();