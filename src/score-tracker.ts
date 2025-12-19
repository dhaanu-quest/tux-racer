import { GameContext } from "./game/game-context.ts";

/**
 * Score data that is emitted when a race ends
 */
export interface ScoreData {
  /** The course key/identifier */
  course: string;
  /** Race time in milliseconds */
  timeMs: number;
  /** Race time in seconds (formatted) */
  timeSeconds: number;
  /** Number of items (herring) collected */
  itemsCollected: number;
  /** Whether the race was completed (true) or aborted (false) */
  completed: boolean;
  /** ISO timestamp when the race ended */
  timestamp: string;
}

/**
 * Callback function type for score tracking
 */
export type ScoreCallback = (scoreData: ScoreData) => void;

/**
 * Configuration options for score tracking
 */
export interface ScoreTrackerConfig {
  /** Callback function to receive score data */
  onScoreSubmit?: ScoreCallback;
  /** Whether to dispatch custom events (default: true) */
  dispatchEvents?: boolean;
  /** Whether to log scores to console (default: false) */
  logToConsole?: boolean;
}

/**
 * ScoreTracker handles score tracking and reporting for the game
 */
export class ScoreTracker {
  private static instance: ScoreTracker | null = null;
  private config: ScoreTrackerConfig = {
    dispatchEvents: true,
    logToConsole: false,
  };

  private constructor() {}

  /**
   * Get the singleton instance of ScoreTracker
   */
  public static getInstance(): ScoreTracker {
    if (!ScoreTracker.instance) {
      ScoreTracker.instance = new ScoreTracker();
    }
    return ScoreTracker.instance;
  }

  /**
   * Configure the score tracker
   */
  public configure(config: ScoreTrackerConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Submit score data when race ends
   */
  public submitScore(aborted: boolean = false): void {
    const scoreData = this.buildScoreData(aborted);

    // Call the callback if provided
    if (this.config.onScoreSubmit) {
      this.config.onScoreSubmit(scoreData);
    }

    // Dispatch custom event if enabled
    if (this.config.dispatchEvents) {
      this.dispatchScoreEvent(scoreData);
    }

    // Log to console if enabled
    if (this.config.logToConsole) {
      console.log("TuxRacer Score:", scoreData);
    }
  }

  /**
   * Build score data from game context
   */
  private buildScoreData(aborted: boolean): ScoreData {
    const timeMs = aborted
      ? 0
      : (GameContext.endTime ?? 0) - (GameContext.startTime ?? 0);

    return {
      course: GameContext.courseConfig.key,
      timeMs,
      timeSeconds: timeMs / 1000,
      itemsCollected: GameContext.collectedItems,
      completed: !aborted,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Dispatch a custom event with score data
   */
  private dispatchScoreEvent(scoreData: ScoreData): void {
    const event = new CustomEvent("tuxracer:score", {
      detail: scoreData,
      bubbles: true,
      composed: true,
    });
    window.dispatchEvent(event);
  }
}

/**
 * Global configuration function for easy setup
 */
export function configureTuxRacerScoreTracking(
  config: ScoreTrackerConfig,
): void {
  ScoreTracker.getInstance().configure(config);
}

/**
 * Expose score tracker to window for external access
 */
declare global {
  interface Window {
    TuxRacerScoreTracker?: {
      configure: (config: ScoreTrackerConfig) => void;
      getLastScore: () => ScoreData | null;
    };
  }
}

// Make it available globally
if (typeof window !== "undefined") {
  let lastScore: ScoreData | null = null;

  window.TuxRacerScoreTracker = {
    configure: (config: ScoreTrackerConfig) => {
      ScoreTracker.getInstance().configure(config);
    },
    getLastScore: () => lastScore,
  };

  // Store last score when event is dispatched
  window.addEventListener("tuxracer:score", ((event: CustomEvent) => {
    lastScore = event.detail;
  }) as EventListener);
}

