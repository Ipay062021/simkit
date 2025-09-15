# Energy AI Example

An AI-powered simulation example demonstrating how to use `@fallom/simkit` with OpenRouter's AI SDK for intelligent agent decision-making.

## Overview

This example shows an AI agent managing energy and score in a tick-based simulation. The agent chooses between three actions each turn:
- **Explore**: +5 score, -20 energy
- **Work**: +15 score, -30 energy  
- **Rest**: +40 energy

The AI agent uses OpenRouter (OpenAI GPT-4o-mini) to make strategic decisions to maximize score while managing limited energy over 10 ticks.

## Features

- 🤖 **AI Decision Making**: Uses OpenRouter AI SDK with tool calling
- 🔄 **Simulation Framework**: Built with `@fallom/simkit`
- 📊 **Telemetry**: Automatic logging of AI interactions
- 🎲 **Deterministic**: Reproducible results with seeded randomness
- 🛠️ **Clean Architecture**: Separated prompts, tools, and simulation logic

## Setup

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Set up OpenRouter API key:**
   ```bash
   # Create .env.local file
   echo "OPENROUTER_API_KEY=your_key_here" > .env.local
   ```
   Get your API key from [OpenRouter](https://openrouter.ai/)

3. **Run the simulation:**
   ```bash
   bun run energy-ai
   # or
   bun run src/index.ts
   ```

## Code Structure

```
src/
├── index.ts      # Main simulation loop using @fallom/simkit
├── agent.ts      # AI agent configuration with OpenRouter
├── tools.ts      # Tool definitions for AI actions
└── prompts.ts    # System and user prompts
```

## How it Uses @fallom/simkit

### 1. Simulation Loop
```typescript
import { createSimulation, type LoopState } from "@fallom/simkit/simulation";

interface EnergyAIState extends LoopState {
  agentName: string;
  score: number;
  energy: number;
}

const simulation = createSimulation<EnergyAIState>({
  maxTicks: 10,
  initialState: {
    agentName: "AI-Agent",
    score: 0,
    energy: 100,
  },
  onTick: async (state) => {
    // AI decision making and state updates
  },
  onEnd: (state, reason) => {
    // Final results
  },
});
```

### 2. AI Integration
The simulation calls the AI agent each tick:
```typescript
const response = await runEnergyAgent(prompt);
const action = response.toolResults[0]?.output?.action;

// Apply action effects to simulation state
if (action === "explore") {
  state.score += 5;
  state.energy -= 20;
}
```

### 3. Telemetry (Optional)
Add telemetry tracking:
```typescript
import { initTelemetry } from "@fallom/simkit/telemetry";
initTelemetry("./energy-ai-logs.jsonl");
```

## AI Tools

The AI has access to three tools defined in `tools.ts`:

- `exploreTool`: Gain score, lose energy
- `workTool`: Gain more score, lose more energy  
- `restTool`: Restore energy

Each tool requires a `reason` parameter for the AI to explain its decision.

## Example Output

```
🔄 Simulation starting...

=== Tick 1 ===
Agent: AI-Agent
Score: 0, Energy: 100
Agent decision: work I'll start with work to maximize early score gains while energy is high.
💼 Working... +15 score, -30 energy

=== Tick 2 ===
Agent: AI-Agent  
Score: 15, Energy: 70
Agent decision: explore I'll explore to build score while conserving energy for later ticks.
🔍 Exploring... +5 score, -20 energy

...

📊 AI Simulation Results:
Agent: AI-Agent
Final Score: 95
Final Energy: 20
Total Ticks: 10
End Reason: Max ticks reached
```

## Customization

### Modify Agent Behavior
Edit `prompts.ts` to change the AI's system instructions or decision-making context.

### Add New Actions
1. Add new tools in `tools.ts`
2. Update the prompt in `prompts.ts`
3. Handle new actions in `index.ts`

### Change AI Model
Modify `agent.ts` to use different OpenRouter models:
```typescript
model: openrouter("anthropic/claude-3-sonnet", { ... })
```

## Learn More

- [SimKit Documentation](../../../packages/simkit/README.md)
- [OpenRouter AI SDK](https://github.com/openrouter/ai-sdk-provider)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

This example demonstrates the power of combining simulation frameworks with AI decision-making for complex, intelligent behaviors.