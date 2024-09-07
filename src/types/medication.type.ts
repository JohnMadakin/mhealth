export type NewMedication = { 
  description: string; 
  name: string; 
  dosage: string; 
  frequency: number; 
  startTime: Date;
  authId?: string;
}