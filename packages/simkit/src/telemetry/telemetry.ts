import type { ExportResult } from "@opentelemetry/core";
import { ExportResultCode as ExportResultCodeValue } from "@opentelemetry/core";

// Comprehensive file-based telemetry exporter that writes detailed JSON Lines
export class FileLogDrainExporter {
  private logFile: string;
  private appendToFile: boolean;

  constructor(
    logFile: string = "./telemetry.jsonl",
    appendToFile: boolean = false
  ) {
    this.appendToFile = appendToFile;
    this.logFile = appendToFile
      ? logFile
      : this.generateUniqueFilename(logFile);
  }

  getLogFile(): string {
    return this.logFile;
  }

  private generateUniqueFilename(basePath: string): string {
    // Parse the base filename and extension
    const lastDotIndex = basePath.lastIndexOf(".");
    const baseNameWithoutExt =
      lastDotIndex !== -1 ? basePath.slice(0, lastDotIndex) : basePath;
    const extension = lastDotIndex !== -1 ? basePath.slice(lastDotIndex) : "";

    // Check if base file exists
    let counter = 0;
    let filename = basePath;

    // Keep incrementing until we find a filename that doesn't exist
    // Use synchronous file system check instead of Bun.file().exists()
    const fs = require("fs");
    while (fs.existsSync(filename)) {
      counter++;
      filename = `${baseNameWithoutExt}_${counter}${extension}`;
    }

    return filename;
  }

  export(spans: any[], resultCallback: (result: ExportResult) => void): void {
    const logEntries = spans.map((span) => {
      const spanContext = span.spanContext();
      const startTimeMs =
        span.startTime[0] * 1000 + span.startTime[1] / 1000000;
      const endTimeMs = span.endTime[0] * 1000 + span.endTime[1] / 1000000;

      return {
        // Core telemetry data
        timestamp: new Date().toISOString(),
        traceId: spanContext.traceId,
        spanId: spanContext.spanId,
        parentSpanId: span.parentSpanId || undefined,
        name: span.name,
        kind: span.kind,

        // Timing information
        startTime: new Date(startTimeMs).toISOString(),
        endTime: new Date(endTimeMs).toISOString(),
        duration: endTimeMs - startTimeMs,

        // Status and error information
        status: {
          code: span.status.code,
          message: span.status.message,
        },

        // Resource information
        resource: span.resource?.attributes || {},

        // Instrumentation scope
        instrumentationScope: {
          name:
            span.instrumentationLibrary?.name ||
            span.instrumentationScope?.name ||
            "unknown",
          version:
            span.instrumentationLibrary?.version ||
            span.instrumentationScope?.version ||
            undefined,
          schemaUrl:
            span.instrumentationLibrary?.schemaUrl ||
            span.instrumentationScope?.schemaUrl ||
            undefined,
        },

        // Attributes (tags/labels)
        attributes: span.attributes,

        // Events (structured logs within the span)
        events:
          span.events?.map((event: any) => ({
            name: event.name,
            attributes: event.attributes,
            time: new Date(
              event.time[0] * 1000 + event.time[1] / 1000000
            ).toISOString(),
          })) || [],

        // Links to other spans
        links:
          span.links?.map((link: any) => ({
            traceId: link.context.traceId,
            spanId: link.context.spanId,
            attributes: link.attributes,
          })) || [],

        // Additional metadata
        droppedAttributesCount: span.droppedAttributesCount || 0,
        droppedEventsCount: span.droppedEventsCount || 0,
        droppedLinksCount: span.droppedLinksCount || 0,
      };
    });

    // Write to file (using Bun's built-in file writing)
    const logData =
      logEntries.map((entry) => JSON.stringify(entry)).join("\n") + "\n";

    // Use async IIFE to handle file writing
    (async () => {
      try {
        // Write to the unique file (append mode since we have a unique file each run)
        const file = Bun.file(this.logFile);
        const existingContent = (await file.exists()) ? await file.text() : "";
        const newContent = existingContent + logData;

        await Bun.write(this.logFile, newContent, { createPath: true });
        // console.log(`📝 Wrote ${spans.length} span(s) to ${this.logFile}`);
        resultCallback({ code: ExportResultCodeValue.SUCCESS });
      } catch (error) {
        console.error("❌ Failed to write telemetry logs:", error);
        resultCallback({ code: ExportResultCodeValue.FAILED });
      }
    })();
  }

  async shutdown(): Promise<void> {
    // Force flush any remaining data before shutdown
    await this.forceFlush();
    console.log("📁 FileLogDrainExporter shutdown completed");
  }

  async forceFlush(): Promise<void> {
    // In our implementation, we write immediately, so no buffering to flush
    // But we can add a small delay to ensure any pending async operations complete
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("💾 FileLogDrainExporter flush completed");
        resolve();
      }, 100);
    });
  }
}
