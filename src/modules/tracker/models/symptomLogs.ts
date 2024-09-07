import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../database/sequelize';
import Patients from '../../patients/models/patients';
import Symptom from '../../diseases/models/symptoms';

export interface SymptomLogAttributes {
  id: number;
  patientId: string;
  symptomId: number;
  severity: number;
  description?: string;
  loggedAt?: Date;
}

// Define options for the Symptomlog model
interface SymptomLogCreationAttributes extends Optional<SymptomLogAttributes, 'id'> {}

class SymptomLog extends Model<SymptomLogAttributes, SymptomLogCreationAttributes>
  implements SymptomLogAttributes {
    declare id: number;
    declare patientId: string;
    declare symptomId: number;
    declare severity: number;
    declare description?: string;
    declare loggedAt: Date;
}
SymptomLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
    symptomId: {
      type: DataTypes.INTEGER,
      references: {
        model: Symptom,
        key: 'id',
      },
      primaryKey: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    severity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    loggedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'patientHistory',
    paranoid: true,
    timestamps: true,
  }
);


export default SymptomLog;
