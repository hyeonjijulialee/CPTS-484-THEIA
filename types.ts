export enum FontSize {
  SMALL = 'text-base',
  MEDIUM = 'text-xl',
  LARGE = 'text-2xl',
  EXTRA_LARGE = 'text-4xl',
}

export interface AccessibilitySettings {
  fontSize: FontSize;
  voiceSpeed: number; // 0.5 to 2.0
  vibrationEnabled: boolean;
  locationSharingEnabled: boolean;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface Destination {
  id: string;
  name: string;
  category: string; // Classroom, Office, Restroom, etc.
  floor: string;
}

export enum NavigationStatus {
  IDLE = 'IDLE',
  NAVIGATING = 'NAVIGATING',
  PAUSED = 'PAUSED',
  ARRIVED = 'ARRIVED',
}
