
export enum FontSize {
  SMALL = 'text-base',
  MEDIUM = 'text-xl',
  LARGE = 'text-2xl',
  EXTRA_LARGE = 'text-4xl',
}

export interface AccessibilitySettings {
  fontSize: FontSize;
  voiceSpeed: number;
  vibrationEnabled: boolean;
  locationSharingEnabled: boolean;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface Destination {
  id: string;
  name: string;
  category: string;
  floor: string;
}

export enum NavigationStatus {
  IDLE = 'IDLE',
  NAVIGATING = 'NAVIGATING',
  PAUSED = 'PAUSED',
  ARRIVED = 'ARRIVED',
}
