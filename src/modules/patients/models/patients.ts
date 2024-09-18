import { Model, DataTypes, Optional, BelongsToMany } from 'sequelize';
import sequelize from '../../../database/sequelize';
import Authentication from '../../auth/models/auth';
import DiseaseSymptom from '../../diseases/models/disease.symptom';
import { encrypt, decrypt } from '../../../utils';
import PatientHistory from './patient.history';
import Medication from '../../medications/model/medications';
import { EmergencyContact } from 'types';
const pii: (keyof Patient)[]  = ['firstname', 'lastname', 'sex'];

// Define attributes for the session model
export interface PatientAttributes {
  id: string;
  authId: string;
  firstname: string;
  lastname: string;
  dob: string;
  sex: string;
  height?: string;
  weight?: string;
  bloodGroup?: string;
  priorSurgeries?: string;
  alergies?: string;
  emergencyContact?: EmergencyContact;
}

// Define options for the Disease model
interface PatientCreationAttributes extends Optional<PatientAttributes, 'id'> {}

export class Patient extends Model<PatientAttributes, PatientCreationAttributes>
  implements PatientAttributes {
  declare id: string;
  declare authId: string;
  declare firstname: string;
  declare lastname: string;
  declare dob: string;
  declare sex: string;
  declare height: string;
  declare weight: string;
  declare bloodGroup: string;
  declare priorSurgeries: string;
  declare alergies: string;
  declare emergencyContact: EmergencyContact;

  static DiseaseSymptom: BelongsToMany<Patient, DiseaseSymptom>;
}

Patient.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  authId: {
    type: DataTypes.UUID,
    unique: true,
    references: {
      model: Authentication,
      key: 'id',
    },
    allowNull: false,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  height: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  weight: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bloodGroup: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  priorSurgeries: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emergencyContact: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  alergies: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sex: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'patients',
  paranoid: true,
  hooks: {
    afterCreate: (patient: Patient) => {
      if(patient) {
        const patientObj = patient.toJSON() as Patient;
        pii.forEach((key) => {
          if(patientObj[key]) {
            const decryptedValue = decrypt(patientObj[key] as string, patientObj.authId);
            patient[key as keyof Patient] = decryptedValue as never;
          }
        });
      }
    },
    beforeCreate: async (patient: Patient) => {
      try {
        const patientObj = patient.toJSON() as Patient;
        pii.forEach((key) => {
          if(patientObj[key]) {
            const encryptedValue = encrypt(patientObj[key] as string, patientObj.authId);
            patient[key as keyof Patient] = encryptedValue as never;
            //@ts-ignore
            patient.setDataValue(key, encryptedValue);
          } 
        });
      } catch (error) {
        console.log('‼️', error);
      }
    },
    afterFind: async (patient: Patient) => {      
      if(patient && !Array.isArray(patient)) {
        const patientObj = patient.toJSON() as Patient;
        pii.forEach((key) => {
          if(patientObj[key]) {
            const decryptedValue = decrypt(patientObj[key] as string, patientObj.authId);
            patient[key as keyof Patient] = decryptedValue as never;
          }
        });
      }
    },
    beforeUpdate: async (patient: Patient) => {
      const patientObj = patient.toJSON() as Patient;
      pii.forEach((key) => {
        if(patientObj[key]) {
          const encryptedValue = encrypt(patientObj[key] as string, patientObj.authId);
          patient[key as keyof Patient] = encryptedValue as never;
          //@ts-ignore
          patient.setDataValue(key, encryptedValue);
        } 
      });
    },
  }
});

Patient.DiseaseSymptom = Patient.belongsToMany(DiseaseSymptom, { through: PatientHistory, foreignKey: 'patientId' });
DiseaseSymptom.Patient = DiseaseSymptom.belongsToMany(Patient, { through: PatientHistory, foreignKey: 'diseaseandsymptomId' });
Patient.hasMany(Medication, { foreignKey: 'patientId', as: 'meds' });

export default Patient;
