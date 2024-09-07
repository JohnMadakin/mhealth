import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../database/sequelize';
// import patients from '../../patients/models/patients';
// import activities from '../../activities/models/activities';


// Define attributes for the Medication model
export interface MedicationAttributes {
  id: number;
  patientId: string;
  name: string;
  dosage: string;
  frequency?: number;
  startTime?: Date;
  nextDose?: Date;
}

// Define options for the Medication model
interface MedicationCreationAttributes extends Optional<MedicationAttributes, 'id'> {}

class Medication extends Model<MedicationAttributes, MedicationCreationAttributes>
  implements MedicationAttributes {
    declare id: number;
    declare patientId: string;
    declare name: string;
    declare dosage: string;
    declare frequency: number;
    declare startTime: Date;
    declare nextDose: Date;
  }

Medication.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  frequency: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  nextDose: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  patientId: {
    type: DataTypes.UUID,
    references: {
      model: 'patients',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  sequelize,
  tableName: 'medications',
  paranoid: true,
  timestamps: true
});


export default Medication;
