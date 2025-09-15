# SimKit

[![npm version](https://badge.fury.io/js/%40fallom%2Fsimkit.svg)](https://www.npmjs.com/package/@fallom/simkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Downloads](https://img.shields.io/npm/dm/@fallom/simkit.svg)](https://www.npmjs.com/package/@fallom/simkit)

> 🤖 **A TypeScript simulation framework for testing and running AI agents**

## What is SimKit?

SimKit lets you build, test, and run AI agents in your own custom simulated environments. It gives you a simple game loop for running agents step-by-step, supports multiple agents, and includes built-in tools (OTEL) for tracking what happens during your simulations.

### Agent Agnostic & No Vendor Lock-in

SimKit works with any AI agent or LLM, no lock-in. Use your own models and run everything locally. OTEL logs can be saved to a local file or sent to a remote server.

### Why Use Simulations?

Simulations let you see how your AI agents perform on real world tasks, step by step, in a safe and controlled way.

Traditional evals are great for simple tasks, but they don't give you the full picture. You can't see how your agents handle:

- 🎯 Multi-step tasks that need planning and memory
- 🛠️ Lots of different tools and actions
- 🌍 Realistic data and changing situations
- ⚡ Decisions that matter over time
- 🔄 Long-term planning and decision-making
- 📚 Processing and reasoning over large amounts of context and information

Surprisingly, most AI agents begin to fail when they are asked to do anything more than a few simple tasks.

## 🔄 Core: The Simulation Loop

SimKit's heart is a simple but powerful tick-based loop:

```typescript
import { createSimulation, type LoopState } from "@fallom/simkit/simulation";

interface SupportTestState extends LoopState {
  totalIssues: number;
  resolvedIssues: number;
  averageResponseTime: number;
  satisfactionScores: number[];
}

const customerIssues = [
  "My account is locked and I can't access my files",
  "Billing error - charged twice for same month", 
  "App crashes every time I try to upload",
  "Can't find my downloaded files anywhere"
];

const simulation = createSimulation<SupportTestState>({
  maxTicks: 10,
  initialState: { totalIssues: 0, resolvedIssues: 0, averageResponseTime: 0, satisfactionScores: [] },
  
  onTick: async (state) => {
    // Get today's customer issues
    const dailyIssues = getRandomIssues(customerIssues, 2);
    
    for (const issue of dailyIssues) {
      const startTime = Date.now();
      
      // Test your AI support agent
      const agentResponse = await supportAgent.handle(issue);
      
      const responseTime = Date.now() - startTime;
      const satisfaction = scoreResponse(agentResponse, issue);
      
      state.totalIssues++;
      if (satisfaction > 7) state.resolvedIssues++;
      state.satisfactionScores.push(satisfaction);
      
      // Update running averages
      const avgSatisfaction = state.satisfactionScores.reduce((a,b) => a+b, 0) / state.satisfactionScores.length;
      const resolutionRate = (state.resolvedIssues / state.totalIssues) * 100;
      
      console.log(`Resolution Rate: ${resolutionRate.toFixed(1)}% | Avg Satisfaction: ${avgSatisfaction.toFixed(1)}/10`);
    }
    
    return state.tick < 9; // Test for 10 days
  },
  
  onEnd: (state) => {
    const finalSatisfaction = state.satisfactionScores.reduce((a,b) => a+b, 0) / state.satisfactionScores.length;
    console.log(`🎯 Final Results: ${((state.resolvedIssues/state.totalIssues)*100).toFixed(1)}% resolution rate, ${finalSatisfaction.toFixed(1)}/10 satisfaction`);
  }
});

await simulation.run();
```

**What's happening here?** Each tick simulates a day of customer support. SimKit feeds random issues to your AI agent, measures response quality and speed, then tracks KPIs over time. Perfect for A/B testing different models, regression testing after prompt changes, or measuring performance before production deployment.

## 🤖 Built for AI Agents

### Global State Access
AI agents need access to simulation state from anywhere:

```typescript
import { setSimState, getSimState } from "@fallom/simkit/state";

// In your simulation loop
setSimState(state);

// In your AI tools
const currentState = getSimState<MyState>();
```

### Deterministic Testing
Reproduce exact scenarios with seeded randomness - perfect for fair model comparisons:

```typescript
import { initializeRandom, choice, shuffle } from "@fallom/simkit/random";

// Test Model A
initializeRandom(12345); // Same seed = same test scenarios
const modelA_results = await testSupportAgent(modelA);

// Test Model B with identical scenarios
initializeRandom(12345); // Reset to same seed
const modelB_results = await testSupportAgent(modelB);

// Now you can fairly compare: both models faced the exact same issues
console.log(`Model A: ${modelA_results.satisfaction}/10`);
console.log(`Model B: ${modelB_results.satisfaction}/10`);
```

**Why this matters:** Without seeded randomness, Model A might get easy customer issues while Model B gets hard ones, making comparison meaningless. SimKit ensures every model faces identical test scenarios.

## 📊 OpenTelemetry Integration

Built-in observability for AI agent debugging with **zero vendor lock-in**:

```typescript
import { trace } from "@opentelemetry/api";

// SimKit automatically captures spans for you
const tracer = trace.getTracer("my-simulation");
const span = tracer.startSpan("agent-decision");
span.setAttributes({
  "agent.action": "support_response",
  "simulation.tick": state.tick,
  "response.satisfaction": 8.5
});
span.end();
```

**Send telemetry anywhere:** Export to your own servers, store in local files, or pipe to any OpenTelemetry-compatible service. No vendor lock-in - you own your data.

## ✨ Key Features

| Feature | Why It Matters for AI |
|---------|----------------------|
| 🔄 **Tick-Based Loop** | Step-by-step agent execution with full control |
| 📊 **OpenTelemetry** | Track agent decisions and debug complex behaviors |
| 🎲 **Seeded Random** | Reproduce exact scenarios for testing and validation |
| 🏗️ **Global State** | AI tools can access simulation state from anywhere |
| 🔧 **TypeScript** | Full type safety for complex agent interactions |
| ⚡ **Bun Optimized** | Fast execution for compute-intensive agent simulations |

## 📦 Installation

```bash
npm install @fallom/simkit
# or
bun add @fallom/simkit
```

## 🎮 Examples

### 🚀 Getting Started: Energy AI
**Simple agent making strategic decisions**

```bash
cd apps/examples/energy-ai
bun install && bun run start
```

A straightforward example showing:
- AI agent with tool calling
- Basic state management
- OpenTelemetry integration

### 🏆 Advanced: Pawn Shop Simulation  
**Complex multi-agent economic simulation**

A comprehensive example demonstrating SimKit's full capabilities:
- **Multi-agent system** - Shop owner + customer agents
- **Complex state management** - Inventory, trades, conversations
- **Deterministic scenarios** - Seeded randomness for testing
- **Rich telemetry** - Custom spans and detailed logging
- **Tool ecosystem** - AI agents with 10+ specialized tools

*Perfect for understanding how to build production-grade agent simulations.*

## 🚀 Why SimKit for AI Development?

| Traditional Approach | With SimKit |
|----------------------|-------------|
| ❌ Manual loop management | ✅ Built-in tick-based execution |
| ❌ No observability | ✅ OpenTelemetry integration |
| ❌ Non-deterministic testing | ✅ Seeded randomness |
| ❌ Complex state sharing | ✅ Global state management |
| ❌ Manual telemetry setup | ✅ Automatic span collection |

## 📖 Learn More

- **[📦 Core Package Docs](./packages/simkit/README.md)** - Full API reference
- **[🚀 Energy AI Tutorial](./apps/examples/energy-ai/README.md)** - Simple getting started guide
- **[🏆 Pawn Shop Deep Dive](./examples/pawn/README.md)** - Advanced multi-agent patterns

## 🏗️ Development

```bash
# Install dependencies
bun install

# Build all packages  
bun run build

# Format code
bun run format
```

---

<div align="center">

[![NPM Package](https://img.shields.io/npm/v/@fallom/simkit?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@fallom/simkit)

**🚀 Built for the AI simulation community**

[📖 Documentation](./packages/simkit/README.md) • [🎮 Examples](./apps/examples/) • [🐛 Issues](https://github.com/fallomai/simkit/issues)

</div>