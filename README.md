# SimKit

[![npm version](https://badge.fury.io/js/%40fallom%2Fsimkit.svg)](https://badge.fury.io/js/%40fallom%2Fsimkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript simulation framework with built-in telemetry, deterministic randomness, and state management.

## Features

- 🔄 **Simulation Loop**: Easy-to-use simulation runner with tick-based execution
- 📊 **Built-in Telemetry**: OpenTelemetry integration for observability
- 🎲 **Seeded Random**: Deterministic random number generation for reproducible results
- 🏗️ **State Management**: Global state utilities for complex simulations
- 📦 **Modular**: Import only what you need with tree-shakable exports
- 🤖 **AI Ready**: Perfect for AI-powered simulations and agent-based modeling

## Installation

```bash
npm install @fallom/simkit
# or
bun add @fallom/simkit
```

## Quick Start

```typescript
import { createSimulation, type LoopState } from "@fallom/simkit/simulation";

interface MyState extends LoopState {
  score: number;
  energy: number;
}

const simulation = createSimulation<MyState>({
  maxTicks: 10,
  initialState: { score: 0, energy: 100 },
  onTick: async (state) => {
    console.log(`Tick ${state.tick}: Score=${state.score}, Energy=${state.energy}`);
    
    // Your simulation logic here
    state.score += 5;
    state.energy -= 10;
    
    return state.energy > 0; // Continue if energy > 0
  },
  onEnd: (state, reason) => {
    console.log(`Final score: ${state.score}`);
  },
});

await simulation.run();
```

## Examples

### 🤖 AI-Powered Energy Management
See our [Energy AI Example](./apps/examples/energy-ai/) - an intelligent agent that uses OpenRouter AI to make strategic decisions in a resource management simulation.

```bash
cd apps/examples/energy-ai
bun install
bun run energy-ai
```

Features demonstrated:
- AI decision-making with tool calling
- Strategic resource management
- Telemetry tracking
- Clean separation of concerns

## Documentation

- **📖 [Full API Documentation](./packages/simkit/README.md)**
- **🤖 [AI Example Tutorial](./apps/examples/energy-ai/README.md)**

## Repository Structure

This is a Turborepo monorepo containing:

```
packages/
├── simkit/           # Core simulation framework
└── ...

apps/
└── examples/
    └── energy-ai/    # AI-powered simulation example
```

## Development

```bash
# Install dependencies
bun install

# Build all packages
bun run build

# Run in development mode
bun run dev

# Format code
bun run format
```

## Publishing to NPM

The `@fallom/simkit` package is available on NPM. To publish updates:

```bash
# Build the package
cd packages/simkit
bun run build

# Bump version
npm version patch|minor|major

# Publish to NPM
npm publish
```

## License

MIT © [Fallom](https://github.com/fallom)

## Contributing

Contributions welcome! Please read our contributing guidelines and submit PRs.

---

**Built with ❤️ for the simulation community**