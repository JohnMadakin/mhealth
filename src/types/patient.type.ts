export type NewPatient = { 
  firstname: string; 
  lastname: string; 
  dob: string; 
  sex: string; 
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