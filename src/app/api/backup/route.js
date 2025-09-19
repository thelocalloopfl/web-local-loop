// src/app/api/backup/route.js

import { PassThrough, Readable } from "node:stream";
import { spawn } from "node:child_process";

// Force the Node.js runtime environment for this API route
export const runtime = "nodejs";

// Avoid static optimization and ensure the function runs on every request
export const dynamic = "force-dynamic";

export async function GET() {

  // Get environment variables for Sanity configuration
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  const token = process.env.SANITY_READ_API_TOKEN;

  // Check if required environment variables are set
  if (!projectId || !dataset || !token) {
    return new Response("❌ Missing environment variables for Sanity.", { status: 500 });
  }

  // Generate a filename for the backup
  const today = new Date().toISOString().split("T")[0];
  const filename = `backup-${dataset}-${today}.tar.gz`;

  // Set response headers for a downloadable file
  const headers = {
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Content-Type": "application/gzip",
    "Access-Control-Allow-Origin": "*",
  };

  const passThrough = new PassThrough();

  try {
    console.log("🔹 Spawning child process for Sanity export...");

    // Spawn a child process to run the export script
    const child = spawn("node", ["./scripts/export-sanity-data.js", projectId, dataset, token]);

    // Pipe stdout from the child process to our PassThrough stream
    child.stdout.pipe(passThrough);

    // Handle errors from the child process
    child.stderr.on("data", (data) => {
      console.error(`Child process error: ${data}`);
    });

    child.on("close", (code) => {
      if (code !== 0) {
        console.error(`Child process exited with code ${code}`);
        passThrough.destroy(new Error(`Sanity export process failed with code ${code}`));
      } else {
        console.log("✅ Child process finished successfully.");
      }
    });

  } catch (err) {
    console.error("❌ Failed to spawn child process:", err);
    return new Response("Sanity export failed: " + String(err), { status: 500 });
  }

  // Convert Node.js stream to Web stream
  const webStream = Readable.toWeb(passThrough);

  // Return a new Response object with the Web stream and headers
  return new Response(webStream, { headers });
}