
export interface Keypoint {
  x: number;
  y: number;
  score?: number;
  name?: string;
}

export interface Pose {
  keypoints: Keypoint[];
  score: number;
}

export enum ExerciseState {
  IDLE = 'IDLE',
  STARTING = 'STARTING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED'
}

export interface VoiceMessage {
  text: string;
  priority: 'high' | 'normal';
}
