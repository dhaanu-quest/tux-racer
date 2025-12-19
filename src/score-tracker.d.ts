/**
 * Type definitions for TuxRacer Score Tracking
 * Use this file for TypeScript support when integrating the game
 */

/**
 * Score data that is emitted when a race ends
 */
export interface ScoreData {
  /** The course key/identifier (e.g., "bunny-hill", "frozen-river") */
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
 * Global TuxRacer Score Tracker API
 */
export interface TuxRacerScoreTrackerAPI {
  /**
   * Configure the score tracker
   * @param config - Configuration options
   */
  configure: (config: ScoreTrackerConfig) => void;
  
  /**
   * Get the last submitted score
   * @returns The last score data or null if no scores yet
   */
  getLastScore: () => ScoreData | null;
}

/**
 * Custom event detail for tuxracer:score event
 */
export interface TuxRacerScoreEvent extends CustomEvent {
  detail: ScoreData;
}

/**
 * Global window extensions
 */
declare global {
  interface Window {
    /**
     * TuxRacer Score Tracker API
     * Available after the game loads
     */
    TuxRacerScoreTracker?: TuxRacerScoreTrackerAPI;
  }

  interface WindowEventMap {
    /**
     * Custom event fired when a score is submitted
     */
    'tuxracer:score': TuxRacerScoreEvent;
  }
}

/**
 * Configure TuxRacer score tracking
 * @param config - Configuration options
 */
export function configureTuxRacerScoreTracking(config: ScoreTrackerConfig): void;

