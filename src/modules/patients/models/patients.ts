import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../database/sequelize';
import Authentication from '../../auth/models/auth';
import { encrypt, decrypt } from '../../../utils';
const pii: (keyof Patient)[]  = ['firstname', 'lastname', 'sex'];

// Define attributes for the session model
export interface PatientAttributes {
  id: number;
  authId: string;
  firstname: string;
  lastname: string;
  dob: string;
  sex: string;
}

// Define options for the Disease model
interface PatientCreationAttributes extends Optional<PatientAttributes, 'id'> {}

export class Patient extends Model<PatientAttributes, PatientCreationAttributes>
  implements PatientAttributes {
  declare id: number;
  declare authId: string;
  declare firstname: string;
  declare lastname: string;
  declare dob: string;
  declare sex: string;
}

Patient.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  authId: {
    type: DataTypes.UUID,
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
    afterFind: async (patient: Patient) => {      
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

export default Patient;
