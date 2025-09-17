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
}

// Initialize telemetry with comprehensive OpenTelemetry data collection
export function initTelemetry(config: TelemetryConfig = {}) {
  const {
    logFile = "./telemetry.jsonl",
    OTELEndpoint,
    serviceName = "simkit",
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
    traceExporter = new FileLogDrainExporter(logFile);
    logMessage = `🚀 Telemetry initialized - logging to ${logFile}`;
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
