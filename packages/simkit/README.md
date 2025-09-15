# @fallom/simkit

A TypeScript simulation framework with built-in telemetry, deterministic randomness, and state management.

> 📖 **Main Documentation**: See the [main repository README](../../README.md) for overview and examples.

## Features

- 🔄 **Simulation Loop**: Easy-to-use simulation runner with tick-based execution
- 📊 **Built-in Telemetry**: OpenTelemetry integration for observability
- 🎲 **Seeded Random**: Deterministic random number generation for reproducible results
- 🏗️ **State Management**: Global state utilities for complex simulations
- 📦 **Modular**: Import only what you need with tree-shakable exports

## Installation

```bash
npm install @fallom/simkit
# or
bun add @fallom/simkit
```

## Quick Start

### Basic Simulation

```typescript
import { createSimulation, type LoopState } from "@fallom/simkit/simulation";

interface MyState extends LoopState {
  score: number;
  energy: number;
}

const simulation = createSimulation<MyState>({
  maxTicks: 10,
  initialState: {
    score: 0,
    energy: 100,
  },
  onTick: async (state) => {
    console.log(`Tick ${state.tick}: Score=${state.score}, Energy=${state.energy}`);
    
    // Your simulation logic here
    state.score += 5;
    state.energy -= 10;
    
    // Continue if energy > 0
    return state.energy > 0;
  },
  onEnd: (state, reason) => {
    console.log(`Simulation ended: ${reason}`);
    console.log(`Final score: ${state.score}`);
  },
});

await simulation.run();
```

### Deterministic Random

```typescript
import { initializeRandom, random, randomInt, choice } from "@fallom/simkit/random";

// Initialize with a seed for reproducible results
initializeRandom(12345);

// Use random functions
const value = random(); // 0-1
const dice = randomInt(1, 7); // 1-6
const item = choice(['apple', 'banana', 'cherry']);

console.log(`Seed: ${getSeed()}`); // Logs: 12345
```

### Telemetry Integration

```typescript
import { initTelemetry } from "@fallom/simkit/telemetry";

// Initialize telemetry (writes to ./telemetry.jsonl by default)
initTelemetry("./my-simulation-logs.jsonl");

// Your simulation will now automatically log telemetry data
```

## API Reference

### Simulation

#### `createSimulation<T>(config)`

Creates a new simulation instance.

**Parameters:**
- `config.maxTicks?` - Maximum number of ticks to run
- `config.initialState?` - Initial state values
- `config.onTick` - Function called each tick, return `false` to stop
- `config.onEnd?` - Function called when simulation ends

**Returns:** Simulation object with `run()` method

#### `LoopState`

Base interface for simulation state:
```typescript
interface LoopState {
  tick: number;
}
```

### Random

#### `initializeRandom(seed?)`
Initialize global random generator with optional seed.

#### `random()`
Get random number between 0-1.

#### `randomInt(min, max)`
Get random integer between min (inclusive) and max (exclusive).

#### `choice<T>(array)`
Get random element from array.

#### `shuffle<T>(array)`
Shuffle array using Fisher-Yates algorithm.

#### `getSeed()`
Get the current seed being used.

### Telemetry

#### `initTelemetry(logFile?)`
Initialize OpenTelemetry with file-based JSON Lines exporter.

**Parameters:**
- `logFile` - Path to log file (default: "./telemetry.jsonl")

### State Management

#### `setSimState<T>(state)`
Set global simulation state.

#### `getSimState<T>()`
Get global simulation state.

#### `clearSimState()`
Clear global simulation state.

## Examples

Check out the [energy-ai example](../../apps/examples/energy-ai/) for a complete AI-powered simulation using OpenRouter and tool calling.

### Import Patterns

```typescript
// Import everything
import { createSimulation, initializeRandom, initTelemetry } from "@fallom/simkit";

// Import specific modules
import { createSimulation } from "@fallom/simkit/simulation";
import { random } from "@fallom/simkit/random";
import { initTelemetry } from "@fallom/simkit/telemetry";
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type { LoopState, SimulationConfig } from "@fallom/simkit/simulation";
import type { SeededRandom } from "@fallom/simkit/random";
```

## Development

```bash
# Build the library
bun run build

# Watch mode for development
bun run dev
```

## License

MIT

## Contributing

Contributions welcome! Please read our contributing guidelines and submit PRs.