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

export interface DiceRollEvents {
  newRoll: (data: DiceRollEventData) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
declare interface DiceRollEmitter {
  on<U extends keyof DiceRollEvents>(event: U, listener: DiceRollEvents[U]): this;
  emit<U extends keyof DiceRollEvents>(
    event: U,
    ...args: Parameters<DiceRollEvents[U]>
  ): boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class DiceRollEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(0); // Remove limit for concurrent connections
  }
}

// Global singleton instance
const globalForEvents = globalThis as unknown as {
  diceRollEmitter: DiceRollEmitter | undefined;
};

export const diceRollEmitter =
  globalForEvents.diceRollEmitter ?? new DiceRollEmitter();

if (process.env.NODE_ENV !== "production") {
  globalForEvents.diceRollEmitter = diceRollEmitter;
}

export type { DiceRollEventData };