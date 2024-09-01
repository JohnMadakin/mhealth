import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../database/sequelize';
// import Symptom from './symptoms';
// import DiseaseSymptom from './disease.symptom';


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
  declare id: number;
  declare name: string;
  declare description?: string;

  // Timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date;
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

// // Define Many-to-Many relationships
// Disease.belongsToMany(Symptom, { through: 'DiseaseSymptom', foreignKey: 'diseaseId' });
// Symptom.belongsToMany(Disease, { through: 'DiseaseSymptom', foreignKey: 'symptomId' });

export default Disease;
