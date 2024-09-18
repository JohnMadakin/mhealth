export type NewPatient = { 
  firstname: string; 
  lastname: string; 
  dob: string; 
  sex: string; 
  healthProvider?: string;
  height?: string;
  weight?: string;
  bloodGroup?: string;
  priorSurgeries?: string;
  emergencyContact?: EmergencyContact;
  alergies?: string;
}

export type EmergencyContact = {
  name: string;
  phoneNo: string;
  address: string;
}
export type NewSymptomLog = { 
  authId?: string;
  symptomId: number; 
  severity: number; 
  description: string; 
}

type DiseaseSymptom = string;

export type PatientSicknessSymptomsDatum = {
  authId: string;
  patientId: string;
  diseaseSymptomId: DiseaseSymptom;
}

export type PatientSicknessSymptomsData = {
  authId: string;
  patientId: string;
  diseasesAndSymptoms:DiseaseSymptom []
}