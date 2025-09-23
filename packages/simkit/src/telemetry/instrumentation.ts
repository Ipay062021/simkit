import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { FileLogDrainExporter } from "./telemetry";

// Global reference to the SDK for shutdown operations
let globalSDK: NodeSDK | null = null;

export interface TelemetryConfig {
  /** File path for local telemetry logs (default: "./telemetry.jsonl") */
  logFile?: string;
  /** OpenTelemetry endpoint URL for sending telemetry data */
  OTELEndpoint?: string;
  /** Service name for telemetry identification */
  serviceName?: string;
  /** Whether to append to existing file (true) or create separate files with incremental numbers (false). Default: false */
  appendToFile?: boolean;
}

// Initialize telemetry with comprehensive OpenTelemetry data collection
export function initTelemetry(config: TelemetryConfig = {}) {
  const {
    logFile = "./telemetry.jsonl",
    OTELEndpoint,
    serviceName = "simkit",
    appendToFile = false,
  } = config;

  // Choose exporter based on configuration
  let traceExporter;
  let logMessage: string;

  if (OTELEndpoint) {
    // Use OTLP HTTP exporter for remote endpoint
    traceExporter = new OTLPTraceExporter({
      url: `${OTELEndpoint}/v1/traces`,
      headers: {},
    });
    logMessage = `🚀 Telemetry initialized - sending to ${OTELEndpoint}`;
  } else {
    // Use custom file exporter for local logging
    const fileExporter = new FileLogDrainExporter(logFile, appendToFile);
    traceExporter = fileExporter;
    // Access the actual filename that will be used (including any _x suffix)
    logMessage = `🚀 Telemetry initialized - logging to ${fileExporter.getLogFile()}`;
  }

  const sdk = new NodeSDK({
    serviceName,
    traceExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        // Enable comprehensive instrumentation
        "@opentelemetry/instrumentation-http": {
          enabled: true,
        },
        "@opentelemetry/instrumentation-fs": {
          enabled: true,
        },
        "@opentelemetry/instrumentation-dns": {
          enabled: true,
        },
      }),
    ],
  });

  console.log(logMessage);
  sdk.start();

  // Store global reference for shutdown operations
  globalSDK = sdk;

  // Add graceful shutdown handlers to ensure telemetry data is flushed
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n📊 ${signal} received, flushing telemetry data...`);
    try {
      await sdk.shutdown();
      console.log("✅ Telemetry shutdown completed");
    } catch (error) {
      console.error("❌ Error during telemetry shutdown:", error);
    }
    process.exit(0);
  };

  // Handle various exit signals
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("beforeExit", async () => {
    try {
      await sdk.shutdown();
    } catch (error) {
      console.error("❌ Error during telemetry shutdown on beforeExit:", error);
    }
  });

  return sdk;
}

// Function to manually flush and shutdown telemetry
export async function shutdownTelemetry(): Promise<void> {
  if (globalSDK) {
    console.log("📊 Flushing telemetry data...");
    try {
      await globalSDK.shutdown();
      console.log("✅ Telemetry shutdown completed");
      globalSDK = null;
    } catch (error) {
      console.error("❌ Error during telemetry shutdown:", error);
      throw error;
    }
  }
}
