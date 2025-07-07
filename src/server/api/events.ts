import { EventEmitter } from "events";

interface DiceRollEventData {
  id: string;
  gameId: string;
  name: string;
  rollType: string;
  total: number;
  modifier?: number | null;
  finalTotal?: number | null;
  hopeResult?: number | null;
  fearResult?: number | null;
  individualResults: unknown;
  diceExpression: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  character?: {
    id: string;
    name: string;
  } | null;
}

interface FearUpdateEventData {
  gameId: string;
  fearCount: number;
  updatedAt: Date;
}

export interface GameEvents {
  newRoll: (data: DiceRollEventData) => void;
  fearUpdate: (data: FearUpdateEventData) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
declare interface GameEmitter {
  on<U extends keyof GameEvents>(event: U, listener: GameEvents[U]): this;
  emit<U extends keyof GameEvents>(
    event: U,
    ...args: Parameters<GameEvents[U]>
  ): boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class GameEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(0); // Remove limit for concurrent connections
  }
}

// Global singleton instance
const globalForEvents = globalThis as unknown as {
  gameEmitter: GameEmitter | undefined;
};

export const gameEmitter = globalForEvents.gameEmitter ?? new GameEmitter();

if (process.env.NODE_ENV !== "production") {
  globalForEvents.gameEmitter = gameEmitter;
}

// Keep backward compatibility
export const diceRollEmitter = gameEmitter;

export type { DiceRollEventData, FearUpdateEventData };
