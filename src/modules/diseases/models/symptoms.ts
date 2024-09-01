import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../database/sequelize';
import DiseaseSymptom from './disease.symptom';
import Disease from './disease';


// Define attributes for the Symptom model
export interface SymptomAttributes {
  id: number;
  description?: string;
  weight?: number;
}

// Define options for the Symptom model
interface SymptomCreationAttributes extends Optional<SymptomAttributes, 'id'> {}

class Symptom extends Model<SymptomAttributes, SymptomCreationAttributes>
  implements SymptomAttributes {
  declare id: number;
  declare weight: number;
  declare description?: string;
  declare diseaseId: number;

  // Timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date;
}

Symptom.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weight: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  sequelize,
  tableName: 'symptoms',
  paranoid: true,

});

export default Symptom;
