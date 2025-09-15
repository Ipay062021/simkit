/**
 * Seeded Random Number Generator
 *
 * Provides deterministic random number generation when a seed is provided,
 * or falls back to Math.random() when no seed is configured.
 */

class SeededRandom {
  private seed: number;
  private state: number;

  constructor(seed?: number) {
    // If no seed provided, generate one from current time + random
    this.seed = seed ?? Math.floor(Math.random() * 1000000) + Date.now();
    this.state = this.seed;
    console.log(`🎲 Using random seed: ${this.seed}`);
  }

  /**
   * Linear Congruential Generator (LCG) for deterministic random numbers
   * Using parameters from Numerical Recipes
   */
  next(): number {
    this.state = (this.state * 1664525 + 1013904223) % 2 ** 32;
    return this.state / 2 ** 32;
  }

  /**
   * Get random integer between min (inclusive) and max (exclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  /**
   * Get random element from array
   */
  choice<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error("Cannot choose from empty array");
    }
    return array[this.nextInt(0, array.length)]!;
  }

  /**
   * Shuffle array in place using Fisher-Yates algorithm
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [result[i], result[j]] = [result[j]!, result[i]!];
    }
    return result;
  }

  /**
   * Get the seed used for this random generator
   */
  getSeed(): number {
    return this.seed;
  }
}

// Global seeded random instance
let globalRandom: SeededRandom | null = null;

/**
 * Initialize the global random generator with optional seed
 */
export function initializeRandom(seed?: number): SeededRandom {
  globalRandom = new SeededRandom(seed);
  return globalRandom;
}

/**
 * Get the global random generator, initializing if needed
 */
export function getRandom(): SeededRandom {
  if (!globalRandom) {
    globalRandom = new SeededRandom();
  }
  return globalRandom;
}

/**
 * Reset the random generator (useful for tests)
 */
export function resetRandom(): void {
  globalRandom = null;
}

/**
 * Convenience functions that use the global seeded random
 */
export function random(): number {
  return getRandom().next();
}

export function randomInt(min: number, max: number): number {
  return getRandom().nextInt(min, max);
}

export function choice<T>(array: T[]): T {
  return getRandom().choice(array);
}

export function shuffle<T>(array: T[]): T[] {
  return getRandom().shuffle(array);
}

export function getSeed(): number {
  return getRandom().getSeed();
}

// Export the SeededRandom class for advanced usage
export { SeededRandom };
