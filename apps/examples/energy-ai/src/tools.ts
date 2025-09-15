import { tool } from "ai";
import { z } from "zod";

export const exploreTool = tool({
  description: "Explore the environment to gain 5 score but lose 20 energy",
  inputSchema: z.object({
    reason: z.string(),
  }),
  execute: async ({ reason }) => ({ action: "explore", reason }),
});

export const workTool = tool({
  description: "Work to gain 15 score but lose 30 energy",
  inputSchema: z.object({
    reason: z.string(),
  }),
  execute: async ({ reason }) => ({ action: "work", reason }),
});

export const restTool = tool({
  description: "Rest to gain 40 energy",
  inputSchema: z.object({
    reason: z.string(),
  }),
  execute: async ({ reason }) => ({ action: "rest", reason }),
});
