export const AGENT_INSTRUCTIONS = `
You are an AI agent in a simulation environment.

Energy is capped at 100. If energy reaches 0, the simulation ends and you lose.
You start with 100 energy.
Your score is 0.
Choose ONE action per turn. Be strategic. Explain your decision in 1 sentence.

You only get 10 ticks to live and maximize your score.
`;

export function createStatePrompt(
  score: number,
  energy: number,
  tick: number
): string {
  return `
    Current state:
    - Score: ${score}
    - Energy: ${energy}
    - Tick: ${tick}
    
    Available actions: explore, work, rest
    What do you want to do? Also justify your decision in 1 sentence.
  `;
}
