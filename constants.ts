import { FontSize, Destination } from './types';

export const DEFAULT_SETTINGS = {
  fontSize: FontSize.LARGE,
  voiceSpeed: 1.0,
  vibrationEnabled: true,
  locationSharingEnabled: true,
  emergencyContactName: 'Dad',
  emergencyContactPhone: '102-540-2931',
};

export const MOCK_DESTINATIONS: Destination[] = [
  { id: '1', name: 'Dana 213 - Society of Women Engineers', category: 'Club', floor: '3rd' },
  { id: '2', name: 'Professor Zeng Office', category: 'Office', floor: '3rd' },
  { id: '3', name: 'EME 120', category: 'Classroom', floor: '1st' },
  { id: '4', name: 'Main Elevator in EECS', category: 'Elevator', floor: 'All' },
  { id: '5', name: 'CUB', category: 'Common Area', floor: '1st' },
  { id: '6', name: 'Holland and Terral Library', category: 'Common Area', floor: '1st' },
];

export const NAVIGATION_STEPS = [
  "Walk forward 20 feet.",
  "Turn slightly right towards the hallway.",
  "Continue straight for 50 feet. You will pass the elevator on your left.",
  "Turn left at the water fountain.",
  "Your destination is the second door on the right."
];
