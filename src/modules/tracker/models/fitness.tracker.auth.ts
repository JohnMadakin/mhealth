import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../database/sequelize';
import patients from '../../patients/models/patients';


// Define attributes for the Tracker model
export interface FitnessTrackerAuthAttributes {
  id: number;
  patientId: string;
  verificationCode?: string;
  token?: string;
  refreshToken?: string;
  expiry?: number;
}

// Define options for the Tracker model
interface FitnessTrackerAuthCreationAttributes extends Optional<FitnessTrackerAuthAttributes, 'id'> {}

class FitnessTrackerAuth extends Model<FitnessTrackerAuthAttributes, FitnessTrackerAuthCreationAttributes>
  implements FitnessTrackerAuthAttributes {
    declare id: number;
    declare patientId: string;
    declare verificationCode: string;
    declare token: string;
    declare refreshToken: string;
    declare expiry: number;
}

FitnessTrackerAuth.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  verificationCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expiry: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  patientId: {
    type: DataTypes.UUID,
    references: {
      model: patients,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  }
}, {
  sequelize,
  tableName: 'fitnesstrackerAuth',
  timestamps: true,
  paranoid: true,
});


export default FitnessTrackerAuth;
