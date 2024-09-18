import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../database/sequelize';


// Define attributes for the MedicationAdherence model
export interface MedicationAdherenceAttributes {
  id: number;
  patientId: string;
  medicationId: string;
  notes: string;
  doseTime: Date;
  takenTime: Date;
  adherenceStatus?: string;
}

// Define options for the MedicationAdherence model
interface MedicationAdherenceCreationAttributes extends Optional<MedicationAdherenceAttributes, 'id'> {}

class MedicationAdherence extends Model<MedicationAdherenceAttributes, MedicationAdherenceCreationAttributes>
  implements MedicationAdherenceAttributes {
    declare id: number;
    declare patientId: string;
    declare medicationId: string;
    declare notes: string;
    declare adherenceStatus: string;
    declare takenTime: Date;
    declare doseTime: Date;
  }
/* 
  medicationId int [ref: > M.id]  // Reference to medications table
  patientId int [ref: > P.id]  // Reference to patients table
  adherenceStatus enum('taken', 'missed', 'late')  // Status of adherence
  doseTime datetime  // The time the medication was scheduled to be taken
  takenTime datetime  // The time the medication was actually taken (nullable if missed)
  notes varchar // Any additional information about the medication event (optional)
  crea
*/
MedicationAdherence.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  doseTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  takenTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  adherenceStatus: {
    type: DataTypes.ENUM('taken', 'missed', 'late'),
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
  medicationId: {
    type: DataTypes.UUID,
    references: {
      model: 'medications',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  sequelize,
  tableName: 'medicationAdherence',
  paranoid: true,
  timestamps: true
});


export default MedicationAdherence;
