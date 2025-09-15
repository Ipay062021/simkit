# SimKit

[![npm version](https://badge.fury.io/js/%40fallom%2Fsimkit.svg)](https://www.npmjs.com/package/@fallom/simkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Downloads](https://img.shields.io/npm/dm/@fallom/simkit.svg)](https://www.npmjs.com/package/@fallom/simkit)

> 🤖 **A TypeScript simulation framework for testing and running AI agents**

At its core, SimKit provides a **tick-based loop** with **OpenTelemetry support** - perfect for AI agent development, testing, and observability.

## 🔄 Core: The Simulation Loop

SimKit's heart is a simple but powerful tick-based loop:

```typescript
import { createSimulation, type LoopState } from "@fallom/simkit/simulation";

interface MyState extends LoopState {
  agentMoney: number;
  day: number;
}

const simulation = createSimulation<MyState>({
  maxTicks: 100,
  initialState: { agentMoney: 1000, day: 1 },
  
  onTick: async (state) => {
    // Your AI agent logic here
    console.log(`Day ${state.day}: Agent has $${state.agentMoney}`);
    
    // Return true to continue, false to end
    return state.day < 30;
  },
  
  onEnd: (state, reason) => {
    console.log(`Simulation ended: ${reason}`);
  },
});

await simulation.run();
```

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
Reproduce exact scenarios with seeded randomness:

```typescript
import { initializeRandom, choice, shuffle } from "@fallom/simkit/random";

// Set seed for reproducible results
initializeRandom(12345);

// Use deterministic random functions
const randomCustomer = choice(['Alice', 'Bob', 'Carol']);
const shuffledItems = shuffle(inventory);
```

## 📊 OpenTelemetry Integration

Built-in observability for AI agent debugging:

```typescript
import { trace } from "@opentelemetry/api";

// SimKit automatically captures spans for you
const tracer = trace.getTracer("my-simulation");
const span = tracer.startSpan("agent-decision");
span.setAttributes({
  "agent.action": "buy_item",
  "simulation.day": state.day,
});
span.end();
```

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