import { generateText, stepCountIs } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { exploreTool, workTool, restTool } from "./tools";
import { AGENT_INSTRUCTIONS } from "./prompts";

// Configure OpenRouter
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function runEnergyAgent(prompt: string) {
  return await generateText({
    model: openrouter("openai/gpt-4o-mini", {
      usage: {
        include: true,
      },
    }),
    messages: [
      { role: "system", content: AGENT_INSTRUCTIONS },
      { role: "user", content: prompt },
    ],
    tools: { exploreTool, workTool, restTool },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "energy-agent",
      metadata: {
        agentType: "energy-management",
        version: "ai-sdk",
      },
    },
    stopWhen: stepCountIs(1),
  });
}
