import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../database/sequelize';
import Symptom from './symptoms';

// Define attributes for the Disease model
export interface DiseaseAttributes {
  id: number;
  name: string;
  description?: string;
}

// Define options for the Disease model
interface DiseaseCreationAttributes extends Optional<DiseaseAttributes, 'id'> {}

class Disease extends Model<DiseaseAttributes, DiseaseCreationAttributes>
  implements DiseaseAttributes {
  public id!: number;
  public name!: string;
  public description?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Disease.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'diseases',
  paranoid: true,
});


export default Disease;
