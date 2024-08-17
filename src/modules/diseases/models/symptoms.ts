import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../database/sequelize';

// Define attributes for the Symptom model
interface SymptomAttributes {
  id: number;
  description?: string;
  weight: number;
}

// Define options for the Symptom model
interface SymptomCreationAttributes extends Optional<SymptomAttributes, 'id'> {}

class Symptom extends Model<SymptomAttributes, SymptomCreationAttributes>
  implements SymptomAttributes {
  public id!: number;
  public weight!: number;
  public description?: string;
  public diseaseId!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
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
});

export default Symptom;
