import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../database/sequelize';
import Patients from './patients';
import DiseaseSymptoms from '../../diseases/models/disease.symptom';

class PatientDiseaseSymptom extends Model {}

PatientDiseaseSymptom.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    patientId: {
      type: DataTypes.UUID,
      references: {
        model: Patients,
        key: 'id',
      },
      primaryKey: true,
    },
    diseaseandsymptomId: {
      type: DataTypes.UUID,
      references: {
        model: DiseaseSymptoms,
        key: 'id',
      },
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'patientDiseaseSymptom',
    paranoid: true,
  }
);


export default PatientDiseaseSymptom;
