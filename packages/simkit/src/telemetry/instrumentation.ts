import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { FileLogDrainExporter } from "./telemetry";

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

  return sdk;
}
